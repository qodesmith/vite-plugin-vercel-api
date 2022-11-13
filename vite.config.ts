import {defineConfig} from 'vite'
import react from '@vitejs/plugin-react'
import vitePluginVercelApi from './src/vitePluginVercelApi'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), vitePluginVercelApi({debugOptions: true})],
  publicDir: 'clientPublic',
})
