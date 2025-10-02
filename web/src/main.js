import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import App from './App.vue'
import Home from './pages/Home.vue'
import Features from './pages/Features.vue'
import Pricing from './pages/Pricing.vue'
import Contact from './pages/Contact.vue'
import './assets/css/main.css'

const routes = [
  { path: '/', name: 'home', component: Home },
  { path: '/fonctionnalites', name: 'features', component: Features },
  { path: '/tarifs', name: 'pricing', component: Pricing },
  { path: '/contact', name: 'contact', component: Contact }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

const app = createApp(App)
app.use(router)
app.mount('#app')
