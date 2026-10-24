import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';

import node from '@astrojs/node';

export default defineConfig({
  integrations: [
    react(),
  ],

  vite: {
    plugins: [
      tailwindcss(),
    ],
    build: {
      cssMinify: true,
      minify: 'esbuild',
      terserOptions: {
        compress: {
          drop_console: true,
        },
      },
    },
  },

  adapter: node({
    mode: 'standalone',
  }),
  security: {
    checkOrigin: false,
  },
});