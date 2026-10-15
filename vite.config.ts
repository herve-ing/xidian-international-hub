import {defineConfig} from 'vite';
import react from '@vitejs/plugin-react';
export default defineConfig({base:'./',publicDir:false,plugins:[react()],build:{assetsDir:'',rollupOptions:{input:'prototype.html'}}});
