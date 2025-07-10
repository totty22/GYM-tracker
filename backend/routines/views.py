from django.shortcuts import render

from rest_framework import viewsets
from .models import Exercise, Routine, RoutineExercise, WorkoutSession, ExerciseLog
from .serializers import (
    ExerciseSerializer, RoutineSerializer, RoutineExerciseSerializer,
    WorkoutSessionSerializer, ExerciseLogSerializer
)
from rest_framework.permissions import IsAuthenticated
from django.contrib.auth import authenticate, login, logout
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .serializers import UserSerializer

class ExerciseViewSet(viewsets.ModelViewSet):
    queryset = Exercise.objects.all()
    serializer_class = ExerciseSerializer
    #permission_classes = [IsAuthenticated] # Solo usuarios autenticados

class RoutineViewSet(viewsets.ModelViewSet):
    serializer_class = RoutineSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        # Los usuarios solo pueden ver y gestionar sus propias rutinas
        return Routine.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        # Asigna el usuario actual al crear una nueva rutina
        serializer.save(user=self.request.user)

class RoutineExerciseViewSet(viewsets.ModelViewSet):
    queryset = RoutineExercise.objects.all()
    serializer_class = RoutineExerciseSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        # Filtra para que un usuario no pueda ver ejercicios de rutinas ajenas
        return RoutineExercise.objects.filter(routine__user=self.request.user)

# Vistas para WorkoutSession y ExerciseLog (pueden ser más complejas en el futuro)
class WorkoutSessionViewSet(viewsets.ModelViewSet):
    serializer_class = WorkoutSessionSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return WorkoutSession.objects.filter(user=self.request.user)
    
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class ExerciseLogViewSet(viewsets.ModelViewSet):
    queryset = ExerciseLog.objects.all()
    serializer_class = ExerciseLogSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        return ExerciseLog.objects.filter(workout_session__user=self.request.user)
    
class LoginView(APIView):
    permission_classes = [] # Permite el acceso a cualquiera

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