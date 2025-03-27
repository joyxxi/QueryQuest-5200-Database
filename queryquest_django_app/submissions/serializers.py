# submissions/serializers.py
from rest_framework import serializers
from .models import Submission

class SubmissionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Submission
        fields = ['submission_id', 'problem_id', 'student_id', 'submitted_answer', 'result', 'submitted_at']