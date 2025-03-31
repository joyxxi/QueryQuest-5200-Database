from rest_framework import serializers
from .models import User

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['role', 'username', 'email', 'password']
        extra_kwargs = {
            'password': {'write_only': True}, 
            'role': {'required': True}
        }

    def validate_role(self, value):
        valid_roles = ['student', 'instructor', 'admin']
        if value not in valid_roles:
            raise serializers.ValidationError(f"Role must be one of {valid_roles}")
        return value