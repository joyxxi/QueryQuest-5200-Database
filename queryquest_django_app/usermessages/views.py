from django.http import JsonResponse
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from users.models import User
from .models import Message
from .serializers import MessageSerializer
from django.db import connection

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
@api_view(['GET'])
def select_all_users(request):
    try:
        with connection.cursor() as cursor:
            # Execute raw SQL query
            cursor.execute("SELECT username FROM Users")
            rows = cursor.fetchall()
            
            # Extract usernames from query results
            usernames = [row[0] for row in rows]
            
            return Response({
                "status": "success",
                "users": usernames
            })
            
    except Exception as e:
        return Response({
            "status": "error",
            "message": str(e)
        }, status=500)
    
@api_view(['GET'])
def all_messages(request):
    try:
        with connection.cursor() as cursor:
            # Execute optimized SQL query with JOIN
            query = """
            SELECT 
                m.message_id,
                m.m_content,
                m.created_at,
                m.is_read,
                sender.username as sender_username,
                receiver.username as receiver_username
            FROM 
                Messages m
            JOIN 
                Users sender ON m.sender_id = sender.user_id
            JOIN 
                Users receiver ON m.receiver_id = receiver.user_id
            ORDER BY 
                m.created_at DESC
            """
            cursor.execute(query)
            columns = [col[0] for col in cursor.description]  # Get column names
            messages = [dict(zip(columns, row)) for row in cursor.fetchall()]
            
            return Response({
                "status": "success",
                "messages": messages
            })
            
    except Exception as e:
        return Response({
            "status": "error",
            "message": str(e)
        }, status=500)