from rest_framework import serializers
from .models import Task, TaskList, Category


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
        fields = [
            "id",
            "task_list",
            "content",
            "priority",
            "created_at",
            "due_date",
            "done",
        ]


class TaskListSerializer(serializers.ModelSerializer):
    task = TaskSerializer(many=True, read_only=True)

    class Meta:
        model = TaskList
        fields = [
            "id",
            "user",
            "title",
            "priority",
            "created_at",
            "due_date",
            "done",
            "tasks",
        ]
