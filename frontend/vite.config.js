import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '127.0.0.1', // <--- AÑADE ESTA LÍNEA
    port: 5173,
    proxy: {
      // Cualquier petición que empiece con '/api' será redirigida a nuestro backend de Django
      '/api': {
        target: 'http://127.0.0.1:8000', // El servidor de desarrollo de Django
        changeOrigin: true, // Necesario para que el servidor de destino no rechace la petición
        // No necesitamos reescribir la ruta, ya que '/api' existe en Django
      }
    }
  }
})
