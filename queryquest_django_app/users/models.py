from django.db import models

class User(models.Model):
    ROLE_CHOICES = [
        ('student', 'Student'),
        ('instructor', 'Instructor'),
        ('admin', 'Administrator'),
    ]
    
    user_id = models.AutoField(primary_key=True)
    role = models.CharField(max_length=20, choices=ROLE_CHOICES)
    username = models.CharField(max_length=100, unique=True)
    email = models.EmailField(unique=True)
    password = models.CharField(max_length=128)  # In production, you should use hashed passwords
    
    class Meta:
        db_table = 'Users'  # This matches your existing table name
    
    def __str__(self):
        return self.username
class Student(models.Model):
    student_id = models.OneToOneField(
        User, 
        on_delete=models.CASCADE,
        primary_key=True,
        related_name='student_profile'
    )
    current_level = models.IntegerField(default=0)
    total_points = models.IntegerField(default=0)

    class Meta:
        db_table = 'Students'

class Instructor(models.Model):
    instructor_id = models.OneToOneField(
        User,
        on_delete=models.CASCADE,
        primary_key=True,
        related_name='instructor_profile'
    )
    # Add any instructor-specific fields here
    department = models.CharField(max_length=100, blank=True)

    class Meta:
        db_table = 'Instructors'

class Admin(models.Model):
    admin_id = models.OneToOneField(
        User,
        on_delete=models.CASCADE,
        primary_key=True,
        related_name='admin_profile'
    )
    # Add any admin-specific fields here
    access_level = models.IntegerField(default=1)

    class Meta:
        db_table = 'Admins'
            
class Message(models.Model):
    sender = models.ForeignKey('User', on_delete=models.CASCADE, related_name='sent_messages')
    receiver = models.ForeignKey('User', on_delete=models.CASCADE, related_name='received_messages')
    m_content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'Messages'  # This matches your existing table name
    
    def __str__(self):
        return f"From {self.sender} to {self.receiver}: {self.m_content[:20]}..."