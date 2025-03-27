from rest_framework import serializers
from .models import Feedback
class FeedbackSerializer(serializers.ModelSerializer):
    '''
    Serializer for the Feedback model.
    '''
    submission_id = serializers.IntegerField(source='submission.submission_id', read_only=True)
    student_id = serializers.IntegerField(source='submission.student_id', read_only=True)
    problem_id = serializers.IntegerField(source='submission.problem_id', read_only=True)
    class Meta:
        model = Feedback
        fields = ['feedback_id', 'submission_id', 'student_id', 'problem_id', 'f_content', 'created_at']
        read_only_fields = ['feedback_id', 'submission_id', 'student_id', 'problem_id', 'created_at']