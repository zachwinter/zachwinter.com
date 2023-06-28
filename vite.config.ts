import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import Vue from '@vitejs/plugin-vue'
import GLSL from 'vite-plugin-glsl'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import Pages from 'vite-plugin-pages'
import SVG from 'vite-svg-loader'

export default defineConfig({
  plugins: [
    Vue(),

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

    Pages()
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
          @use './src/styles/imports.scss' as *;
          @import './src/styles/functions/units.scss';
          @import './src/styles/functions/spacer.scss';
        `
      }
    }
  }
})
