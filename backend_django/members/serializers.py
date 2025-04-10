# serializers.py
from .models import *
from django.contrib.auth import get_user_model
from rest_framework import serializers
from django.core.validators import FileExtensionValidator
import re
import os
User = get_user_model()

class UserRegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=8, 
                                    style={'input_type': 'password'})
    confirm_password = serializers.CharField(write_only=True, 
                                            style={'input_type': 'password'})
    
    class Meta:
        model = User
        fields = ('email', 'first_name', 'last_name', 'password', 'confirm_password')
        extra_kwargs = {
            'first_name': {'required': True, 'max_length': 30},
            'last_name': {'required': True, 'max_length': 30},
            'email': {'required': True, 'max_length': 254},
        }
    
    def validate_email(self, value):
        # Check if email is valid
        email_regex = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
        if not re.match(email_regex, value):
            raise serializers.ValidationError("Enter a valid email address.")
        
        # Check if email already exists
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError("A user with this email already exists.")
        return value
    
    """
    def validate_password(self, value):
        # Password strength validation
        if value.isdigit():
            raise serializers.ValidationError("Password cannot be entirely numeric.")
        
        if not any(char.isdigit() for char in value):
            raise serializers.ValidationError("Password must contain at least one digit.")
            
        if not any(char.isupper() for char in value):
            raise serializers.ValidationError("Password must contain at least one uppercase letter.")
            
        return value
    """
    def validate(self, data):
        if data.get('password') != data.get('confirm_password'):
            raise serializers.ValidationError({"confirm_password": "Passwords don't match."})
        return data
    
    def create(self, validated_data):
        validated_data.pop('confirm_password')
        user = User.objects.create_user(
            email=validated_data['email'],
            username=validated_data.get('email'),  # Using email as username
            first_name=validated_data['first_name'],
            last_name=validated_data['last_name'],
            password=validated_data['password']
        )
        return user





def validate_file_size(value):
    # 5MB limit
    max_size = 5 * 1024 * 1024
    if value.size > max_size:
        raise serializers.ValidationError("Profile picture cannot exceed 5MB.")
    return value




class ProfileSerializer(serializers.ModelSerializer):
    username = serializers.ReadOnlyField(source='user.username')
    first_name = serializers.ReadOnlyField(source='user.first_name')
    last_name = serializers.ReadOnlyField(source='user.last_name')
    bio = serializers.CharField(max_length=2000)
    profile_picture = serializers.ImageField(
        validators=[
            validate_file_size,
            FileExtensionValidator(allowed_extensions=['jpg', 'jpeg', 'png', 'gif']),
        ],
        required=False
    )
    
    class Meta:
        model = Profile
        fields = ['id', 'username', 'first_name', 'last_name', 'bio', 'profile_picture', 'created_at', 'updated_at']
        read_only_fields = ['id', 'username', 'first_name', 'last_name', 'created_at', 'updated_at']
    
    def validate(self, data):
        """
        Check if user has permission to edit the profile
        """
        request = self.context.get('request')
        profile = self.instance
        
        # Check if user has permission (owner or staff)
        if profile and request and profile.user != request.user and not request.user.is_staff:
            raise serializers.ValidationError("You do not have permission to edit this profile")
                
        return data