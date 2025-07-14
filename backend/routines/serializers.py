# backend/routines/serializers.py

from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Exercise, Routine, RoutineExercise, WorkoutSession, ExerciseLog

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name']


class ExerciseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Exercise
        fields = ['id', 'name', 'description', 'muscle_group', 'image']


class RoutineExerciseSerializer(serializers.ModelSerializer):
    exercise = ExerciseSerializer(read_only=True)
    exercise_id = serializers.PrimaryKeyRelatedField(
        queryset=Exercise.objects.all(), source='exercise', write_only=True
    )
    last_weight_achieved = serializers.SerializerMethodField()

    class Meta:
        model = RoutineExercise
        fields = [
            'id', 'exercise', 'exercise_id', 'sets', 'reps', 
            'rest_time_seconds', 'order_in_routine', 'last_weight_achieved'
        ]

    def get_last_weight_achieved(self, obj: RoutineExercise):
        request = self.context.get('request')
        if not request or not request.user.is_authenticated:
            return None
        last_log = ExerciseLog.objects.filter(
            workout_session__user=request.user,
            routine_exercise__exercise=obj.exercise
        ).order_by('-workout_session__date').first()
        return last_log.weight_achieved if last_log else None


class RoutineSerializer(serializers.ModelSerializer):
    # Cuando este serializer se anida para lectura, solo se usará la parte de lectura.
    # El campo 'exercises' usa el serializer de arriba, que maneja bien tanto lectura como escritura.
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


class ExerciseLogSerializer(serializers.ModelSerializer):
    """ Serializer para mostrar los logs de ejercicios de forma detallada. """
    # En lugar de 'depth = 1', anidamos explícitamente para un mejor control.
    routine_exercise = RoutineExerciseSerializer(read_only=True)
    class Meta:
        model = ExerciseLog
        fields = ['id', 'workout_session', 'routine_exercise', 'weight_achieved', 'notes']


class ExerciseLogCreateSerializer(serializers.ModelSerializer):
    """ Serializer específico para crear un nuevo log de ejercicio. """
    workout_session = serializers.PrimaryKeyRelatedField(queryset=WorkoutSession.objects.all())
    routine_exercise = serializers.PrimaryKeyRelatedField(queryset=RoutineExercise.objects.all())
    weight_achieved = serializers.DecimalField(max_digits=6, decimal_places=2)
    notes = serializers.CharField(required=False, allow_blank=True, allow_null=True)

    class Meta:
        model = ExerciseLog
        fields = ['workout_session', 'routine_exercise', 'weight_achieved', 'notes']

    def validate(self, data):
        workout_session = data.get('workout_session')
        request = self.context.get('request')
        if not request or not hasattr(request, "user"):
             raise serializers.ValidationError("Request context is missing user.")
        if workout_session.user != request.user:
            raise serializers.ValidationError("You do not have permission to log exercises for this session.")
        return data


class WorkoutSessionCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = WorkoutSession
        fields = ['routine']


# --- ¡AQUÍ ESTÁ LA CORRECCIÓN PRINCIPAL! ---
class WorkoutSessionSerializer(serializers.ModelSerializer):
    """
    Serializer para MOSTRAR una sesión de workout, con todos los detalles anidados.
    """
    logs = ExerciseLogSerializer(many=True, read_only=True)
    # Anidamos el RoutineSerializer para obtener el nombre y otros detalles de la rutina.
    routine = RoutineSerializer(read_only=True) 

    class Meta:
        model = WorkoutSession
        fields = ['id', 'user', 'routine', 'date', 'duration', 'logs']
        read_only_fields = ['user']