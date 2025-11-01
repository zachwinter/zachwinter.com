import { defineStore } from 'pinia'
import { useBackground } from './background'

const Y_DELTA = 20
const X_DELTA = 40
const TIME_DELTA = 300

export const useScroll = defineStore('scroll', () => {
  const background = useBackground()
  const viewport = useViewport()
  const text = ref('')

  const mainNavigation = ref<any>({ up: null, down: null, left: null, right: null })
  const mainState = ref<any>({
    activeIndex: 0,
    totalSections: 0,
    isScrolling: false,
    scrollPosition: 0
  })
  const kaleidosyncNavigation = ref<any>({
    current: null,
    up: null,
    down: null,
    left: null,
    right: null
  })
  const covidNavigation = ref<any>({ current: null, up: null, down: null, left: null, right: null })
  const msfNavigation = ref<any>({ current: null, up: null, down: null, left: null, right: null })

  const kaleidosyncActiveIndex = ref(-1)
  const covidActiveIndex = ref(-1)
  const msfActiveIndex = ref(-1)

  function onMainNavigation(navigation: any) {
    if (navigation?.current?.description) {
      text.value = navigation.current?.description
    }
    mainNavigation.value = navigation
    if (mainState.value.activeIndex === 1 && kaleidosyncNavigation.value.current) {
      onKaleidosyncNavigation(kaleidosyncNavigation.value)
    }
  }

  function onMainState(state: any) {
    mainState.value = state
    // Update background based on scroll position
    background.scrollY = (state.scrollPosition / viewport.height) * 5

    // Trigger nested scroller text updates when we land on their sections
    if (state.activeIndex === 1 && kaleidosyncNavigation.value.current) {
      onKaleidosyncNavigation(kaleidosyncNavigation.value)
    } else if (state.activeIndex === 2) {
      if (covidNavigation.value.current) {
        onCovidNavigation(covidNavigation.value)
      }
      onCovidScroll(mainState.value)
    } else if (state.activeIndex === 3 && msfNavigation.value.current) {
      onMSFNavigation(msfNavigation.value)
    }
  }

  function onKaleidosyncNavigation(navigation: any) {
    kaleidosyncNavigation.value = navigation
    if (!navigation.current?.description) return
    if (mainState.value.activeIndex !== 1) return
    text.value = navigation.current.description
  }

  function onKaleidosyncScroll(state: any) {
    if (state.activeIndex !== kaleidosyncActiveIndex.value) {
      kaleidosyncActiveIndex.value = state.activeIndex
    }
  }

  function onCovidNavigation(navigation: any) {
    covidNavigation.value = navigation
    if (!navigation.current?.description) return
    if (mainState.value.activeIndex !== 2) return
    text.value = navigation.current.description
  }

  function onCovidScroll(state: any) {
    if (state.activeIndex !== covidActiveIndex.value) {
      covidActiveIndex.value = state.activeIndex
    }
  }

  function onMSFNavigation(navigation: any) {
    msfNavigation.value = navigation
    if (!navigation.current?.description) return
    if (mainState.value.activeIndex !== 3) return
    text.value = navigation.current.description
  }

  function onMSFScroll(state: any) {
    if (state.activeIndex !== msfActiveIndex.value) {
      msfActiveIndex.value = state.activeIndex
    }
  }

  return {
    onCovidNavigation,
    onCovidScroll,
    onMainNavigation,
    onKaleidosyncNavigation,
    onKaleidosyncScroll,
    onMSFNavigation,
    onMSFScroll,
    onMainState,
    mainState,
    mainNavigation,
    kaleidosyncNavigation,
    msfNavigation,
    covidNavigation,
    kaleidosyncActiveIndex,
    covidActiveIndex,
    msfActiveIndex,
    text
  }
})
