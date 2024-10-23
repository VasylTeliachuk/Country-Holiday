import vuetify from 'vite-plugin-vuetify'

export default defineNuxtConfig({
  // Налаштування для Nuxt 3
  css: ['vuetify/styles'],

  build: {
    transpile: ['vuetify']
  },

  vite: {
    plugins: [
      vuetify({ autoImport: true })
    ]
  },

  router: {
    base: '/'
  },

  compatibilityDate: '2024-10-23'
})