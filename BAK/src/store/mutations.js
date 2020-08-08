
import {
  SET_ACTIVE_SLIDE,
  SET_TOTAL_SLIDES,
  SET_TRANSITIONING,
  SET_PLAYING,
  SET_IS_MOBILE,
  SET_IS_MOBILE_LANDSCAPE,
  SET_INITIAL_INDEX
} from './mutation-types'

export default {
  [SET_ACTIVE_SLIDE] (state, val) {
    state.activeSlide = val
  },
  [SET_TOTAL_SLIDES] (state, val) {
    state.totalSlides = val
  },
  [SET_TRANSITIONING] (state, val) {
    state.transitioning = val
  },
  [SET_PLAYING] (state, val) {
    state.playing = val
  },
  [SET_IS_MOBILE] (state, val) {
    state.isMobile = val
  },
  [SET_IS_MOBILE_LANDSCAPE] (state, val) {
    state.isMobileLandscape = val
  },
  [SET_INITIAL_INDEX] (state, val) {
    state.initialIndex = val
  }
}