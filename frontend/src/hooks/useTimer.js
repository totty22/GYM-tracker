// frontend/src/hooks/useTimer.js (VERSIÓN VERIFICADA)

import { useState, useEffect, useRef, useCallback } from 'react';

// Usamos EXPORTACIÓN NOMBRADA. La palabra 'export' va al principio.
export const useTimer = (initialSeconds, onFinish) => {
    const [secondsLeft, setSecondsLeft] = useState(initialSeconds);
    const intervalRef = useRef(null);

    // Envolvemos onFinish en useCallback para estabilizar la función
    // y evitar que el efecto se vuelva a ejecutar innecesariamente.
    const stableOnFinish = useCallback(onFinish, []);

    useEffect(() => {
        if (secondsLeft <= 0) {
            clearInterval(intervalRef.current);
            stableOnFinish();
            return;
        }

        intervalRef.current = setInterval(() => {
            setSecondsLeft(prevSeconds => prevSeconds - 1);
        }, 1000);

        return () => clearInterval(intervalRef.current);

    }, [secondsLeft, stableOnFinish]);

    return secondsLeft;
};