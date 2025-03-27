from django.db.models.signals import post_save  # Signal that triggers after saving an object
from django.dispatch import receiver  # Used to connect the signal to a function
from users.models import Student  # Import the Student model
from problems.models import Problem  # Import the Problem model
from .models import Progress  # Import the Progress model

# 1️⃣ When a new Student is created, initialize Progress for all existing problems
@receiver(post_save, sender=Student)  # This function will run when a Student is created
def create_progress_for_new_student(sender, instance, created, **kwargs):
    if created:  # Ensures that the function runs only when a new Student is created (not on updates)
        problems = Problem.objects.all()  # Get all existing problems
        progress_list = [  # Create Progress objects in bulk
            Progress(student=instance, problem=problem, status='Incomplete')
            for problem in problems
        ]
        Progress.objects.bulk_create(progress_list)  # Save all progress records at once

# 2️⃣ When a new Problem is created, initialize Progress for all existing students
@receiver(post_save, sender=Problem)
def create_progress_for_new_problem(sender, instance, created, **kwargs):
    if created:  # Only run when a problem is newly created
        students = Student.objects.all()
        progress_list = [
            Progress(student=student, problem=instance, status='Incomplete')
            for student in students
        ]
        Progress.objects.bulk_create(progress_list)
        print(f"Created progress for problem {instance.problem_id} for {len(students)} students.")