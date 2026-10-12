import { defineConfig } from 'vite';

export default defineConfig({
  // Pages provides /<repository>/, or / for a custom domain/user site.
  base: process.env.VITE_BASE_PATH || '/',
  server: {
    host: '0.0.0.0',
    allowedHosts: ['code.local'],
  },
});
