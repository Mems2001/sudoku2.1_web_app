import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), 
    {
      name: 'fs-firewall',
      configureServer(server) {
        server.middlewares.use((req, res, next) => {
          const url = new URL(req.url || '', `http://${req.headers.host}`);
          const pathname = url.pathname.toLowerCase();

          // 1. Define your "Critical Deny List"
          const isSensitive = pathname.includes('.env') || 
                              pathname.includes('.git') || 
                              pathname.includes('node_modules');

          // 2. Check for the dangerous query parameters
          const hasDangerousQuery = url.searchParams.has('import') || 
                                    url.searchParams.has('raw') || 
                                    url.searchParams.has('inline');

          if (isSensitive && hasDangerousQuery) {
            console.error(`[Security] Blocked attempt to read ${pathname} via query params.`);
            res.statusCode = 403;
            return res.end('Access Denied');
          }

          next();
        });
      },
    }
  ],
  server: {
    open: true,
    host: true
  }
})
