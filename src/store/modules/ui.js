import { buildModule, exposeMutations } from '@/store/util'
import { detectMobile, detectMobileLandscape, detectDarkMode, detectMobilePortrait } from '@/util/viewport'

const state = {
  mobile: detectMobile(),
  mobilePortrait: detectMobilePortrait(),
  mobileLandscape: detectMobileLandscape(),
  logoVisible: false,
  headerVisible: false,
  darkMode: detectDarkMode()
}

export const MUTATIONS = exposeMutations(state)

const actions = {
  detectMobile ({ commit }) {
    commit('SET_MOBILE', detectMobile())
    commit('SET_MOBILE_PORTRAIT', detectMobilePortrait())
    commit('SET_MOBILE_LANDSCAPE', detectMobileLandscape())
  },
  toggleHeader ({ commit, state }) {
    commit('SET_HEADER_VISIBLE', !state.headerVisible)
  },
  detectDarkMode ({ commit, state }) {
    commit('SET_DARK_MODE', detectDarkMode())
    if (state.darkMode) document.body.classList.add('dark')
  }
}

export default buildModule({ state, actions })