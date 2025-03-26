from django.db import models
from users.models import User

class Module(models.Model):
    module_id = models.IntegerField(primary_key=True)
    module_title = models.CharField(max_length=100)

    def __str__(self):
        return str(self.module_id)

    class Meta:
        db_table = 'Modules'

class Unit(models.Model):
    unit_id = models.IntegerField(primary_key=True)
    module = models.ForeignKey(Module, on_delete=models.CASCADE)
    unit_title = models.CharField(max_length=100)

    def __str__(self):
        return str(self.unit_id)

    class Meta:
        db_table = 'Units'


# Problems model (place this in your "problems" app)
class Problem(models.Model):
    PROBLEM_TYPE_CHOICES = [
        ('Multi-Select', 'Multi-Select'),
        ('True-False', 'True-False'),
    ]

    DIFFICULTY_CHOICES = [
        ('Easy', 'Easy'),
        ('Medium', 'Medium'),
        ('Hard', 'Hard'),
    ]
    
    problem_id = models.AutoField(primary_key=True)
    unit = models.ForeignKey(Unit, on_delete=models.CASCADE)
    description = models.CharField(max_length=255)
    problem_type = models.CharField(max_length=20, choices=PROBLEM_TYPE_CHOICES)
    difficulty = models.CharField(max_length=10, choices=DIFFICULTY_CHOICES)
    
    choice1 = models.CharField(max_length=100)
    choice2 = models.CharField(max_length=100)
    choice3 = models.CharField(max_length=100, blank=True, null=True)  # Optional
    
    correct_answer = models.PositiveSmallIntegerField()  # index of correct choice (1/2/3)
    created_by = models.ForeignKey(User, null=True, blank=True, on_delete=models.SET_NULL, db_column='created_by')
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return self.description

    class Meta:
        db_table = 'Problems'