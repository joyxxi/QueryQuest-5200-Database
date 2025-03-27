from rest_framework import serializers
from .models import Progress
from users.models import Student
from problems.models import Problem

class ProgressSerializer(serializers.ModelSerializer):
    student_id = serializers.PrimaryKeyRelatedField(queryset=Student.objects.all(), source='student')
    problem_id = serializers.PrimaryKeyRelatedField(queryset=Problem.objects.all(), source='problem')

    class Meta:
        model = Progress
        fields = ['progress_id', 'student_id', 'problem_id', 'status', 'complete_at']
        read_only_fields = ['progress_id']  # Ensures progress_id is not required in input

    # def create(self, validated_data):
    #     student_id = validated_data.pop('student')['student_id']
    #     problem_id = validated_data.pop('problem')['problem_id']
    #     return Progress.objects.create(student_id=student_id, problem_id=problem_id, **validated_data)

    # def update(self, instance, validated_data):
    #     instance.status = validated_data.get('status', instance.status)
    #     instance.complete_at = validated_data.get('complete_at', instance.complete_at)
    #     instance.save()
    #     return instance
