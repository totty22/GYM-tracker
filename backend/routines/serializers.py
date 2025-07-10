# backend/routines/serializers.py (VERSIÓN COMPLETA Y RESTAURADA)

from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Exercise, Routine, RoutineExercise, WorkoutSession, ExerciseLog

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name']

# --- LA CLASE QUE FALTABA ---
# Esta es la clase que olvidé incluir en la respuesta anterior.
class ExerciseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Exercise
        fields = '__all__'
# -----------------------------

class RoutineExerciseSerializer(serializers.ModelSerializer):
    exercise = serializers.PrimaryKeyRelatedField(queryset=Exercise.objects.all())

    class Meta:
        model = RoutineExercise
        exclude = ('routine',)


class RoutineSerializer(serializers.ModelSerializer):
    exercises = RoutineExerciseSerializer(many=True)

    class Meta:
        model = Routine
        fields = ['id', 'user', 'name', 'description', 'created_at', 'exercises']
        read_only_fields = ['user']

    def create(self, validated_data):
        exercises_data = validated_data.pop('exercises')
        routine = Routine.objects.create(**validated_data)
        
        for exercise_data in exercises_data:
            RoutineExercise.objects.create(routine=routine, **exercise_data)
            
        return routine

    def update(self, instance, validated_data):
        exercises_data = validated_data.pop('exercises')
        
        instance.name = validated_data.get('name', instance.name)
        instance.description = validated_data.get('description', instance.description)
        instance.save()

        instance.exercises.all().delete()

        for exercise_data in exercises_data:
            RoutineExercise.objects.create(routine=instance, **exercise_data)

        return instance


class WorkoutSessionSerializer(serializers.ModelSerializer):
    logs = serializers.StringRelatedField(many=True, read_only=True)
    
    class Meta:
        model = WorkoutSession
        fields = ['id', 'user', 'routine', 'date', 'duration', 'logs']
        read_only_fields = ['user']


class ExerciseLogSerializer(serializers.ModelSerializer):
    class Meta:
        model = ExerciseLog
        fields = '__all__'