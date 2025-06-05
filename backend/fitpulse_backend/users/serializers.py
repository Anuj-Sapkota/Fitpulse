from rest_framework import serializers
from .models import User
from .models import Workout, Exercise

class ExerciseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Exercise
        fields = ['id', 'name', 'sets', 'reps', 'equipment', 'body_part']

class WorkoutSerializer(serializers.ModelSerializer):
    exercises = ExerciseSerializer(many=True)

    class Meta:
        model = Workout
        fields = ['id', 'name', 'created_at', 'exercises']

    def create(self, validated_data):
        exercises_data = validated_data.pop('exercises')
        workout = Workout.objects.create(**validated_data)
        for exercise_data in exercises_data:
            Exercise.objects.create(workout=workout, **exercise_data)
        return workout

    def update(self, instance, validated_data):
        exercises_data = validated_data.pop('exercises')
        instance.name = validated_data.get('name', instance.name)
        instance.save()

        # Delete existing exercises and replace with new ones
        instance.exercises.all().delete()
        for exercise_data in exercises_data:
            Exercise.objects.create(workout=instance, **exercise_data)
        return instance
    
class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ['username', 'email', 'password', 'role']

    def create(self, validated_data):
        user = User(
            username=validated_data['username'],
            email=validated_data['email'],
            role=validated_data.get('role', 'user')  # Default to 'user'
        )
        user.set_password(validated_data['password'])  # Hash password
        user.save()
        return user