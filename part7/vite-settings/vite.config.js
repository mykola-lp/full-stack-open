// Proxying API requests

// When developing locally, your React app typically runs on one port (e.g., 3000)
// while your backend runs on another (e.g., 3001). The browser's same-origin policy
// would normally block requests between them.

// Vite's proxy setting solves this without requiring CORS configuration on the backend.

// React app makes to /api/notes is automatically forwarded to http://localhost:3001/api/notes by Vite's dev server

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    //open: true,        // open browser automatically
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
      },
    },
  },
})


// import { defineConfig } from 'vite'
// import react from '@vitejs/plugin-react'
// import legacy from '@vitejs/plugin-legacy'

// export default defineConfig({
//   plugins: [
//     react(),
//     legacy({
//       targets: ['defaults', 'not IE 11'],
//     }),
//   ],
// })