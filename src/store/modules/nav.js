import { buildModule, exposeMutations } from '@/store/util'

const state = {
  previousVisible: false,
  previousText: '',
  nextVisible: false,
  nextText: '',
  next: 0,
  previous: 0,
  transitioning: false
}

export const MUTATIONS = exposeMutations(state)

const actions = {
  set ({ commit }, { previous, next }) {
    commit('SET_PREVIOUS_VISIBLE', previous.visible)
    commit('SET_PREVIOUS_TEXT', previous.text)
    commit('SET_NEXT_VISIBLE', next.visible)
    commit('SET_NEXT_TEXT', next.text)
  },
  nextClicked ({ commit, state }) {
    if (state.transitioning) return
    commit('SET_NEXT', state.next + 1)
  },
  previousClicked ({ commit, state }) {
    if (state.transitioning) return
    commit('SET_PREVIOUS', state.previous + 1)
  },
  transition ({ commit }) {
    commit('SET_TRANSITIONING', true)
  }
}

export default buildModule({ state, actions })