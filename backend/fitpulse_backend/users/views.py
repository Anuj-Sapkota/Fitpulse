from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from .models import User
from .serializers import RegisterSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
from django.core.mail import send_mail
from django.conf import settings
import uuid
from rest_framework.permissions import IsAuthenticated
from .models import Workout
from .serializers import WorkoutSerializer

class RegisterView(APIView):
    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({"message": "User registered"}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token['role'] = user.role  # Add role to token
        return token

class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer

class PasswordResetRequestView(APIView):
    def post(self, request):
        email = request.data.get('email')   
        try:
            user = User.objects.get(email=email)
            token = str(uuid.uuid4())  # Generate reset token
            user.password_reset_token = token  # Add this field to model later
            user.save()
            # Send email (configure settings later)
            send_mail(
                'Password Reset',
                f'Click to reset: http://localhost:3000/reset-password/{token}',
                settings.EMAIL_HOST_USER,
                [email],
                fail_silently=False,
            )
            return Response({"message": "Reset email sent"}, status=status.HTTP_200_OK)
        except User.DoesNotExist:
            return Response({"error": "Email not found"}, status=status.HTTP_404_NOT_FOUND)

class PasswordResetConfirmView(APIView):
    def post(self, request, token):
        try:
            user = User.objects.get(password_reset_token=token)
            new_password = request.data.get('password')
            user.set_password(new_password)
            user.password_reset_token = None
            user.save()
            return Response({"message": "Password reset successful"}, status=status.HTTP_200_OK)
        except User.DoesNotExist:
            return Response({"error": "Invalid token"}, status=status.HTTP_400_BAD_REQUEST)
        
class WorkoutListCreateView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        if request.user.role != 'trainer':  # Assuming 'role' is in your User model
            return Response({'error': 'Unauthorized'}, status=status.HTTP_403_FORBIDDEN)
        workouts = Workout.objects.filter(trainer=request.user)
        serializer = WorkoutSerializer(workouts, many=True)
        return Response(serializer.data)

    def post(self, request):
        if request.user.role != 'trainer':
            return Response({'error': 'Unauthorized'}, status=status.HTTP_403_FORBIDDEN)
        serializer = WorkoutSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(trainer=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class WorkoutDetailView(APIView):
    permission_classes = [IsAuthenticated]

    def get_object(self, pk):
        try:
            return Workout.objects.get(pk=pk, trainer=self.request.user)
        except Workout.DoesNotExist:
            return None

    def put(self, request, pk):
        if request.user.role != 'trainer':
            return Response({'error': 'Unauthorized'}, status=status.HTTP_403_FORBIDDEN)
        workout = self.get_object(pk)
        if not workout:
            return Response({'error': 'Workout not found'}, status=status.HTTP_404_NOT_FOUND)
        serializer = WorkoutSerializer(workout, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        if request.user.role != 'trainer':
            return Response({'error': 'Unauthorized'}, status=status.HTTP_403_FORBIDDEN)
        workout = self.get_object(pk)
        if not workout:
            return Response({'error': 'Workout not found'}, status=status.HTTP_404_NOT_FOUND)
        workout.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)