import { Animation, GlobalAnimation } from '../types/animations'
import { acceptHMRUpdate, defineStore } from 'pinia'
import { ComputedRef, computed, ref, type Ref, watch } from 'vue'
import * as ease from 'd3-ease'
import { clamp } from '../util/numbers'

const DEFAULT_EASING = 'easeQuadOut'

export const useRAF = defineStore('raf', () => {
  const queue: Ref<Animation[]> = ref([])
  const map: Ref<Record<string, GlobalAnimation>> = ref({})
  const mapKeys: ComputedRef<string[]> = computed(() => Object.keys(map.value))
  const raf: Ref<number> = ref(0)
  const last: Ref<number> = ref(window.performance.now())
  const frames: Ref<number[]> = ref([])
  const totalFrames: ComputedRef<number> = computed(() => frames.value.length)
  const frameRate: ComputedRef<number> = computed(() => {
    const len = totalFrames.value
    let sum = 0
    for (let i = 0; i < len; i++) sum += frames.value[i]
    return sum / len
  })

  watch(
    () => raf.value,
    () => {
      const now = window.performance.now()
      frames.value.push(1000 / (now - last.value))
      last.value = now
    }
  )

  watch(
    () => totalFrames.value,
    (val) => {
      const boundary = 100
      if (val < boundary) return
      const diff = val - boundary
      for (let i = 0; i < diff; i++) frames.value.shift()
    }
  )

  function add(animation: Animation | GlobalAnimation, id: string | null = null) {
    const spread: Animation | GlobalAnimation = {
      easing: DEFAULT_EASING,
      start: window.performance.now(),
      ...animation
    }

    if (typeof id === 'string') {
      map.value[id] = spread
      return
    }

    queue.value.push(spread)
  }

  function remove(id: string) {
    delete map.value[id]
  }

  function start() {
    raf.value = window.requestAnimationFrame(tick)
  }

  function stop() {
    cancelAnimationFrame(raf.value)
  }

  function tick(now: DOMHighResTimeStamp) {
    raf.value = window.requestAnimationFrame(tick)

    queue.value.forEach((animation: Animation, i: number) => {
      const elapsed = now - (animation?.start || 0)
      const progress = clamp(elapsed / (animation.duration || 1))
      const eased = ease[(animation.easing || DEFAULT_EASING) as keyof typeof ease]?.(progress)
      animation.tick?.({ now, progress: eased })
      if (progress === 1) queue.value.splice(i, 1)
    })

    mapKeys.value.forEach((key: string) => {
      const animation = map.value[key]

      let progress = 0

      if (animation.duration) {
        const elapsed = now - (animation?.start || 0)
        progress = clamp(elapsed / (animation.duration || 1))
      }

      const eased = ease[(animation.easing || DEFAULT_EASING) as keyof typeof ease]?.(progress)

      animation.tick?.({ now, progress: eased })

      if (progress === 1) delete map.value[key]
    })
  }

  return {
    queue,
    map,
    mapKeys,
    add,
    remove,
    start,
    stop,
    frameRate
  }
})

if (import.meta.hot) import.meta.hot.accept(acceptHMRUpdate(useRAF, import.meta.hot))
