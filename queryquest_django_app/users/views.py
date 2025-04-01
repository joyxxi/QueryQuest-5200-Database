from django.http import JsonResponse
from django.views.decorators.http import require_GET
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .models import User, Student, Instructor, Admin
from .serializers import UserSerializer

@api_view(['POST'])
def signup(request):
    serializer = UserSerializer(data=request.data)
    
    if serializer.is_valid():
        # Create the base user first
        user = User.objects.create(
            role=serializer.validated_data['role'],
            username=serializer.validated_data['username'],
            email=serializer.validated_data['email'],
            password=serializer.validated_data['password']
        )
        
        # Create role-specific profile
        if user.role == 'student':
            Student.objects.create(
                student_id=user,
                current_level=0,
                total_points=0
            )
        elif user.role == 'instructor':
            Instructor.objects.create(
                instructor_id=user
            )
        elif user.role == 'admin':
            Admin.objects.create(
                admin_id=user
            )

        return Response({"status": "success", "user_id": user.user_id, "role": user.role}, status=status.HTTP_201_CREATED)
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
def login(request):
    email = request.data.get('email')
    password = request.data.get('password')
    
    if not email or not password:
        return Response(
            {"status": "error", "message": "Both email and password are required"},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    try:
        user = User.objects.get(email=email)
    except User.DoesNotExist:
        return Response(
            {"status": "error", "message": "User does not exist, please sign up first"},
            status=status.HTTP_404_NOT_FOUND
        )
    
    # Compare passwords (plaintext comparison - not recommended for production)
    # In production, you should use check_password() with hashed passwords
    if user.password == password:
        return Response(
            {"status": "success", "message": "Login successful", "user_id": user.user_id, "role": user.role},
            status=status.HTTP_200_OK
        )
    else:
        return Response(
            {"status": "error", "message": "Incorrect password"},
            status=status.HTTP_401_UNAUTHORIZED
        )
@api_view(['POST'])
def logout(request):
    return Response(
        {"status": "success", "message": "Logged out successfully"},
        status=status.HTTP_200_OK
    )