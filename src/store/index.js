import Vue from 'vue'
import Vuex from 'vuex'
// import { persist } from './util'
import ui, { MUTATIONS as uiMutations } from './modules/ui'
import background, { MUTATIONS as backgroundMutations } from './modules/background'
import work, { MUTATIONS  as workMutations } from './modules/work'
Vue.use(Vuex)

export const MUTATIONS = {
  ui: uiMutations,
  background: backgroundMutations,
  work: workMutations
}

export default new Vuex.Store({
  // plugins: [persist],
  modules: {
    ui,
    background,
    work
  },
  actions: {
    init ({ dispatch }) {
      dispatch('ui/detectMobile')
      window.addEventListener('resize', () => dispatch('ui/detectMobile'))
    }
  }
})
