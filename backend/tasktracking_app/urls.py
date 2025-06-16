from django.urls import path, include
from rest_framework.routers import DefaultRouter
from tasktracking_app.views import TaskListViewSet, TaskViewSet, CategoryViewSet

router = DefaultRouter()
router.register(r'tasklists', TaskListViewSet)
router.register(r'tasks', TaskViewSet)
router.register(r'categories', CategoryViewSet)

task_router = DefaultRouter()
task_router.register(r'tasklists/(?P<task_list_pk>[^/.]+)/tasks', TaskViewSet, basename='task-list-tasks')

urlpatterns = [
    path('', include(router.urls)),
    path('tasklists/<int:task_list_pk>', include(task_router.urls)),
]
