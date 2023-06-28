import { acceptHMRUpdate, defineStore } from 'pinia'
import { pause } from '@shaderpad/core/src/util/time'

const Y_DELTA = 20
const X_DELTA = 40
const TIME_DELTA = 300

export const useNavigation = defineStore('navigation', () => {
  const index = ref(0)
  const navigating = ref(false)
  const disabled = ref(false)

  let touchStartY: any
  let touchStartX: any
  let touchEndY: any
  let touchEndX: any
  let touchStartTime: any
  let lastDeltaY: any

  watch(
    () => index.value,
    async () => {
      navigating.value = true
      await pause(750)
      navigating.value = false
    }
  )

  function onTouchStart(e) {
    if (disabled.value) return

    const touch = e.touches[0]
    touchStartY = touch.clientY
    touchStartX = touch.clientX
    touchStartTime = window.performance.now()
  }

  function onTouchMove(e) {
    if (disabled.value) return

    const touch = e.touches[0]
    touchEndY = touch.clientY
    touchEndX = touch.clientX
  }

  function onTouchEnd(e) {
    if (touchEndY === null || disabled.value) return

    const deltaY = touchEndY - touchStartY
    const deltaX = touchEndX - touchStartX

    if (deltaX > X_DELTA) return

    const deltaTime = window.performance.now() - touchStartTime

    if (deltaY > Y_DELTA && deltaTime < TIME_DELTA && !navigating.value) index.value--
    if (deltaY < -Y_DELTA && deltaTime < TIME_DELTA && !navigating.value && index.value !== 3)
      index.value++

    touchStartY = null
    touchEndY = null
    touchStartX = null
    touchEndX = null
  }

  function onMouseWheel(e: WheelEvent) {
    let { deltaY } = e
    
    if (disabled.value) return

    const velocity = Math.abs(lastDeltaY - deltaY)

    lastDeltaY = deltaY

    if (velocity < Y_DELTA) {
      deltaY = deltaY
      return
    }
    if (deltaY > 0 && !navigating.value && index.value !== 3) {
      index.value++
    }
    if (deltaY < 0 && index.value !== 0 && !navigating.value) {
      index.value--
    }

    deltaY = deltaY
  }

  // if ('ontouchstart' in window) {
  //   document.body.addEventListener('touchstart', onTouchStart)
  //   document.body.addEventListener('touchend', onTouchEnd)
  //   document.body.addEventListener('touchmove', onTouchMove)
  // }

  // document.body.addEventListener('wheel', onMouseWheel)

  return {
    index,
    navigating,
    disabled
  }
})

if (import.meta.hot) import.meta.hot.accept(acceptHMRUpdate(useNavigation, import.meta.hot))
