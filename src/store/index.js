import Vue from 'vue'
import Vuex from 'vuex'
import mutations from './mutations'
import actions from './actions'
import { detectMobile, detectMobileLandscape } from '@/util/viewport'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    activeSlide: 0,
    totalSlides: 0,
    transitioning: false,
    playing: false,
    isMobile: detectMobile(),
    isMobileLandscape: detectMobileLandscape()
  },
  mutations,
  actions
})
