from rest_framework import serializers
from .models import Progress

class ProgressSerializer(serializers.ModelSerializer):
    student_id = serializers.IntegerField(source='student.student_id')
    problem_id = serializers.IntegerField(source='problem.problem_id')

    class Meta:
        model = Progress
        fields = ['student_id', 'problem_id', 'status', 'complete_at']

    def create(self, validated_data):
        student_id = validated_data.pop('student')['student_id']
        problem_id = validated_data.pop('problem')['problem_id']
        return Progress.objects.create(student_id=student_id, problem_id=problem_id, **validated_data)

    def update(self, instance, validated_data):
        instance.status = validated_data.get('status', instance.status)
        instance.complete_at = validated_data.get('complete_at', instance.complete_at)
        instance.save()
        return instance
