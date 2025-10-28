import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import Vue from '@vitejs/plugin-vue'
import GLSL from 'vite-plugin-glsl'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import VueRouter from 'unplugin-vue-router/vite'
import SVG from 'vite-svg-loader'

export default defineConfig({
  plugins: [
    GLSL(),
    SVG(),

    AutoImport({
      imports: ['vue', 'vue-router', 'pinia'],
      dts: 'src/auto-imports.d.ts',
      dirs: [
        'src/components',
        'src/sections',
        'src/store',
        'src/hooks',
        'src/interfaces',
        'src/enums'
      ],
      include: [/\.ts?$/, /\.vue\??/],
      vueTemplate: true
    }),

    Components({
      extensions: ['vue'],
      include: [/\.vue$/, /\.vue\?vue/],
      dts: 'src/components.d.ts'
    }),

    VueRouter(),
    Vue()
  ],

  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },

  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `
          @use 'sass:math';
          @use './src/styles/mixins/center.scss' as *;
          @use './src/styles/mixins/type.scss' as *;
          @use "@wearekaleidosync/sass" as *;
          @use './src/styles/functions/units.scss' as *;
          @use './src/styles/functions/spacer.scss' as *;

        `
      }
    }
  },

  server: {
    fs: {
      allow: ['..']
    }
  }
})
