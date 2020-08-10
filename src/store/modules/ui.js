
import { buildMutations } from '@/store/util'
import { detectMobile } from '@/util/viewport'

export const SET_MOBILE = 'SET_MOBILE'
export const SET_LOGO_VISIBLE = 'SET_LOGO_VISIBLE'
export const SET_HEADER_VISIBLE = 'SET_HEADER_VISIBLE'
export const SET_DARK_MODE = 'SET_DARK_MODE'

export const MUTATIONS = {
  [SET_MOBILE]: 'mobile',
  [SET_LOGO_VISIBLE]: 'logoVisible',
  [SET_HEADER_VISIBLE]: 'headerVisible',
  [SET_DARK_MODE]: 'darkMode'
}

export default {
  namespaced: true,
  state: {
    mobile: detectMobile(),
    logoVisible: false,
    headerVisible: false,
    darkMode: window.matchMedia('(prefers-color-scheme: dark)').matches
  },
  mutations: buildMutations(MUTATIONS),
  actions: {
    detectMobile ({ commit }) {
      commit(SET_MOBILE, detectMobile())
    },
    showElements ({ commit }) {
      commit(SET_LOGO_VISIBLE, true)
    },
    toggleHeader ({ commit, state }) {
      commit(SET_HEADER_VISIBLE, !state.headerVisible)
    },
    detectDarkMode ({ commit, state }) {
      commit(SET_DARK_MODE, window.matchMedia('(prefers-color-scheme: dark)').matches)
      if (state.darkMode) document.body.classList.add('dark')
    }
  }
}