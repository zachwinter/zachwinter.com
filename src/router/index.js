import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Work from '../views/Work.vue'
import Contact from '../views/Contact.vue'

Vue.use(VueRouter)

  const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    meta: {
      title: 'Zach Winter • UI/UX Engineer'
    }
  },
  {
    path: '/work',
    name: 'Work',
    component: Work,
    meta: {
      title: 'Work • Zach Winter'
    }
  },
  {
    path: '/contact',
    name: 'Contact',
    component: Contact,
    meta: {
      title: 'Contact • Zach Winter'
    }
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

router.beforeEach((to, from, next) => {
  document.title = to.meta.title
  next()
})

export default router
