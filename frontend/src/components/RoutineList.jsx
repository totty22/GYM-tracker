// frontend/src/components/RoutineList.jsx

import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
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
    Divider,
    IconButton
} from '@mui/material';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import EditIcon from '@mui/icons-material/Edit';

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
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                            <IconButton 
                                                component={RouterLink} 
                                                to={`/routines/${routine.id}`} 
                                                aria-label="edit"
                                            >
                                                <EditIcon />
                                            </IconButton>
                                            <Button 
                                                variant="contained" 
                                                size="small"
                                                startIcon={<FitnessCenterIcon />}
                                                onClick={() => onSelectRoutine(routine.id)}
                                            >
                                                Start
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
                ) : (
                    <Typography variant="body1" color="text.secondary" sx={{ mt: 2, textAlign: 'center' }}>
                        You haven't created any routines yet. <br />
                        Click "Create New Routine" to get started.
                    </Typography>
                )}
            </CardContent>
        </Card>
    );
};

export default RoutineList;