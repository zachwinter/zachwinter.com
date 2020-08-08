import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import {
  faChevronDown,
  faChevronUp,
  faChevronLeft,
  faChevronRight,
  faEnvelope,
  faMobile,
  faDesktopAlt
} from '@fortawesome/pro-light-svg-icons'
import { faGithub, faInstagram, faLinkedin, faTelegramPlane } from '@fortawesome/free-brands-svg-icons'

[
  faChevronDown,
  faChevronUp,
  faChevronLeft,
  faChevronRight,
  faMobile,
  faEnvelope,
  faGithub,
  faInstagram,
  faLinkedin,
  faTelegramPlane,
  faDesktopAlt
].forEach(icon => library.add(icon))

Vue.component('icon', FontAwesomeIcon)

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
