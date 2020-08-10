
import { buildMutations } from '@/store/util'

export const SET_PREVIOUS_VISIBLE = 'SET_PREVIOUS_VISIBLE'
export const SET_PREVIOUS_TEXT = 'SET_PREVIOUS_TEXT'
export const SET_NEXT_VISIBLE = 'SET_NEXT_VISIBLE'
export const SET_NEXT_TEXT = 'SET_NEXT_TEXT'
export const SET_NEXT = 'SET_NEXT'
export const SET_PREVIOUS = 'SET_PREVIOUS'
export const SET_TRANSITIONING = 'SET_TRANSITIONING'

export const MUTATIONS = {
  [SET_PREVIOUS_VISIBLE]: 'previousVisible',
  [SET_PREVIOUS_TEXT]: 'previousText',
  [SET_NEXT_VISIBLE]: 'nextVisible',
  [SET_NEXT_TEXT]: 'nextText',
  [SET_NEXT]: 'next',
  [SET_PREVIOUS]: 'previous',
  [SET_TRANSITIONING]: 'transitioning'
}

export default {
  namespaced: true,
  state: {
    previousVisible: false,
    previousText: '',
    nextVisible: false,
    nextText: '',
    next: 0,
    previous: 0,
    transitioning: false
  },
  mutations: buildMutations(MUTATIONS),
  actions: {
    set ({ commit }, { previous, next }) {
      commit(SET_PREVIOUS_VISIBLE, previous.visible)
      commit(SET_PREVIOUS_TEXT, previous.text)
      commit(SET_NEXT_VISIBLE, next.visible)
      commit(SET_NEXT_TEXT, next.text)
    },
    nextClicked ({ commit, state }) {
      if (state.transitioning) return
      commit(SET_NEXT, state.next + 1)
    },
    previousClicked ({ commit, state }) {
      if (state.transitioning) return
      commit(SET_PREVIOUS, state.previous + 1)
    },
    transition ({ commit }) {
      commit(SET_TRANSITIONING, true)
    }
  }
}