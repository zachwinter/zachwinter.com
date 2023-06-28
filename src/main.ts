import routes from '~pages'
import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import { createPinia } from 'pinia'
import App from './App.vue'

const app = createApp(App)
const router = createRouter({ routes, history: createWebHistory() })
const pinia = createPinia()

app.use(pinia).use(router).mount('#app')
