import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // Otras configuraciones si las tienes
  },
  build: {
    rollupOptions: {
      input: '/index.html', // Asegúrate de que esté configurado correctamente
    }
  },
  // Configuración para enrutamiento en Fly.io o cualquier otro servicio
  optimizeDeps: {
    include: ['react-router-dom']
  },
  ssr: false
})


