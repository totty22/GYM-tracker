// frontend/src/components/RoutineForm.jsx (VERSIÓN CORREGIDA)

import React, { useState, useEffect } from 'react';
import {
    Box, TextField, Button, Typography, Card, CardContent, IconButton,
    List, ListItem, ListItemText, Autocomplete, Grid, Paper
} from '@mui/material';
// --- CORRECCIÓN DE LAS IMPORTACIONES DE ICONOS ---
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';

const RoutineForm = ({ initialData, availableExercises, onSave }) => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [routineExercises, setRoutineExercises] = useState([]);
    
    useEffect(() => {
        if (initialData) {
            setName(initialData.name);
            setDescription(initialData.description);
            setRoutineExercises(initialData.exercises);
        } else {
            setName('');
            setDescription('');
            setRoutineExercises([]);
        }
    }, [initialData]);

    const handleAddExercise = (exerciseObject) => {
        if (exerciseObject && !routineExercises.some(re => re.exercise.id === exerciseObject.id)) {
            const newExercise = {
                exercise: exerciseObject,
                sets: 3,
                reps: '10',
                rest_time_seconds: 60,
                order_in_routine: routineExercises.length + 1
            };
            setRoutineExercises([...routineExercises, newExercise]);
        }
    };

    const handleRemoveExercise = (index) => {
        const updatedExercises = routineExercises.filter((_, i) => i !== index);
        updatedExercises.forEach((ex, i) => ex.order_in_routine = i + 1);
        setRoutineExercises(updatedExercises);
    };

    const handleExerciseChange = (index, field, value) => {
        const updatedExercises = [...routineExercises];
        updatedExercises[index][field] = value;
        setRoutineExercises(updatedExercises);
    };

    const handleMoveExercise = (index, direction) => {
        const newIndex = index + direction;
        if (newIndex < 0 || newIndex >= routineExercises.length) return;
        
        const updatedExercises = [...routineExercises];
        const item = updatedExercises.splice(index, 1)[0];
        updatedExercises.splice(newIndex, 0, item);
        
        updatedExercises.forEach((ex, i) => ex.order_in_routine = i + 1);
        setRoutineExercises(updatedExercises);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const payload = {
            name,
            description,
            exercises: routineExercises.map(re => ({
                exercise_id: re.exercise.id,
                sets: parseInt(re.sets, 10),
                reps: re.reps,
                rest_time_seconds: parseInt(re.rest_time_seconds, 10),
                order_in_routine: re.order_in_routine
            }))
        };
        onSave(payload);
    };

    return (
        <Card>
            <CardContent>
                <Box component="form" onSubmit={handleSubmit}>
                    <TextField label="Routine Name" value={name} onChange={e => setName(e.target.value)} fullWidth required margin="normal" />
                    <TextField label="Description" value={description} onChange={e => setDescription(e.target.value)} fullWidth multiline rows={2} margin="normal" />

                    <Typography variant="h6" sx={{ mt: 3, mb: 1 }}>Exercises</Typography>
                    
                    <Autocomplete
                        options={availableExercises}
                        getOptionLabel={(option) => option.name}
                        onChange={(event, newValue) => {
                            if (newValue) handleAddExercise(newValue);
                        }}
                        renderInput={(params) => <TextField {...params} label="Add an exercise" />}
                        sx={{ mb: 2 }}
                    />

                    <List>
                        {routineExercises.map((re, index) => (
                            <Paper key={index} elevation={2} sx={{ mb: 2, p: 2 }}>
                                <Grid container spacing={2} alignItems="center">
                                    <Grid item xs={12} md={4}>
                                        <Typography variant="subtitle1">{re.exercise?.name}</Typography>
                                        <Typography variant="caption">{re.exercise?.muscle_group}</Typography>
                                    </Grid>
                                    <Grid item xs={6} md={2}><TextField label="Sets" type="number" value={re.sets} onChange={e => handleExerciseChange(index, 'sets', e.target.value)} /></Grid>
                                    <Grid item xs={6} md={2}><TextField label="Reps" value={re.reps} onChange={e => handleExerciseChange(index, 'reps', e.target.value)} /></Grid>
                                    <Grid item xs={12} md={2}><TextField label="Rest (s)" type="number" value={re.rest_time_seconds} onChange={e => handleExerciseChange(index, 'rest_time_seconds', e.target.value)} /></Grid>
                                    <Grid item xs={12} md={2}>
                                        {/* --- CORRECCIÓN DEL NOMBRE DE LOS ICONOS --- */}
                                        <IconButton onClick={() => handleMoveExercise(index, -1)} disabled={index === 0}><ArrowUpwardIcon /></IconButton>
                                        <IconButton onClick={() => handleMoveExercise(index, 1)} disabled={index === routineExercises.length - 1}><ArrowDownwardIcon /></IconButton>
                                        <IconButton onClick={() => handleRemoveExercise(index)} color="error"><DeleteIcon /></IconButton>
                                    </Grid>
                                </Grid>
                            </Paper>
                        ))}
                    </List>

                    <Button type="submit" variant="contained" color="primary" sx={{ mt: 3 }}>Save Routine</Button>
                </Box>
            </CardContent>
        </Card>
    );
};

export default RoutineForm;