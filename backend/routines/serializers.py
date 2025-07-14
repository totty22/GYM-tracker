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
    """ Serializer para mostrar los logs de ejercicios. """
    class Meta:
        model = ExerciseLog
        fields = '__all__'
        # Profundidad 1 para mostrar detalles del ejercicio y sesión, en lugar de solo IDs
        depth = 1 

class ExerciseLogCreateSerializer(serializers.ModelSerializer):
    """ Serializer específico para crear un nuevo log de ejercicio. """
    # Hacemos explícitos los campos que el frontend debe enviar.
    workout_session = serializers.PrimaryKeyRelatedField(queryset=WorkoutSession.objects.all())
    routine_exercise = serializers.PrimaryKeyRelatedField(queryset=RoutineExercise.objects.all())
    weight_achieved = serializers.DecimalField(max_digits=6, decimal_places=2)

    notes = serializers.CharField(required=False, allow_blank=True, allow_null=True)

    class Meta:
        model = ExerciseLog
        # Y lo añadimos a la lista de campos.
        fields = ['workout_session', 'routine_exercise', 'weight_achieved', 'notes']

    def validate(self, data):
        """
        Validación a nivel de objeto para asegurar que el usuario que crea el log
        es el propietario de la sesión de entrenamiento. Medida de seguridad clave.
        """
        workout_session = data.get('workout_session')
        request = self.context.get('request')

        if not request or not hasattr(request, "user"):
             raise serializers.ValidationError("Request context is missing user.")

        if workout_session.user != request.user:
            raise serializers.ValidationError("You do not have permission to log exercises for this session.")
        
        return data

# Asegúrate de que este serializer también existe
class WorkoutSessionCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = WorkoutSession
        fields = ['routine']


class WorkoutSessionSerializer(serializers.ModelSerializer):
    logs = ExerciseLogSerializer(many=True, read_only=True)
    class Meta:
        model = WorkoutSession
        fields = ['id', 'user', 'routine', 'date', 'duration', 'logs']
        read_only_fields = ['user']