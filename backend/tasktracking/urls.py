from django.contrib import admin
from django.urls import path, include
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)
from tasktracking_app.views import RegisterViewSet

urlpatterns = [
    path('admin/', admin.site.urls),

    # API da sua aplicação
    path('api/', include('tasktracking_app.urls')),
    path('', include('tasktracking_app.urls')),

    # Endpoints de autenticação JWT
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('api/register/', RegisterViewSet.as_view(), name='register'),
]
