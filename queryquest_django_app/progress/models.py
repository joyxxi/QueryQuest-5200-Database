from django.db import models
from users.models import Student  # Import Student model from "users" app
from problems.models import Problem  # Import Problem model from "problems" app

class Progress(models.Model):
    # Define the fields
    student = models.ForeignKey(Student, to_field="student_id", on_delete=models.CASCADE, related_name="progress")
    problem = models.ForeignKey(Problem, to_field="problem_id", on_delete=models.CASCADE, related_name="progress")
    STATUS_CHOICES = [
        ('Incomplete', 'Incomplete'),
        ('Complete', 'Complete'),
    ]
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='Incomplete')
    complete_at = models.DateTimeField(null=True, blank=True) # complete_at field can also be NULL in the database and can be left blank in forms.

    # Primary key will be composite (student_id, problem_id) based on your table design
    class Meta:
        db_table = 'Progress' 
        # student_id and problem_id is a composite unique key
        constraints = [models.UniqueConstraint(fields=['student', 'problem'], name='unique_progress')] 

    def __str__(self):
        return f"{self.student.student_id} - {self.problem.problem_id} - {self.status}"


