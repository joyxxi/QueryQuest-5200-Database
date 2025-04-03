from rest_framework import serializers
from .models import Problem, Unit
from users.models import User
from progress.models import Progress
class ProblemSerializer(serializers.ModelSerializer):
    # serializer to accept unit_id and created_by as IDs instead of full objects
    # unit_id = serializers.PrimaryKeyRelatedField(queryset=Unit.objects.all())
    unit_title = serializers.CharField(source='unit.unit_title', read_only=True)
    module_title = serializers.CharField(source='unit.module.module_title', read_only=True)
    class Meta:
        model = Problem
        fields = ['problem_id', 'unit', 'unit_title', 'module_title', 'description', 
            'problem_type', 'difficulty', 'choice1', 'choice2', 'choice3','correct_answer','created_at', 'created_by']

class ProblemListSerializer(serializers.ModelSerializer):
    unit_id = serializers.PrimaryKeyRelatedField(queryset=Unit.objects.all())
    unit_title = serializers.CharField(source='unit.unit_title', read_only=True)
    module_title = serializers.CharField(source='unit.module.module_title', read_only=True)

    class Meta:
        model = Problem
        fields = [
            'problem_id', 'unit_id', 'unit_title', 'module_title', 'description', 
            'problem_type', 'difficulty', 'created_at', 'created_by'
        ]

class UnitSerializer(serializers.ModelSerializer):
    module_title = serializers.CharField(source='module.module_title')
    class Meta:
        model = Unit
        fields = ['unit_id', 'module_title', 'unit_title']