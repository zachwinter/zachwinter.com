
import { buildMutations } from '@/store/util'

export const SET_VIEW_MODE = 'SET_VIEW_MODE'

export const MUTATIONS = {
  [SET_VIEW_MODE]: 'viewMode'
}

export default {
  namespaced: true,
  state: {
    viewMode: 'desktop'
  },
  mutations: buildMutations(MUTATIONS),
  actions: {
    toggle ({ commit, state}) {
      if (state.viewMode === 'mobile') {
        commit(SET_VIEW_MODE, 'desktop')
      } else {
        commit(SET_VIEW_MODE, 'mobile')
      }
    }
  }
}