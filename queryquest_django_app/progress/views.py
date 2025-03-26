from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import Progress
from users.models import Student  # Import Student model from the users app
from problems.models import Problem  # Import Problem model from the problems app
from .serializers import ProgressSerializer
from users.serializers import UserSerializer
from problems.serializers import ProblemSerializer
from rest_framework.exceptions import NotFound

class ProgressView(APIView):
    def post(self, request, student_id, problem_id):
        # Check if the progress already exists
        if Progress.objects.filter(student_id=student_id, problem_id=problem_id).exists():
            raise NotFound(detail="Progress already exists for this student and problem.")

        # Create the Progress
        progress_data = {
            'student': student_id,
            'problem': problem_id,
            'status': 'Incomplete',  # Initial status
            'complete_at': None,     # Initially no completion time
        }

        serializer = ProgressSerializer(data=progress_data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    # allow updating the status and complete_at fields of the Progress entry.
    def patch(self, request, student_id, problem_id):
        try:
            # Get the existing Progress entry
            progress = Progress.objects.get(student_id=student_id, problem_id=problem_id)
        except Progress.DoesNotExist:
            raise NotFound(detail="Progress not found for this student and problem.")

        # Get updated data from the request
        serializer = ProgressSerializer(progress, data=request.data, partial=True)

        if serializer.is_valid():
            serializer.save()  # Save the updated data
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


    def get(self, request, student_id, problem_id):
        try:
            # Retrieve the progress entry
            progress = Progress.objects.get(student_id=student_id, problem_id=problem_id)
        except Progress.DoesNotExist:
            raise NotFound(detail="Progress not found for this student and problem.")
        
        # Serialize the progress data
        serializer = ProgressSerializer(progress)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
class CreateStudentWithProgressView(APIView):
    def post(self, request):
        # Deserialize student data
        serializer = UserSerializer(data=request.data)
        
        if serializer.is_valid():
            # Save the new user (student in this case)
            user = serializer.save()
            if user.role == 'student':
                student = user.student_profile  # This gives you the associated Student object
                # Create Progress for each existing problem
                problems = Problem.objects.all()
                progress_list = []
                for problem in problems:
                    progress_list.append(Progress(
                        student=student,
                        problem=problem,
                        status='Incomplete',  # Or default status
                    ))

                # Bulk create Progress records for this student
                Progress.objects.bulk_create(progress_list)

                return Response({"message": "Student created and progress initialized for all problems."}, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class CreateProblemWithProgressView(APIView):
    def post(self, request):
        # Deserialize problem data
        serializer = ProblemSerializer(data=request.data)
        
        if serializer.is_valid():
            # Create the new problem
            problem = serializer.save()

            # Create Progress for all students for this problem
            students = Student.objects.all()
            progress_list = []
            for student in students:
                progress_list.append(Progress(
                    student=student,
                    problem=problem,
                    status='Incomplete',  # Default status
                ))

            # Bulk create Progress records for all students
            Progress.objects.bulk_create(progress_list)

            return Response({"message": "Problem created and progress initialized for all students."}, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)