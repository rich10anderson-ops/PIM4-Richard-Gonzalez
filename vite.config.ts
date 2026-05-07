import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/setupTests.ts'],
    globals: true,
  },
  server: {
    headers: {
      // Necesario para que signInWithPopup de Firebase pueda comunicarse
      // con la ventana emergente de OAuth de Google.
      // Sin esto, COOP aísla las ventanas y el popup se cierra prematuramente.
      'Cross-Origin-Opener-Policy': 'same-origin-allow-popups',
    },
  },
})
