/* eslint-disable no-undef */
import { resolve } from 'path';
import { defineConfig } from 'vite';
import handlebars from 'vite-plugin-handlebars';
import { htmlFiles } from './getHTMLFileNames';

const input = { main: resolve(__dirname, 'src/index.html') };
htmlFiles.forEach((file) => {
  input[file.replace('.html', '')] = resolve(__dirname, 'src', file);
});

export default defineConfig({
  base: '/Pincoin',
  root: 'src',
  publicDir: '../public',
  plugins: [
    handlebars({ 
      partialDirectory: [
        resolve(__dirname, 'src/templates'),
        resolve(__dirname, 'src/sections')
      ],
      reloadOnPartialChange: true
    }),
  ],
  server: {
    watch: {
      // Watch templates and sections directories for changes
      // Since root is 'src', paths are relative to src directory
      include: [
        '**/*.html',
        'templates/**',
        'sections/**'
      ]
    }
  },
  build: {
    rollupOptions: {
      input,
    },
    outDir: '../dist/',
    emptyOutDir: true,
  },
});
