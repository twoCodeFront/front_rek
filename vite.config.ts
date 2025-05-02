import path from 'node:path'

import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools';
import {defineConfig} from 'vite'


export default defineConfig({
    plugins: [vue(), vueDevTools()],
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src'),
        },
    },
})