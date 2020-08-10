
import { buildMutations } from '@/store/util'
import { detectMobile } from '@/util/viewport'

export const SET_MOBILE = 'SET_MOBILE'
export const SET_LOGO_VISIBLE = 'SET_LOGO_VISIBLE'
export const SET_HEADER_VISIBLE = 'SET_HEADER_VISIBLE'

export const MUTATIONS = {
  [SET_MOBILE]: 'mobile',
  [SET_LOGO_VISIBLE]: 'logoVisible',
  [SET_HEADER_VISIBLE]: 'headerVisible'
}

export default {
  namespaced: true,
  state: {
    mobile: detectMobile(),
    logoVisible: false,
    headerVisible: false
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
    }
  }
}