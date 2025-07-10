# backend/routines/urls.py (VERSIÓN FINAL Y CORREGIDA)

from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    ExerciseViewSet, RoutineViewSet, RoutineExerciseViewSet,
    WorkoutSessionViewSet, ExerciseLogViewSet,
    LoginView, LogoutView, UserMeView
)

router = DefaultRouter()
router.register(r'exercises', ExerciseViewSet, basename='exercise')
router.register(r'routines', RoutineViewSet, basename='routine')

# --- ESTA ES LA LÍNEA QUE SE CORRIGE ---
# Añadimos basename='routineexercise' para resolver el error
router.register(r'routine-exercises', RoutineExerciseViewSet, basename='routineexercise')

router.register(r'workout-sessions', WorkoutSessionViewSet, basename='workoutsession')
router.register(r'exercise-logs', ExerciseLogViewSet, basename='exerciselog')

urlpatterns = [
    path('', include(router.urls)),
    
    path('auth/login/', LoginView.as_view(), name='auth-login'),
    path('auth/logout/', LogoutView.as_view(), name='auth-logout'),
    path('auth/me/', UserMeView.as_view(), name='auth-me'),
]