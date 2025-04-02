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

@api_view(['GET'])
def current_user():
    """
    Get the current user's data
    """
    email = request.data.get('email')
    password = request.data.get('password')
    
    try:
        user = User.objects.get(email=email)
        if user.password == password:
            return Response({
                "status": "success",
                "role": user.role,
                "username": user.username,
                "email": user.email
            })
        return Response(
            {"status": "error", "message": "Incorrect password"},
            status=401
        )
    except User.DoesNotExist:
        return Response(
            {"status": "error", "message": "User not found"},
            status=404
        )
    
@api_view(['POST'])
def update_user(request):
    current_email = request.data.get('current_email')
    current_password = request.data.get('current_password')
    new_email = request.data.get('new_email')
    new_username = request.data.get('new_username')
    new_password = request.data.get('new_password')

    if not all([current_email, current_password, new_email, new_username]):
        return Response(
            {"status": "error", "message": "Missing required fields"},
            status=400
        )

    try:
        user = User.objects.get(email=current_email)
        
        # Verify current password
        if user.password != current_password:
            return Response(
                {"status": "error", "message": "Current password is incorrect"},
                status=401
            )

        # Update user fields
        user.email = new_email
        user.username = new_username
        if new_password:
            user.password = new_password
        user.save()

        return Response({
            "status": "success",
            "message": "Profile updated",
            "username": user.username,
            "email": user.email,
            "role": user.role
        })

    except User.DoesNotExist:
        return Response(
            {"status": "error", "message": "User not found"},
            status=404
        )
    
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