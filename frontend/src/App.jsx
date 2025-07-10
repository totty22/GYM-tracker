import React from 'react';
import './App.css'; // Estilos básicos que vienen con Vite

// 1. Importa los componentes que hemos creado
import ExerciseList from './components/ExerciseList';
import RoutineList from './components/RoutineList';
import RoutineCreationForm from './components/RoutineCreationForm';

function App() {
  // NOTA: Para que esto funcione, necesitas estar "logueado" en el backend.
  // La forma más fácil de hacerlo para probar es:
  // 1. Abre tu navegador y ve a http://127.0.0.1:8000/admin/
  // 2. Inicia sesión con el superusuario que creaste.
  // El navegador guardará una cookie de sesión. Como el frontend y el backend
  // están en localhost, ¡el frontend podrá usar esa cookie para autenticarse!

  // Esta es una función para poder refrescar la lista de rutinas cuando se crea una nueva.
  // Para que funcione, necesitamos un pequeño ajuste en RoutineList (lo vemos abajo).
  const [refreshKey, setRefreshKey] = React.useState(0);

  const handleRoutineCreated = () => {
    // Cambiamos el estado para forzar a RoutineList a que se vuelva a renderizar y a buscar datos
    setRefreshKey(oldKey => oldKey + 1);
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Gym Routine Tracker</h1>
      </header>
      <main>
        {/* 2. Añade los componentes al JSX para que se muestren en la página */}
        <RoutineCreationForm onRoutineCreated={handleRoutineCreated} />
        <hr />
        {/* Pasamos 'key' para que React lo detecte como un componente nuevo y lo recargue */}
        <RoutineList key={refreshKey} />
        <hr />
        <ExerciseList />
      </main>
    </div>
  );
}

export default App;
