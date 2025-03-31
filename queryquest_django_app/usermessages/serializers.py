from rest_framework import serializers
from .models import Message
    
class MessageSerializer(serializers.ModelSerializer):
    sender_username = serializers.CharField(write_only=True)
    receiver_username = serializers.CharField(write_only=True)
    
    class Meta:
        model = Message
        fields = ['sender_username', 'receiver_username', 'm_content', 'is_read']
        extra_kwargs = {
            'm_content': {'required': True}
        }