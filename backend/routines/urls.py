from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    ExerciseViewSet, RoutineViewSet, RoutineExerciseViewSet,
    WorkoutSessionViewSet, ExerciseLogViewSet
)

router = DefaultRouter()
router.register(r'exercises', ExerciseViewSet)
router.register(r'routines', RoutineViewSet, basename='routine')
router.register(r'routine-exercises', RoutineExerciseViewSet)
router.register(r'workout-sessions', WorkoutSessionViewSet, basename='workoutsession')
router.register(r'exercise-logs', ExerciseLogViewSet)

urlpatterns = [
    path('', include(router.urls)),
]