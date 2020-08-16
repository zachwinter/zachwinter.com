import { buildModule, exposeMutations } from '@/store/util'

const state = {
  viewMode: 'desktop',
  index: 0
}

export const MUTATIONS = exposeMutations(state)

const actions = {
  toggle ({ commit, state}) {
    if (state.viewMode === 'mobile') {
      commit('SET_VIEW_MODE', 'desktop')
    } else {
      commit('SET_VIEW_MODE', 'mobile')
    }
  }
}

export default buildModule({ state, actions })