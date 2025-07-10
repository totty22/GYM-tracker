from django.contrib import admin
from .models import Exercise, Routine, RoutineExercise, WorkoutSession, ExerciseLog

admin.site.register(Exercise)
admin.site.register(Routine)
admin.site.register(RoutineExercise)
admin.site.register(WorkoutSession)
admin.site.register(ExerciseLog)