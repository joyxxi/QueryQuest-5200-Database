from django.shortcuts import render, get_object_or_404
from django.http import JsonResponse
from .models import Progress
from auth.models import Student  # Assuming you have a Student model
from problems.models import Problem  # Assuming you have a Problem model
from django.views.decorators.csrf import csrf_exempt
from django.utils import timezone
from datetime import timedelta

# Create Progress View
# @csrf_exempt is a decorator in Django that can be applied to a view function to disable CSRF (Cross-Site Request Forgery) protection for that specific view.
@csrf_exempt
def create_progress(request, student_id, problem_id):
    try:
        # Fetch the student and problem
        student = get_object_or_404(Student, student_id=student_id)
        problem = get_object_or_404(Problem, problem_id=problem_id)

        # Check if progress already exists, if not create new
        existing_progress = Progress.objects.get(student=student, problem=problem)
        if existing_progress:
            return JsonResponse({"message": "Progress already exists."}, status=400)

        # Create a new progress entry with status 'Locked'
        progress = Progress.objects.create(
            student=student,
            problem=problem,
            status='Locked',  # Initial status
            unlock_at=None,  # Not unlocked yet
            complete_at=None  # Not completed yet
        )

        return JsonResponse({
            "message": "Progress created successfully.",
            "progress": {
                "student": student.username,
                "problem": problem.problem_id,
                "status": progress.status,
            }
        }, status=201)
    
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)

# Update Progress View (change status from Locked -> Inprogress -> Complete)
@csrf_exempt
def update_progress(request, student_id, problem_id):
    try:
        # Fetch the student and problem
        student = get_object_or_404(Student, id=student_id)
        problem = get_object_or_404(Problem, id=problem_id)

        # Fetch the existing Progress entry for the student and problem
        progress = Progress.objects.get(student_id=student_id, problem_id=problem_id)
        
        if not progress:
            return JsonResponse({"message": "No progress found for this student and problem."}, status=404)
        
        # Update progress based on current status
        if progress.status == 'Locked':
            progress.status = 'Inprogress'
            progress.unlock_at = timezone.now()  # Set the unlock timestamp
        elif progress.status == 'Inprogress':
            progress.status = 'Complete'
            progress.complete_at = timezone.now()  # Set the complete timestamp
        else:
            return JsonResponse({"message": "Progress already completed."}, status=400)
        
        progress.save()

        return JsonResponse({
            "message": "Progress updated successfully.",
            "progress": {
                "student": student.username,
                "problem": problem.problem_id,
                "status": progress.status,
                "unlock_at": progress.unlock_at,
                "complete_at": progress.complete_at,
            }
        })
    
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)

# Retrieve Progress View (show a student's progress for a specific problem)
def retrieve_progress_for_one_student_specific_problem(request, student_id, problem_id):
    try:
        # Fetch the student and problem
        student = get_object_or_404(Student, id=student_id)
        problem = get_object_or_404(Problem, id=problem_id)

        # Fetch the existing Progress entry for the student and problem
        progress = Progress.objects.get(student_id=student_id, problem_id=problem_id)
        if not progress:
            return JsonResponse({"message": "No progress found for this student and problem."}, status=404)
        return JsonResponse({
                "student": student.username,
                "problem": problem.problem_id,
                "status": progress.status,
                "unlock_at": progress.unlock_at,
                "complete_at": progress.complete_at,
        })

    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)
