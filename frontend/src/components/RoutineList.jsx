// frontend/src/components/RoutineList.jsx

import React from 'react';
import { 
    Box, 
    Typography, 
    List, 
    ListItem, 
    ListItemText, 
    Card, 
    CardContent,
    CircularProgress,
    Button,
    Divider
} from '@mui/material';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';

const RoutineList = ({ routines, loading, onSelectRoutine }) => {
    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Card>
            <CardContent>
                <Typography variant="h5" component="h2" gutterBottom>
                    Your Routines
                </Typography>
                {routines.length > 0 ? (
                    <List>
                        {routines.map((routine, index) => (
                            <React.Fragment key={routine.id}>
                                <ListItem 
                                    secondaryAction={
                                        <Button 
                                            variant="contained" 
                                            startIcon={<FitnessCenterIcon />}
                                            onClick={() => onSelectRoutine(routine.id)}
                                        >
                                            Start Workout
                                        </Button>
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
                ) : (
                    <Typography variant="body1" color="text.secondary" sx={{ mt: 2 }}>
                        You haven't created any routines yet. Use the form above to get started.
                    </Typography>
                )}
            </CardContent>
        </Card>
    );
};

export default RoutineList;