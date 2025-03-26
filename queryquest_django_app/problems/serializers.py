from rest_framework import serializers
from .models import Problem, Unit
from users.models import User
class ProblemSerializer(serializers.ModelSerializer):
    # serializer to accept unit_id and created_by as IDs instead of full objects
    unit = serializers.PrimaryKeyRelatedField(queryset=Unit.objects.all())
    created_by = serializers.PrimaryKeyRelatedField(queryset=User.objects.all())
    class Meta:
        model = Problem
        fields = '__all__'