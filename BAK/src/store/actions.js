import {
  SET_ACTIVE_SLIDE,
  SET_TRANSITIONING,
  SET_IS_MOBILE,
  SET_IS_MOBILE_LANDSCAPE
} from './mutation-types'
import { detectMobile, detectMobileLandscape } from '@/util/viewport'

export default {
  previous ({ state, commit }) {
    if (state.activeSlide === 0) return
    if (!state.isMobile && state.transitioning) return
    commit(SET_TRANSITIONING, true)
    commit(SET_ACTIVE_SLIDE, state.activeSlide - 1)
  },

  next ({ commit, state }) {
    if (state.activeSlide === state.totalSlides - 1) return
    if (!state.isMobile && state.transitioning) return
    commit(SET_TRANSITIONING, true)
    commit(SET_ACTIVE_SLIDE, state.activeSlide + 1)
  },

  detectMobile ({ commit }) {
    commit(SET_IS_MOBILE, detectMobile())
    commit(SET_IS_MOBILE_LANDSCAPE, detectMobileLandscape())
  }
}