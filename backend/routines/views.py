# backend/routines/views.py (VERSIÓN COMPLETA Y CORRECTA)

from django.contrib.auth import authenticate, login, logout
from rest_framework import viewsets, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated

from .models import Exercise, Routine, RoutineExercise, WorkoutSession, ExerciseLog, User
from .serializers import (
    ExerciseSerializer, RoutineSerializer, RoutineExerciseSerializer,
    WorkoutSessionSerializer, ExerciseLogSerializer, UserSerializer
)

# --- Vistas de Autenticación ---

class LoginView(APIView):
    permission_classes = [] 

    def post(self, request, *args, **kwargs):
        username = request.data.get('username')
        password = request.data.get('password')
        user = authenticate(request, username=username, password=password)
        if user is not None:
            login(request, user)
            return Response(UserSerializer(user).data)
        return Response({'error': 'Invalid Credentials'}, status=status.HTTP_401_UNAUTHORIZED)

class LogoutView(APIView):
    def post(self, request, *args, **kwargs):
        logout(request)
        return Response(status=status.HTTP_204_NO_CONTENT)

class UserMeView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        return Response(UserSerializer(request.user).data)

# --- Vistas del Modelo (ViewSets) ---

class ExerciseViewSet(viewsets.ModelViewSet):
    queryset = Exercise.objects.all()
    serializer_class = ExerciseSerializer
    # Dejamos esto abierto para que el frontend pueda obtener la lista de ejercicios sin loguearse
    # permission_classes = [IsAuthenticated] 

class RoutineViewSet(viewsets.ModelViewSet):
    serializer_class = RoutineSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Routine.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

# --- LA CLASE QUE FALTABA ---
class RoutineExerciseViewSet(viewsets.ModelViewSet):
    """
    Este ViewSet maneja los ejercicios individuales que pertenecen a una rutina.
    Es necesario para que el enrutador de DRF funcione correctamente.
    """
    serializer_class = RoutineExerciseSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        """
        Asegura que un usuario solo pueda ver y modificar los ejercicios de sus propias rutinas.
        """
        return RoutineExercise.objects.filter(routine__user=self.request.user)


class WorkoutSessionViewSet(viewsets.ModelViewSet):
    serializer_class = WorkoutSessionSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return WorkoutSession.objects.filter(user=self.request.user)
    
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class ExerciseLogViewSet(viewsets.ModelViewSet):
    serializer_class = ExerciseLogSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        return ExerciseLog.objects.filter(workout_session__user=self.request.user)