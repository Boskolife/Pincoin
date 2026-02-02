/* eslint-disable no-undef */
import { resolve } from 'path';
import { defineConfig } from 'vite';
import handlebars from 'vite-plugin-handlebars';
import { htmlFiles } from './getHTMLFileNames';

const input = { main: resolve(__dirname, 'src/index.html') };
htmlFiles.forEach((file) => {
  input[file.replace('.html', '')] = resolve(__dirname, 'src', file);
});

// Custom plugin to force reload on partial changes
const handlebarsReloadPlugin = () => {
  return {
    name: 'handlebars-reload',
    handleHotUpdate({ file, server }) {
      const normalizedPath = file.replace(/\\/g, '/');
      
      // Check if changed file is a partial (template or section)
      if (normalizedPath.includes('/templates/') || normalizedPath.includes('/sections/')) {
        // Force full page reload when partials change
        server.ws.send({
          type: 'full-reload',
          path: '*'
        });
        return [];
      }
    },
    configureServer(server) {
      const templatesDir = resolve(__dirname, 'src/templates');
      const sectionsDir = resolve(__dirname, 'src/sections');
      
      // Explicitly watch templates and sections directories
      server.watcher.add([templatesDir, sectionsDir]);
    }
  };
};

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
    handlebarsReloadPlugin(),
  ],
  server: {
    port: 3000,
    host: true,
    watch: {
      // Ensure all HTML files are watched
      ignored: []
    },
    hmr: {
      overlay: true
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
