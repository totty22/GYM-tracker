// frontend/src/components/ExerciseList.jsx

import React from 'react';
import {
    List, ListItem, ListItemText, IconButton, Box, CircularProgress, Typography, Paper, Divider
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';

const ExerciseList = ({ exercises, loading, onEdit, onDelete }) => {
    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
                <CircularProgress />
            </Box>
        );
    }

    if (exercises.length === 0) {
        return (
            <Typography sx={{ textAlign: 'center', mt: 4 }}>
                No exercises found. Add one to get started!
            </Typography>
        );
    }

    return (
        <Paper>
            <List>
                {exercises.map((exercise, index) => (
                    <React.Fragment key={exercise.id}>
                        <ListItem>
                            <ListItemText
                                primary={exercise.name}
                                secondary={exercise.muscle_group || 'No muscle group specified'}
                            />
                            <Box>
                                <IconButton edge="end" aria-label="edit" onClick={() => onEdit(exercise)}>
                                    <EditIcon />
                                </IconButton>
                                <IconButton edge="end" aria-label="delete" onClick={() => onDelete(exercise.id)}>
                                    <DeleteIcon />
                                </IconButton>
                            </Box>
                        </ListItem>
                        {index < exercises.length - 1 && <Divider />}
                    </React.Fragment>
                ))}
            </List>
        </Paper>
    );
};

export default ExerciseList;