// frontend/src/components/WorkoutHistoryList.jsx

import React from 'react';
import {
    Accordion, AccordionSummary, AccordionDetails, Typography, Box, List, ListItem, ListItemText, Divider
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const WorkoutHistoryList = ({ sessions }) => {
    if (!sessions || sessions.length === 0) {
        return (
            <Typography sx={{ textAlign: 'center', mt: 4, color: 'text.secondary' }}>
                You have no completed workouts yet. Go train!
            </Typography>
        );
    }

    return (
        <Box>
            {sessions.map((session) => (
                <Accordion key={session.id} sx={{ mb: 2 }}>
                    <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls={`panel${session.id}-content`}
                        id={`panel${session.id}-header`}
                    >
                        {/* Resumen de la sesión */}
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                            <Typography variant="h6">
                                {/* El nombre de la rutina está en session.routine.name gracias a la serialización */}
                                {session.routine?.name || 'Workout Session'}
                            </Typography>
                            <Typography sx={{ color: 'text.secondary' }}>
                                {/* Formateamos la fecha para que sea más legible */}
                                {new Date(session.date).toLocaleDateString()}
                            </Typography>
                        </Box>
                    </AccordionSummary>
                    <AccordionDetails>
                        {/* Detalles de la sesión (los logs) */}
                        <Typography variant="subtitle1" gutterBottom>Exercises Logged:</Typography>
                        <List>
                            {session.logs && session.logs.length > 0 ? (
                                session.logs.map((log, index) => (
                                    <React.Fragment key={log.id}>
                                        <ListItem>
                                            <ListItemText
                                                primary={log.routine_exercise.exercise.name}
                                                secondary={`Weight: ${log.weight_achieved} kg`}
                                            />
                                        </ListItem>
                                        {index < session.logs.length - 1 && <Divider />}
                                    </React.Fragment>
                                ))
                            ) : (
                                <ListItem>
                                    <ListItemText primary="No exercises were logged for this session." />
                                </ListItem>
                            )}
                        </List>
                    </AccordionDetails>
                </Accordion>
            ))}
        </Box>
    );
};

export default WorkoutHistoryList;