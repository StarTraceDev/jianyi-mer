/*
 * @Description: Vite配置
 * @Author: StarTraceDev
 * @Date: 2025-07-31 08:52:13
 * @LastEditors: StarTraceDev
 * @LastEditTime: 2025-09-03 14:41:59
 */
import { fileURLToPath, URL } from 'node:url'
import { defineConfig, loadEnv } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import ElementPlus from 'unplugin-element-plus/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueDevTools(),
    tailwindcss(),
    AutoImport({
      resolvers: [ElementPlusResolver()],
      dts: 'src/types/auto-imports.d.ts',
    }),
    Components({
      resolvers: [ElementPlusResolver({ importStyle: 'sass' })],
      dts: 'src/types/components.d.ts',
    }),
    ElementPlus({
      useSource: true,
    }),
  ],
  server: {
    proxy: {
      '/api': {
        target: 'http://119.45.182.127:20700',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '/api/admin/merchant'),
        secure: false,
      }
    }
  },
  css: {
    preprocessorOptions: {
      scss: {
        // 全局加载 SCSS 变量和混合
        // @use "@/styles/variables.scss" as *;
        additionalData: `@use "@/styles/element/index.scss" as *;`,
      },
    },
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
})
