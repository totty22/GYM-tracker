// frontend/src/main.jsx (VERSIÓN CORREGIDA Y COMPLETA)

import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom'; // <--- Paso 1: Importar
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

import App from './App.jsx';

// Definición del tema (puedes personalizarlo más tarde)
const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#90caf9', // Un azul claro para el modo oscuro
    },
    secondary: {
      main: '#f48fb1', // Un rosa para acentos
    },
  },
});

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    {/* Paso 2: Envolver TODA la aplicación con BrowserRouter */}
    <BrowserRouter> 
      <ThemeProvider theme={darkTheme}>
        <CssBaseline />
        <App />
      </ThemeProvider>
    </BrowserRouter>
  </React.StrictMode>
);