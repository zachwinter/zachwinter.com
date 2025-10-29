import { acceptHMRUpdate, defineStore } from 'pinia'
import { clone } from '../util/clone'
import { buildInterpolators } from './webgl/interpolate'
import { DEFAULT_SKETCH } from './webgl'
import { useAudioElement } from '../composables/useAudioElement'

export const useBackground = defineStore('background', () => {
  const raf = useRAF()
  const { context, element, enabled, playing, play, pause } = useAudioElement()
  element.value.src = '/killing.time.mp3'
  const navigation = useNavigation()
  const variant = ref(2)
  const scrollY = ref(0)
  const scrollX = ref(0)
  const stream = ref(1)
  const viewport = useViewport()
  const volume = ref(1)
  const shader = ref(DEFAULT_SKETCH.shader)
  const uniforms = ref(
    DEFAULT_SKETCH.uniforms.map((u: any) => {
      const uniform = clone(u)
      uniform[2] = uniform[2][variant.value]
      return uniform
    })
  )

  watch(
    () => navigation.index,
    (val) => {
      tweenToVariant(val)
    }
  )

  watch(scrollY, (val) => {
    if (viewport.mobile) return
    uniforms.value[1][2][0] = -val
  })

  watch(scrollX, (val) => {
    if (viewport.mobile) return
    uniforms.value[2][2][0] = val
  })

  function tweenToVariant(variantIndex: number, duration: number = 1500) {
    const from = uniforms.value.map((u: any) => [u[0], u[1], u[2]])
    const to = (DEFAULT_SKETCH as any).uniforms.map((u: any) => [u[0], u[1], u[2][variantIndex]])
    const interpolators = buildInterpolators(from, to)
    variant.value = variantIndex
    raf.remove('variant')
    raf.add(
      (_, progress) => {
        interpolators.map((v, i) => {
          if (uniforms.value[i][0] === 'scrollY' || uniforms.value[i][0] === 'scrollX') return
          const val = v(progress)
          uniforms.value[i][2] = val
        })
      },
      {
        id: 'variant',
        duration
      }
    )
  }

  function tick() {
    const { motion, bloom } = context.tick(raf.frameRate)
    stream.value += playing.value ? motion + 0.05 : 0.05
    volume.value = bloom
  }

  function setUniform(name: string, value: number) {
    const index = uniforms.value.findIndex((u: any) => u[0] === name)
    if (index !== -1 && uniforms.value[index][2]) {
      uniforms.value[index][2][0] = value
    }
  }

  return {
    shader,
    uniforms,
    variant,
    tweenToVariant,
    playing,
    tick,
    scroll,
    stream,
    volume,
    play,
    pause,
    scrollY,
    scrollX,
    setUniform
  }
})

if (import.meta.hot) import.meta.hot.accept(acceptHMRUpdate(useBackground, import.meta.hot))
