import { defineStore } from 'pinia'
import { ref, shallowRef, type Ref } from 'vue'
import { clamp } from '../util/numbers'
import { ease } from '../util/easing'

export type AnimationTick = (now: number, progress: number, elapsed: number) => void

export type Animation = {
  tick?: AnimationTick
  duration?: number
  id: string
  start?: number
  autoStart?: boolean
  easing?: (v: number) => number
  state?: Ref<boolean>
}

export const useRAF = defineStore('raf', () => {
  const queue: any = shallowRef([])
  const map: any = shallowRef({})
  const raf: any = ref(0)
  let last: any = null
  const frameNumber = ref(0)
  let frames: any[] = []
  const time: Ref<number> = ref(window.performance.now())
  const now = ref(Date.now())
  const frameRate: any = ref(60)
  const promises: any = {}
  const preFrame: any = ref([])
  const stream = ref(0)

  function add(tick: AnimationTick, animation: Animation) {
    remove(animation?.id)

    animation.tick = tick
    animation.easing = animation.easing || ease
    animation.start = window.performance.now()

    if (raf.value === 0) {
      start()
    }

    if (animation.duration) {
      queue.value.push(animation)
      // console.log("📋 Added to queue, queue length:", queue.value.length);
      return new Promise((resolve) => {
        promises[animation.id as string] = resolve
      })
    } else {
      map.value[animation.id] = animation
    }
  }

  function remove(id: string) {
    delete map.value[id]
    delete promises[id]
    const queueIndex = queue.value.findIndex((animation: Animation) => animation.id === id)
    if (queueIndex !== -1) queue.value.splice(queueIndex, 1)
  }

  function start() {
    stop()
    raf.value = window.requestAnimationFrame(tick)
  }

  function stop() {
    window.cancelAnimationFrame(raf.value)
  }

  function frame(now: DOMHighResTimeStamp) {
    if (last === null) {
      last = now
      return
    }

    const boundary = 180
    frames.push(1000 / (now - last))
    if (frames.length > boundary) frames.splice(0, frames.length - boundary)
    let sum = 0
    for (let i = 0; i < frames.length; i++) sum += frames[i]
    frameRate.value = Math.floor(sum / frames.length)
    last = now
  }

  function tick(_now: DOMHighResTimeStamp) {
    frameNumber.value++
    time.value = _now
    now.value = _now

    preFrame.value.forEach((fn: (now: DOMHighResTimeStamp) => void) => {
      fn(_now)
    })

    queue.value = queue.value.filter((animation: Animation) => {
      const elapsed = now.value - (animation?.start || 0)
      const duration = animation.duration || Infinity
      const progress = animation.easing?.(elapsed / duration) as number
      animation.tick?.(now.value, progress, elapsed)
      if (progress === 1) {
        promises?.[animation.id]?.()
        delete promises[animation.id]
        return false
      }
      return true
    })

    const keys = Object.keys(map.value)

    keys.forEach((id: string) => {
      const animation = map.value[id]
      const elapsed = now.value - (animation?.start || 0)
      const duration = animation.duration || Infinity
      const progress = clamp(animation.easing?.(elapsed / duration) as number)
      animation.tick?.(now.value, progress, elapsed)

      if (progress === 1) {
        promises?.[animation.id]?.()
        delete map.value[id]
        delete promises[id]
      }
    })

    frame(_now)

    if (queue.value.length > 0 || keys.length > 0) {
      raf.value = window.requestAnimationFrame(tick)
    } else {
      raf.value = 0
    }

    preFrame.value = []
  }

  function updateStream(delta: number) {
    stream.value += delta
  }

  return {
    add,
    remove,
    start,
    stop,
    time,
    now,
    map,
    queue,
    frameRate,
    preFrame,
    frameNumber,
    stream,
    updateStream,
    $reset() {
      stop()
      queue.value.length = 0
      Object.keys(map.value).forEach((id) => delete map.value[id])
      Object.keys(promises).forEach((id) => delete promises[id])
      frames = []
      last = null
      raf.value = 0
      stream.value = 0
    }
  }
})
