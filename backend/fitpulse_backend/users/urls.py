from django.urls import path
from .views import RegisterView, CustomTokenObtainPairView, PasswordResetRequestView, PasswordResetConfirmView
from rest_framework_simplejwt.views import TokenRefreshView
from .views import WorkoutListCreateView, WorkoutDetailView
urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', CustomTokenObtainPairView.as_view(), name='login'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('password/reset/', PasswordResetRequestView.as_view(), name='password_reset_request'),
    path('password/reset/<str:token>/', PasswordResetConfirmView.as_view(), name='password_reset_confirm'),
    path('trainer/workouts/', WorkoutListCreateView.as_view(), name='workout-list-create'),
    path('trainer/workouts/<int:pk>/', WorkoutDetailView.as_view(), name='workout-detail'),
]