import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '@/views/Home'
import Work from '@/views/Work'
import Resume from '@/views/Resume'
import Contact from '@/views/Contact'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/work',
    name: 'Work',
    component: Work
  },
  {
    path: '/resume',
    name: 'Resume',
    component: Resume
  },
  {
    path: '/contact',
    name: 'Contact',
    component: Contact
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
