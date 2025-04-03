from django.http import JsonResponse

from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .models import User, Student, Instructor, Admin
from .serializers import UserSerializer

@api_view(['POST'])
def signup(request):
    # Extract data from the request
    username = request.data.get('username')
    email = request.data.get('email')

    # Check if user already exists with the same username or email
    if User.objects.filter(username=username).exists():
        return Response(
            {"status": "error", "message": "Username is already taken"},
            status=status.HTTP_400_BAD_REQUEST
        )
    if User.objects.filter(email=email).exists():
        return Response(
            {"status": "error", "message": "Email is already registered"},
            status=status.HTTP_400_BAD_REQUEST
        )
    # If the username and email are available, proceed with user creation
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
        # Start a session after successful signup
        request.session['user_id'] = str(user.user_id)
        request.session['role'] = user.role

        return Response({"status": "success", "user_id": user.user_id, "role": user.role}, status=status.HTTP_201_CREATED)
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
def login(request):
    username = request.data.get('username')  # Use username instead of email
    password = request.data.get('password')
    
    if not username or not password:
        return Response(
            {"status": "error", "message": "Both email and password are required"},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    try:
        user = User.objects.get(username=username)  # Fetch user by username
    except User.DoesNotExist:
        return Response(
            {"status": "error", "message": "User does not exist, please sign up first"},
            status=status.HTTP_404_NOT_FOUND
        )
    
    # Compare passwords (plaintext comparison - not recommended for production)
    # In production, you should use check_password() with hashed passwords
    if user.password == password:
        # Store user info in session
        request.session['user_id'] = str(user.user_id)
        request.session['role'] = user.role
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
    request.session.flush()  # Clears session data
    return Response(
        {"status": "success", "message": "Logged out successfully"},
        status=status.HTTP_200_OK
    )

@api_view(['GET'])
def getUserById(request, user_id):
    try:
        user = User.objects.get(user_id=user_id)
        user_data = {
            "user_id": user.user_id,
            "username": user.username,
            "email": user.email,
            "role": user.role
        }
        
        if user.role == 'student':
            student_profile = Student.objects.get(student_id=user)
            user_data.update({
                "current_level": student_profile.current_level,
                "total_points": student_profile.total_points
            })
        elif user.role == 'instructor':
            user_data["instructor_profile"] = "Exists"
        elif user.role == 'admin':
            user_data["admin_profile"] = "Exists"
        
        return Response(user_data, status=status.HTTP_200_OK)
    except User.DoesNotExist:
        return Response({"status": "error", "message": "User not found"}, status=status.HTTP_404_NOT_FOUND)
    
@api_view(['GET'])
def profile(request):
    """Retrieve user details from session"""
    user_id = request.session.get('user_id')

    if not user_id:
        return Response({"status": "error", "message": "User not logged in"}, status=status.HTTP_401_UNAUTHORIZED)

    try:
        user = User.objects.get(user_id=int(user_id))
        user_data = {
            "user_id": user.user_id,
            "username": user.username,
            "email": user.email,
            "role": user.role
        }

        if user.role == 'student':
            student_profile = Student.objects.get(student_id=user)
            user_data.update({
                "current_level": student_profile.current_level,
                "total_points": student_profile.total_points
            })
        elif user.role == 'instructor':
            user_data["instructor_profile"] = "Exists"
        elif user.role == 'admin':
            user_data["admin_profile"] = "Exists"

        return Response(user_data, status=status.HTTP_200_OK)

    except User.DoesNotExist:
        return Response({"status": "error", "message": "User not found"}, status=status.HTTP_404_NOT_FOUND)



@api_view(['DELETE'])
def deleteUser(request, user_id):
    try:
        # Get the user by user_id
        user = User.objects.get(user_id=user_id)
        
        # Optionally, delete related profile objects (e.g., Student, Instructor, Admin)
        if user.role == 'student':
            student_profile = Student.objects.get(student_id=user)
            student_profile.delete()
        elif user.role == 'instructor':
            instructor_profile = Instructor.objects.get(instructor_id=user)
            instructor_profile.delete()
        elif user.role == 'admin':
            admin_profile = Admin.objects.get(admin_id=user)
            admin_profile.delete()
        
        # Delete the user
        user.delete()
        
        return Response(
            {"status": "success", "message": "User deleted successfully"},
            status=status.HTTP_200_OK
        )
    except User.DoesNotExist:
        return Response(
            {"status": "error", "message": "User not found"},
            status=status.HTTP_404_NOT_FOUND
        )
