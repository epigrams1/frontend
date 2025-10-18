import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import Vue from '@vitejs/plugin-vue'
import Components from 'unplugin-vue-components/vite'
import {BootstrapVueNextResolver} from 'unplugin-vue-components/resolvers'
import {configDefaults} from "vitest/config";
import Vuetify, { transformAssetUrls } from 'vite-plugin-vuetify'

// https://vitejs.dev/config/
export default defineConfig({
  test: {
    coverage: {
      provider: 'v8'
    },
    globals: true,
    environment: 'jsdom',
    exclude: [...configDefaults.exclude, 'packages/template/*'],
  },
    plugins: [
      Vue({
        template: { transformAssetUrls }
      }),
    // Vuetify Loader
      Vuetify({ autoImport: true }),
    Components({
      resolvers: [BootstrapVueNextResolver()],
    }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
})
