import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
    root: '.',
    build: {
        outDir: 'dist',
        rollupOptions: {
            input: {
                main: resolve(__dirname, 'index.html'),
                alquimia: resolve(__dirname, 'pages/alquimia.html'),
                catalogo: resolve(__dirname, 'pages/catalogo.html'),
                chat: resolve(__dirname, 'pages/chat.html'),
                decorador: resolve(__dirname, 'pages/decorador.html'),
                help: resolve(__dirname, 'pages/help-noiva.html'),
                moodboard: resolve(__dirname, 'pages/moodboard.html'),
                provador: resolve(__dirname, 'pages/provador.html'),
                tendencias: resolve(__dirname, 'pages/tendencias.html'),
            },
        },
    },
});
