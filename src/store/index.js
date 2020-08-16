import Vue from 'vue'
import Vuex from 'vuex'
// import { persist } from './util'
import ui, { MUTATIONS as uiMutations } from './modules/ui'
import background, { MUTATIONS as backgroundMutations } from './modules/background'
import work, { MUTATIONS  as workMutations } from './modules/work'
import nav, { MUTATIONS as navMutations } from './modules/nav'
Vue.use(Vuex)

export const MUTATIONS = {
  ui: uiMutations,
  background: backgroundMutations,
  work: workMutations,
  nav: navMutations
}

export default new Vuex.Store({
  // plugins: [persist],
  modules: {
    ui,
    background,
    work,
    nav
  },
  actions: {
    init ({ dispatch, commit  }, route) {
      dispatch('ui/detectMobile')
      dispatch('ui/detectDarkMode')
      commit(`ui/SET_LOGO_VISIBLE`, route !== 'Home')
      window.addEventListener('resize', () => dispatch('ui/detectMobile'))
    }
  }
})
