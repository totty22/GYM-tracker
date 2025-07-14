// frontend/src/context/WorkoutContext.jsx (VERSIÓN CORREGIDA Y MÁS ROBUSTA)

import React, { createContext, useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../api/axios';
import toast from 'react-hot-toast';

const WorkoutContext = createContext(null);
const WORKOUT_STORAGE_KEY = 'activeWorkout';

export const useWorkout = () => {
    return useContext(WorkoutContext);
};

export const WorkoutProvider = ({ children }) => {
    const [workoutState, setWorkoutState] = useState(() => {
        try {
            const savedWorkout = window.localStorage.getItem(WORKOUT_STORAGE_KEY);
            return savedWorkout ? JSON.parse(savedWorkout) : null;
        } catch (error) {
            return null;
        }
    });

    const navigate = useNavigate();

    useEffect(() => {
        if (workoutState) {
            window.localStorage.setItem(WORKOUT_STORAGE_KEY, JSON.stringify(workoutState));
        } else {
            window.localStorage.removeItem(WORKOUT_STORAGE_KEY);
        }
    }, [workoutState]);
    
    // --- FUNCIÓN 'startWorkout' REFACTORIZADA ---
    const startWorkout = async (selectedRoutineId) => {
        if (workoutState) {
            toast.error('A workout is already in progress.');
            navigate(`/workout/${workoutState.routineId}`);
            return;
        }
        
        const toastId = toast.loading('Preparing your workout...');
        try {
            // Hacemos dos llamadas a la API en paralelo para mayor eficiencia
            const [sessionRes, routineRes] = await Promise.all([
                // 1. Crear la sesión de entrenamiento
                axiosInstance.post('/api/workout-sessions/', { routine: selectedRoutineId }),
                // 2. Obtener los detalles FRESCOS y actualizados de la rutina
                axiosInstance.get(`/api/routines/${selectedRoutineId}/`)
            ]);
            
            setWorkoutState({
                isActive: true,
                sessionId: sessionRes.data.id,
                routineId: selectedRoutineId,
                routineDetails: routineRes.data, // Usamos los datos frescos
                currentExerciseIndex: 0,
                currentSet: 1,
                isResting: false,
                restUntil: null,
            });
            
            toast.success('Workout started!', { id: toastId });
            navigate(`/workout/${selectedRoutineId}`);
        } catch (error) {
            toast.error('Failed to start workout session.', { id: toastId });
        }
    };

    const advanceToNext = () => {
        if (!workoutState) return;
        const { currentExerciseIndex, currentSet, routineDetails } = workoutState;
        const currentExercise = routineDetails.exercises[currentExerciseIndex];
        const totalSets = parseInt(currentExercise.sets, 10);
        const isLastSet = currentSet === totalSets;
        const restTimeSeconds = currentExercise.rest_time_seconds;
        const restUntilTimestamp = Date.now() + restTimeSeconds * 1000;

        if (isLastSet) {
            const nextExerciseIndex = currentExerciseIndex + 1;
            if (nextExerciseIndex >= routineDetails.exercises.length) {
                endWorkout(true);
            } else {
                setWorkoutState(prev => ({ ...prev, currentExerciseIndex: nextExerciseIndex, currentSet: 1, isResting: true, restUntil: restUntilTimestamp }));
            }
        } else {
            setWorkoutState(prev => ({ ...prev, currentSet: prev.currentSet + 1, isResting: true, restUntil: restUntilTimestamp }));
        }
    };
    
    const finishRest = () => {
        setWorkoutState(prev => prev ? { ...prev, isResting: false, restUntil: null } : null);
    };

    const endWorkout = (showToast = false) => {
        if (showToast) {
            toast.success('Workout Finished! Well done!', { duration: 4000, icon: '🎉' });
        }
        setWorkoutState(null);
        navigate('/routines');
    };

    const value = { workoutState, startWorkout, advanceToNext, finishRest, endWorkout };

    return (
        <WorkoutContext.Provider value={value}>
            {children}
        </WorkoutContext.Provider>
    );
};