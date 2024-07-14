import { defineConfig } from 'vite';
import inject from '@rollup/plugin-inject';
export default defineConfig(({ command, mode }) => ({
  plugins: [
    inject({
      jQuery: 'jquery',
    }),
  ],
  optimizeDeps: {
    include: ['jquery'],
  },
}));