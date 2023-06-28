import type { Coords2D } from '@/interfaces/animations'
import type { ComputedRef, Ref } from 'vue'
import { acceptHMRUpdate, defineStore } from 'pinia'
import { determineRefreshRate } from '@/util/monitor'

export const MOBILE_BREAKPOINT: number = 320
export const TABLET_BREAKPOINT: number = 768
export const LAPTOP_BREAKPOINT: number = 1280
export const DESKTOP_BREAKPOINT: number = 1650

const setScale = (val: number): void =>
  document.documentElement.style.setProperty('--viewport-scale', `${val}`)

export const useViewport = defineStore('viewport', () => {
  const w = window.innerWidth
  const h = window.innerHeight
  const d = window.devicePixelRatio

  let initialMouseValue: any = [w / 2, h / 2]

  initialMouseValue.x = initialMouseValue[0]
  initialMouseValue.y = initialMouseValue[1]
  initialMouseValue = initialMouseValue as Coords2D

  const width: Ref<number> = ref(w)
  const height: Ref<number> = ref(h)
  const dpr: Ref<number> = ref(d)
  const screen: Ref<number> = ref(w * h * d)
  const mouse: Ref<Coords2D> = ref(initialMouseValue as Coords2D)
  const wheelX = ref(0)
  const refreshRate: any = ref(null)
  const fullScreen = ref(false)
  const mouseProgress = ref(1)
  const tv = ref(`${navigator.userAgent}`.toUpperCase().includes('WEBOS'))

  determineRefreshRate().then((val: number) => {
    if (val !== Infinity) refreshRate.value = val
  })

  const orientation: ComputedRef<'LANDSCAPE' | 'PORTRAIT'> = computed(() => {
    if (width.value >= height.value) return 'LANDSCAPE'
    return 'PORTRAIT'
  })

  const landscape: ComputedRef<boolean> = computed(() => {
    return orientation.value === 'LANDSCAPE'
  })

  const portrait: ComputedRef<boolean> = computed(() => {
    return orientation.value === 'PORTRAIT'
  })

  const mobile: ComputedRef<boolean> = computed(() => {
    return (
      (width.value <= 500 && height.value <= 1000) || (width.value <= 1000 && height.value <= 500)
    )
  })

  const tablet: ComputedRef<boolean> = computed(() => {
    return !mobile.value && width.value * height.value <= 1024 * 1366
  })

  const desktop: ComputedRef<boolean> = computed(() => {
    return width.value >= 1650
  })

  const keyboard = {
    pressed: ref([])
  }

  watch(
    () => fullScreen.value,
    async (val) => {
      if (val) {
        try {
          await document.body.requestFullscreen()
        } catch (e) {
          console.log(e)
        }

        return
      }

      document.exitFullscreen()
    }
  )

  const setBreakpoint = () => {
    if (mobile.value) {
      if (portrait.value) {
        return setScale(2);
      }

      if (landscape.value) {
        return setScale(.8)
      }
    }

    if (tablet.value) {
      if (portrait.value) return setScale(0.85)
      return setScale(0.7)
    }

    if (desktop.value) return setScale(0.6)

    return setScale(0.7)
  }

  document.documentElement.style.setProperty('--viewport-width', `${w}px`)
  document.documentElement.style.setProperty('--viewport-height', `${h}px`)

  setBreakpoint()

  const pointerMove = (pageX: number = mouse.value[0], pageY: number = mouse.value[1]) => {
    const coords: any = [pageX, pageY]
    coords.x = pageX
    coords.y = pageY
    mouse.value = coords
  }

  // 'ontouchstart' in window &&
  //   (() => {
  //     window.addEventListener('touchstart', ({ pageX, pageY }: any) => {
  //       pointerMove(pageX, pageY)
  //     })

  //     window.addEventListener('touchmove', ({ pageX, pageY }: any) => {
  //       pointerMove(pageX, pageY)
  //     })
  //   })()

  // !('ontouchstart' in window) &&
  //   (() => {
  //     window.addEventListener('click', ({ pageX, pageY }: any) => {
  //       pointerMove(pageX, pageY)
  //     })

  //     window.addEventListener('mousemove', ({ pageX, pageY }: any) => {
  //       pointerMove(pageX, pageY)
  //     })
  //   })()

  // window.addEventListener(
  //   'wheel',
  //   (e: any) => {
  //     if (keyboard.pressed.value.includes(18)) {
  //       e.preventDefault()
  //       wheelX.value = e.deltaX
  //     }
  //   },
  //   {
  //     passive: false
  //   }
  // )

  const set = () => {
    const w = window.innerWidth
    const h = window.innerHeight
    const d = window.devicePixelRatio
    width.value = w
    height.value = h
    dpr.value = d
    screen.value = w * h * d
    document.documentElement.style.setProperty('--viewport-width', `${w}px`)
    document.documentElement.style.setProperty('--viewport-height', `${h}px`)
    setBreakpoint()
  }

  window.addEventListener('resize', () => set())
  window.addEventListener('orientationchange', () => set())

  window.addEventListener('keydown', (e: any) => {
    if (e.key === 'Escape' || keyboard?.pressed?.value?.includes?.(18)) {
      e.stopImmediatePropagation()
      e.preventDefault()
    }

    if (Array.isArray(keyboard.pressed.value)) {
      keyboard.pressed.value = [...new Set([...keyboard.pressed.value, e.keyCode])]
    } else {
      keyboard.pressed.value = [e.keyCode]
    }
  })

  window.addEventListener('keyup', (e: any) => {
    if (Array.isArray(keyboard.pressed?.value)) {
      keyboard.pressed.value = keyboard.pressed.value.filter((v) => v !== e.keyCode)
    } else {
      keyboard.pressed.value = []
    }
  })

  return {
    width,
    height,
    dpr,
    screen,
    orientation,
    landscape,
    portrait,
    mouse,
    keyboard,
    mobile,
    tablet,
    wheelX,
    refreshRate,
    fullScreen,
    pointerMove,
    tv,
    mouseProgress,
    desktop
  }
})

if (import.meta.hot) import.meta.hot.accept(acceptHMRUpdate(useViewport, import.meta.hot))
