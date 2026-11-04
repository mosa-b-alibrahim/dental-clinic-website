import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { existsSync } from 'node:fs';
import { resolve } from 'node:path';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), 'VITE_');
  return {
    base: env.VITE_BASE_PATH || '/dental-clinic-website/',
    plugins: [react()],
    define: {
      __HAS_PROMO_VIDEO__: JSON.stringify(
        existsSync(resolve('public/videos/clinic-promo.mp4')),
      ),
    },
  };
});
