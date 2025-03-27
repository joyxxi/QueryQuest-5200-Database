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
   

# Get all progress records for a given student
class StudentProgressView(APIView):
    def get(self, request, student_id):
        try:
            student = Student.objects.get(pk=student_id)
        except Student.DoesNotExist:
            raise NotFound(detail="Student not found.")
        progress_records = Progress.objects.filter(student=student)
        serializer = ProgressSerializer(progress_records, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    

# Get all progress records for a given problem across all students
class ProblemProgressView(APIView):
    def get(self, request, problem_id):
        try:
            problem = Problem.objects.get(pk=problem_id)
        except Problem.DoesNotExist:
            raise NotFound(detail="Problem not found.")

        progress_records = Progress.objects.filter(problem=problem)
        serializer = ProgressSerializer(progress_records, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
