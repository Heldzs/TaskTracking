from rest_framework import serializers
from .models import Task, TaskList, Category
from django.contrib.auth.models import (
    User,
)  # Import User model if using Django's built-in User model


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User  # Assuming you are using Django's built-in User model
        fields = ["id", "username", "email", "password"]  # Adjust fields as necessary
        extra_kwargs = {
            "password": {"write_only": True}  # Ensure password is write-only
        }

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data["username"],
            email=validated_data["email"],
            password=validated_data["password"],
        )
        return user


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = "__all__"


class TaskSerializer(serializers.ModelSerializer):
    category = CategorySerializer(many=True, read_only=True)
    category_ids = serializers.PrimaryKeyRelatedField(
        queryset=Category.objects.all(), write_only=True, source="categories"
    )

    class Meta:
        model = Task
        fields = '__all__'
        read_only_fields = ["created_at"]

        def validate_title(self, value):
            if not value:
                raise serializers.ValidationError("Title cannot be empty.")
            return value


class TaskListSerializer(serializers.ModelSerializer):
    task = TaskSerializer(many=True, read_only=True)

    class Meta:
        model = TaskList
        fields = "__all__"
        read_only_fields = ['user', 'created_at']
    
    def valiate_name(self, value):
        if not value:
            raise serializers.ValidationError("Title cannot be empty.")
        return value