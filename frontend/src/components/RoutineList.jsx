// frontend/src/components/RoutineList.jsx

import React from 'react';
import { 
    Box, Typography, List, ListItem, ListItemText, Card, CardContent,
    CircularProgress, Button, Divider, IconButton
} from '@mui/material';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { Link as RouterLink } from 'react-router-dom';

const RoutineList = ({ routines, loading, onSelectRoutine, onDeleteRoutine }) => {
    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
                <CircularProgress />
            </Box>
        );
    }

    if (!routines || routines.length === 0) {
        return (
            <Card>
                <CardContent>
                    <Typography variant="h5" component="h2" gutterBottom>
                        Your Routines
                    </Typography>
                    <Typography variant="body1" color="text.secondary" sx={{ mt: 2 }}>
                        You haven't created any routines yet. Use the "Create New Routine" button to get started.
                    </Typography>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card>
            <CardContent>
                <Typography variant="h5" component="h2" gutterBottom>
                    Your Routines
                </Typography>
                <List>
                    {routines.map((routine, index) => (
                        <React.Fragment key={routine.id}>
                            <ListItem 
                                secondaryAction={
                                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                        <IconButton component={RouterLink} to={`/routines/${routine.id}`} aria-label="edit">
                                            <EditIcon />
                                        </IconButton>
                                        <IconButton onClick={() => onDeleteRoutine(routine.id)} aria-label="delete" sx={{ mx: 1 }}>
                                            <DeleteIcon color="error" />
                                        </IconButton>
                                        <Button 
                                            variant="contained" 
                                            startIcon={<FitnessCenterIcon />}
                                            onClick={() => onSelectRoutine(routine.id)}
                                        >
                                            Start Workout
                                        </Button>
                                    </Box>
                                }
                            >
                                <ListItemText 
                                    primary={routine.name} 
                                    secondary={routine.description || 'No description provided'} 
                                />
                            </ListItem>
                            {index < routines.length - 1 && <Divider />}
                        </React.Fragment>
                    ))}
                </List>
            </CardContent>
        </Card>
    );
};

export default RoutineList;