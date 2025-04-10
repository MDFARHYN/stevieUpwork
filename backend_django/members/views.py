# members/views.py
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from django.contrib.auth import get_user_model
from rest_framework.permissions import IsAuthenticated
from .serializers import *
from rest_framework_simplejwt.tokens import RefreshToken
from .models import *
from django.db.models import Q

User = get_user_model()

@api_view(['POST'])
@permission_classes([AllowAny])
def register_user(request):
    """
    Register a new user and return JWT tokens
    """
    serializer = UserRegistrationSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.save()
        
        # Generate tokens
        refresh = RefreshToken.for_user(user)
        
        # Create response with tokens
        response_data = {
            "status": "success",
            "message": "User registered successfully",
            "tokens": {
                "refresh": str(refresh),
                "access": str(refresh.access_token),
            },
            "user": {
                "id": user.id,
                "email": user.email,
                "first_name": user.first_name,
                "last_name": user.last_name
            }
        }
        
        return Response(response_data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([AllowAny])
def user_login(request):
    """
    Authenticate a user and set JWT tokens in cookies
    """
    email = request.data.get('email')
    password = request.data.get('password')
    
    if not email or not password:
        return Response(
            {"error": "Please provide both email and password"},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    try:
        user = User.objects.get(
            Q(email=email) | Q(username=email)
        )

    except User.DoesNotExist:
        return Response(
            {"error": "Invalid credentials"},
            status=status.HTTP_401_UNAUTHORIZED
        )
    
    # Check password
    if not user.check_password(password):
        return Response(
            {"error": "Invalid credentials"},
            status=status.HTTP_401_UNAUTHORIZED
        )
    
    # Generate tokens
    refresh = RefreshToken.for_user(user)
    access_token = refresh.access_token
    
    # Create response 
    response = Response(
        {
            "status": "success",
            "message": "Login successful",
            "user": {
                "id": user.id,
                "email": user.email,
                "first_name": user.first_name,
                "last_name": user.last_name
            }
        },
        status=status.HTTP_200_OK
    )
    
    # Set cookies
    response.set_cookie(
        key='refresh_token',
        value=str(refresh),
        samesite='Lax',
        secure=False,
        domain='backendstevie.farhyn.com',
        max_age=3600 * 24 * 14  # 14 days
    )
    
    response.set_cookie(
        key='access_token',
        value=str(access_token),
        samesite='Lax',
        domain='backendstevie.farhyn.com',
        secure=False,
        max_age=3600  # 1 hour
    )
    
    return response




@api_view(['GET'])
def get_profile(request):
    """
    Get profile details for a specific user or the authenticated user
    """

    # If no user_id provided, get the authenticated user's profile
    profile = get_object_or_404(Profile, user=request.user)
    
    serializer = ProfileSerializer(profile)
    return Response(serializer.data)


@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def update_profile(request):
    """
    Update a user's profile
    Only bio and profile_picture can be updated
    """
    print(request.data)
    profile = get_object_or_404(Profile, user=request.user)
    
    # Only include bio and profile_picture fields
    update_data = {}
    
    # Handle form data fields
    if 'bio' in request.data:
        update_data['bio'] = request.data['bio']
    
    # Handle file uploads from request.FILES
    if 'profile_picture' in request.FILES:
        update_data['profile_picture'] = request.FILES['profile_picture']
    
    serializer = ProfileSerializer(profile, data=update_data, partial=True, context={'request': request})
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)