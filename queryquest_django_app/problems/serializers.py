from rest_framework import serializers
from .models import Problem, Unit
from users.models import User
from progress.models import Progress
class ProblemSerializer(serializers.ModelSerializer):
    # serializer to accept unit_id and created_by as IDs instead of full objects
    unit = serializers.PrimaryKeyRelatedField(queryset=Unit.objects.all())
    created_by = serializers.PrimaryKeyRelatedField(queryset=User.objects.all())
    class Meta:
        model = Problem
        fields = '__all__'

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
