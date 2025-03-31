from django.http import JsonResponse
from django.views.decorators.http import require_GET
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from users.models import User
from .models import Message
from .serializers import MessageSerializer
from django.contrib.auth.hashers import check_password

@api_view(['POST'])
def send_message(request):
    serializer = MessageSerializer(data=request.data)
    
    if not serializer.is_valid():
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    try:
        sender = User.objects.get(username=serializer.validated_data['sender_username'])
        receiver = User.objects.get(username=serializer.validated_data['receiver_username'])
    except User.DoesNotExist:
        return Response(
            {"status": "error", "message": "Sender or receiver does not exist"},
            status=status.HTTP_404_NOT_FOUND
        )
    
    message = Message.objects.create(
        sender=sender,
        receiver=receiver,
        m_content=serializer.validated_data['m_content'],
        is_read=0  # Explicitly setting as unread
    )
    
    return Response(
        {"status": "success", "message_id": message.id},
        status=status.HTTP_201_CREATED
    )

@api_view(['POST'])
def mark_as_read(request, message_id):
    try:
        message = Message.objects.get(message_id=message_id)
            
        message.is_read = 1
        message.save()
        return Response({"status": "success"})
        
    except Message.DoesNotExist:
        return Response(
            {"status": "error", "message": "Message not found"},
            status=status.HTTP_404_NOT_FOUND
        )
