from django.db import models
from django.contrib.auth.models import User

class Exercise(models.Model):
    name = models.CharField(max_length=100, unique=True)
    description = models.TextField(blank=True, null=True)
    muscle_group = models.CharField(max_length=50, blank=True)

    def __str__(self):
        return self.name

class Routine(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='routines')
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.name} by {self.user.username}"

class RoutineExercise(models.Model):
    routine = models.ForeignKey(Routine, on_delete=models.CASCADE, related_name='exercises')
    exercise = models.ForeignKey(Exercise, on_delete=models.PROTECT)
    sets = models.PositiveIntegerField()
    reps = models.CharField(max_length=20) # '8-12', 'AMRAP', '15'
    rest_time_seconds = models.PositiveIntegerField(help_text="Rest time in seconds")
    order_in_routine = models.PositiveIntegerField()

    class Meta:
        ordering = ['order_in_routine']
        unique_together = ('routine', 'order_in_routine')

    def __str__(self):
        return f"{self.exercise.name} in {self.routine.name}"

class WorkoutSession(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='workout_sessions')
    routine = models.ForeignKey(Routine, on_delete=models.CASCADE)
    date = models.DateTimeField(auto_now_add=True)
    duration = models.DurationField(blank=True, null=True, help_text="Duration of the workout session")

    def __str__(self):
        return f"Workout on {self.date.strftime('%Y-%m-%d')} by {self.user.username}"

class ExerciseLog(models.Model):
    workout_session = models.ForeignKey(WorkoutSession, on_delete=models.CASCADE, related_name='logs')
    routine_exercise = models.ForeignKey(RoutineExercise, on_delete=models.CASCADE)
    weight_achieved = models.DecimalField(max_digits=6, decimal_places=2)
    notes = models.TextField(blank=True, null=True)

    def __str__(self):
        return f"Log for {self.routine_exercise.exercise.name} in session {self.workout_session.id}"