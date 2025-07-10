from rest_framework import serializers
from .models import Exercise, Routine, RoutineExercise, WorkoutSession, ExerciseLog
from django.contrib.auth.models import User # Asegúrate de que este import existe

class ExerciseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Exercise
        fields = '__all__'

class RoutineExerciseSerializer(serializers.ModelSerializer):
    # Usamos un serializer de solo lectura para mostrar el nombre del ejercicio
    exercise_name = serializers.CharField(source='exercise.name', read_only=True)

    class Meta:
        model = RoutineExercise
        fields = ['id', 'exercise', 'exercise_name', 'sets', 'reps', 'rest_time_seconds', 'order_in_routine']

class RoutineSerializer(serializers.ModelSerializer):
    # Anidamos los ejercicios de la rutina para obtenerlos en una sola petición
    exercises = RoutineExerciseSerializer(many=True, read_only=True)
    
    class Meta:
        model = Routine
        fields = ['id', 'user', 'name', 'description', 'created_at', 'exercises']
        read_only_fields = ['user'] # El usuario se asignará automáticamente

class ExerciseLogSerializer(serializers.ModelSerializer):
    class Meta:
        model = ExerciseLog
        fields = '__all__'

class WorkoutSessionSerializer(serializers.ModelSerializer):
    logs = ExerciseLogSerializer(many=True, read_only=True)
    
    class Meta:
        model = WorkoutSession
        fields = ['id', 'user', 'routine', 'date', 'duration', 'logs']
        read_only_fields = ['user']

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name']