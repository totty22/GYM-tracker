# backend/routines/views.py

from django.contrib.auth import authenticate, login, logout
from rest_framework import viewsets, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import action
from rest_framework.parsers import MultiPartParser, FormParser

from .models import Exercise, Routine, RoutineExercise, WorkoutSession, ExerciseLog, User
from .serializers import (
    ExerciseSerializer,
    RoutineSerializer,
    RoutineExerciseSerializer,
    WorkoutSessionSerializer,
    WorkoutSessionCreateSerializer,
    ExerciseLogSerializer,
    ExerciseLogCreateSerializer,
    UserSerializer
)
from .permissions import IsAdminOrReadOnly

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

class ExerciseViewSet(viewsets.ModelViewSet):
    queryset = Exercise.objects.all()
    serializer_class = ExerciseSerializer
    permission_classes = [IsAuthenticated, IsAdminOrReadOnly]
    parser_classes = [MultiPartParser, FormParser]
    
    @action(detail=True, methods=['get'], url_path='history')
    def history(self, request, pk=None):
        exercise = self.get_object()
        logs = ExerciseLog.objects.filter(
            workout_session__user=request.user,
            routine_exercise__exercise=exercise
        ).order_by('workout_session__date')
        if not logs.exists():
            return Response([], status=status.HTTP_200_OK)
        serializer = ExerciseLogSerializer(logs, many=True)
        return Response(serializer.data)
    
    #def perform_create(self, serializer):
        # Aunque solo los admins pueden crear, es bueno saber quién fue.
    #    serializer.save(created_by=self.request.user if 'created_by' in serializer.validated_data else None)


class RoutineViewSet(viewsets.ModelViewSet):
    serializer_class = RoutineSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Routine.objects.filter(user=self.request.user)

    def get_serializer_context(self):
        return {'request': self.request}

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class RoutineExerciseViewSet(viewsets.ModelViewSet):
    serializer_class = RoutineExerciseSerializer
    permission_classes = [IsAuthenticated]
    def get_queryset(self):
        return RoutineExercise.objects.filter(routine__user=self.request.user)


class WorkoutSessionViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return WorkoutSession.objects.filter(user=self.request.user)

    def get_serializer_class(self):
        # La lógica para elegir el serializer de entrada sigue siendo correcta
        if self.action == 'create':
            return WorkoutSessionCreateSerializer
        return WorkoutSessionSerializer

    def perform_create(self, serializer):
        # Esta función guarda el objeto y asigna el usuario, sigue siendo correcta
        serializer.save(user=self.request.user)

    def create(self, request, *args, **kwargs):
        # --- ¡AQUÍ ESTÁ LA CORRECCIÓN MÁGICA! ---
        # Anulamos el método 'create' por completo para controlar la respuesta.
        
        # 1. Usamos el serializer de creación para validar los datos de entrada
        create_serializer = self.get_serializer(data=request.data)
        create_serializer.is_valid(raise_exception=True)
        
        # 2. Guardamos el nuevo objeto WorkoutSession
        self.perform_create(create_serializer)
        
        # 3. PERO para la respuesta, serializamos la instancia recién creada
        #    usando el serializer de LECTURA (el que tiene todos los campos, incluido el ID).
        instance = create_serializer.instance
        read_serializer = WorkoutSessionSerializer(instance)

        # 4. Devolvemos los datos del serializer de lectura en la respuesta.
        headers = self.get_success_headers(read_serializer.data)
        return Response(read_serializer.data, status=status.HTTP_201_CREATED, headers=headers)


class ExerciseLogViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return ExerciseLog.objects.filter(workout_session__user=self.request.user)

    def get_serializer_class(self):
        if self.action == 'create':
            return ExerciseLogCreateSerializer
        return ExerciseLogSerializer

    def get_serializer_context(self):
        return {'request': self.request}

    # --- AÑADIMOS ESTA FUNCIÓN PARA DEPURAR ---
    def create(self, request, *args, **kwargs):
        print("--- RECIBIENDO DATOS PARA CREAR LOG ---")
        print("DATOS RECIBIDOS:", request.data)

        serializer = self.get_serializer(data=request.data)
        
        if not serializer.is_valid():
            print("!!! ERROR DE VALIDACIÓN DEL SERIALIZER !!!")
            print("ERRORES:", serializer.errors)
        
        # Este es el comportamiento por defecto de 'create', lo llamamos para que todo siga funcionando.
        return super().create(request, *args, **kwargs)