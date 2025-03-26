from rest_framework import serializers
from .models import User
from .models import Message

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
    
class MessageSerializer(serializers.ModelSerializer):
    sender_username = serializers.CharField(write_only=True)
    receiver_username = serializers.CharField(write_only=True)
    
    class Meta:
        model = Message
        fields = ['sender_username', 'receiver_username', 'm_content']
        extra_kwargs = {
            'm_content': {'required': True}
        }