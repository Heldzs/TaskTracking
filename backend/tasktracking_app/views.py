from rest_framework import viewsets, permissions, generics, status
from rest_framework.response import Response
from .models import TaskList, Task, Category
from .serializers import (
    TaskListSerializer,
    TaskSerializer,
    CategorySerializer,
    UserSerializer,
)
from django.contrib.auth.models import User


class RegisterViewSet(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.AllowAny]

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        return Response(
            {"message": "Usuário registrado com sucesso!"},
            status=status.HTTP_201_CREATED,
        )


class TaskListViewSet(viewsets.ModelViewSet):
    queryset = TaskList.objects.all()
    serializer_class = TaskListSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return self.queryset.filter(user=self.request.user)
    
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class TaskViewSet(viewsets.ModelViewSet):
    queryset = Task.objects.all()
    serializer_class = TaskSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        task_list_pk = self.kwargs.get("task_list_pk")
        if task_list_pk:
            return self.queryset.filter(task_list__id=task_list_pk, task_list__user=self.request.user)
        return Task.objects.filter(task_list__user=self.request.user).order_by("-created_at")
    
    def perform_create(self, serializer):
        task_list_pk = self.kwargs.get("task_list_pk")
        if not task_list_pk:
            raise ValueError("task_list_pk is required for creating a task.")
        task_list = TaskList.objects.get(pk=task_list_pk, user=self.request.user)
        serializer.save(task_list=task_list, user=self.request.user)


class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [permissions.IsAuthenticated]
