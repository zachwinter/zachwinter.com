import { acceptHMRUpdate, defineStore } from 'pinia'
import { interpolateNumber } from 'd3-interpolate'
import { scaleLinear } from 'd3-scale'
import { clone } from '@/util/clone'
import { clamp } from '@/util/numbers'
import Analyser from '../classes/AudioAnalyser'
import { easing } from '@/constants/animation'

const rawShader = /* glsl */ `

void main() { 
  vec2 uv = -1. + 2. * gl_FragCoord.xy / resolution.xy;
  uv.x *= resolution.x/resolution.y;
  uv *= zoom;
  uv.y += -20. * scroll;
  float stream = stream / 1.6;
  float dist = length(uv + sin(uv)); 
  float rot = rotation * abs(dist / -.2);
  uv *= k_rotate2d(rotation + rot + stream / 9.); 
  float t = PI * (5. + 1.);
  float a = cos(uv.y - stream/1.5);
  float b = cos(uv.x * sin(uv.y / 1. + stream/.2)); 
  float c = radius * sin(t) * 20. * b;
  vec2 p = vec2(xOuter * a * uv.x + c, 0.);
  vec3 col = k_rainbow(1., 0., 0.);
  gl_FragColor += k_orb(uv, pow(volume, 1.) * ballSize, p, col, contrast);
  gl_FragColor.xyz = pow(abs(1.-(gl_FragColor.xyz)), vec3(contrast));
  gl_FragColor = k_hue(gl_FragColor,uv.x/5.);
  gl_FragColor /= 3.;
} 

`

const rawUniforms: any = [
  [
    'zoom',
    0,
    [
      [8.304, 0, 21.456, 0.001],
      [1.5, 0, 21.456, 0.001],
      [4.969, 0, 21.456, 0.001],
      [19.275, 0, 21.456, 0.001]
    ],
    false
  ],
  [
    'ballSize',
    0,
    [
      [2.304, 0, 5.808, 0.001],
      [0.861, 0, 5.808, 0.001],
      [1.511, 0, 5.808, 0.001],
      [1.489, 0, 1, 0.001]
    ],
    false
  ],
  [
    'contrast',
    0,
    [
      [1.113, 0, 2.5600000000000014, 0.001],
      [0.999, 0, 2.5600000000000014, 0.001],
      [0.961, 0, 2.5600000000000014, 0.001],
      [1.133, 0, 2.5600000000000014, 0.001]
    ],
    false
  ],
  [
    'radius',
    0,
    [
      [0.234, 0, 1, 0.001],
      [0.789, 0, 1, 0.001],
      [0.789, 0, 1, 0.001],
      [0.789, 0, 1, 0.001]
    ],
    false
  ],
  [
    'yOuter',
    0,
    [
      [0.216, 0, 2.32, 0.001],
      [2.32, 0, 2.32, 0.001],
      [0.258, 0, 11, 0.001],
      [0.32, 0, 2.32, 0.001]
    ],
    false
  ],
  [
    'xOuter',
    0,
    [
      [12.54, 0, 20.4, 0.001],
      [20.4, 0, 20.4, 0.001],
      [60.148, 0, 120.4, 0.001],
      [20.4, 0, 20.4, 0.001]
    ],
    false
  ],
  [
    'rotation',
    0,
    [
      [0.02, 0, 0.1, 0.001],
      [-0.01, 0, 0.1, 0.001],
      [0.07, 0.1, 0.1, 0.001],
      [0, 0, 0.1, 0.001]
    ],
    false
  ]
]

function buildInterpolators(from: any, to: any) {
  const iN = interpolateNumber

  return from.map((u: any, i: number) => {
    switch (u[1]) {
      case 0:
        const iVal = iN(u[2][0], to[i][2][0])
        const iMin = iN(u[2][1], to[i][2][1])
        const iMax = iN(u[2][2], to[i][2][2])
        const iStep = iN(u[2][3], to[i][2][3])
        return (t: number) => [iVal(t), iMin(t), iMax(t), iStep(t)]
      case 1:
        return () => to[i][2]
      case 3:
        const iR = iN(u[2][0], to[i][2][0])
        const iG = iN(u[2][1], to[i][2][1])
        const iB = iN(u[2][2], to[i][2][2])
        return (t: number) => [iR(t), iG(t), iB(t)]
    }
  })
}

const refreshRateScale = scaleLinear([120, 60], [1, 2])

let TIMERS: any = []

export const useBackground = defineStore('background', () => {
  const viewport = useViewport()
  const navigation = useNavigation()
  const scroll = ref(0)
  const variant = ref(0)
  const analyser: Ref<Analyser | undefined> = ref()
  const volume = ref(1)
  const stream = ref(1)
  const initialized = ref(false)
  const paused = ref(false)
  const variantInterval = ref()
  const shuffle = ref(true)
  const divisor = ref(75)
  const shader = ref(rawShader)
  const duration = ref(0)
  const position = ref(0)
  const audio: HTMLAudioElement = createAudioElement()
  const playing = ref(false)
  const raf = ref()
  const uniforms = ref(
    rawUniforms.map((u: any) => {
      const uniform = clone(u)
      uniform[2] = uniform[2][variant.value]
      return uniform
    })
  )

  const progress = computed(() => {
    return position.value / duration.value
  })

  watch(
    () => navigation.index,
    (val) => {
      tweenToVariant(val)
    }
  )

  function createAudioElement(): HTMLAudioElement {
    const audio = document.createElement('audio')
    audio.setAttribute('src', '/toe.mp3')
    audio.setAttribute('crossorigin', 'true')

    function loaded() {
      duration.value = audio.duration
      audio.removeEventListener('loadedmetadata', loaded)
    }

    audio.addEventListener('loadedmetadata', loaded)

    return audio
  }

  function init() {
    if (initialized.value) return play()
    analyser.value = new Analyser({ audio, refreshRate: viewport.refreshRate })
    play()
    cancelAnimationFrame(raf.value)
    raf.value = requestAnimationFrame(tick)
    initialized.value = true
  }

  function pause() {
    audio.pause()
    playing.value = false

    const iV = interpolateNumber(volume.value, 1)
    const iD = interpolateNumber(10, 75)

    TIMERS.push([
      window.performance.now(),
      1000,
      (progress: number) => {
        volume.value = iV(progress)
        divisor.value = iD(progress)
      }
    ])
  }

  function play() {
    audio.play()
    playing.value = true

    const iD = interpolateNumber(75, 10)

    TIMERS.push([
      window.performance.now(),
      1000,
      (progress: number) => {
        divisor.value = iD(progress)
      }
    ])
  }

  function shuffleVariants() {
    let i = 0
    const len = rawUniforms[0][2].length - 1

    variantInterval.value = setInterval(() => {
      if (i === len) {
        i = 0
      } else {
        i++
      }

      tweenToVariant(i)
    }, 5000)
  }

  function tweenToVariant(variantIndex: number) {
    const from = uniforms.value.map((u) => [u[0], u[1], u[2]])
    const to = rawUniforms.map((u: any) => [u[0], u[1], u[2][variantIndex]])
    const interpolators = buildInterpolators(from, to)

    TIMERS.splice(
      TIMERS.indexOf((v: any) => v[3] === 'variant'),
      1
    )

    TIMERS.push([
      window.performance.now(),
      4000,
      (progress: number) => {
        interpolators.forEach((interpolator: any, i) => {
          uniforms.value[i][2] = interpolator(progress)
        })
      },
      'variant'
    ])
  }

  function tick(now: DOMHighResTimeStamp) {
    raf.value = requestAnimationFrame(tick)
    position.value = audio.currentTime

    if (paused.value) return

    const [vol] = (playing.value && analyser.value?.tick?.(now)) || [volume.value]

    volume.value = vol
    stream.value += (vol / divisor.value) * refreshRateScale(viewport.refreshRate)

    TIMERS.forEach((timer: any, i: number) => {
      const progress = easing(clamp((now - timer[0]) / timer[1]))

      timer[2](progress)

      if (progress === 1) TIMERS.splice(i, 1)
    })
  }

  function setScroll(value:number) {
    scroll.value = value / viewport.height / 5
  }

  shuffleVariants()

  return {
    shader,
    uniforms,
    variant,
    tweenToVariant,
    init,
    play,
    pause,
    playing,
    shuffle,
    stream,
    initialized,
    volume,
    tick,
    position,
    duration,
    progress,
    paused,
    setScroll,
    scroll
  }
})

if (import.meta.hot) import.meta.hot.accept(acceptHMRUpdate(useBackground, import.meta.hot))
