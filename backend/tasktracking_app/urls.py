from django.urls import path, include
from rest_framework.routers import DefaultRouter
from tasktracking_app.views import TaskListViewSet, TaskViewSet, CategoryViewSet

router = DefaultRouter()
router.register(r'tasklists', TaskListViewSet)
router.register(r'tasks', TaskViewSet)
router.register(r'categories', CategoryViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
