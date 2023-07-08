import { acceptHMRUpdate, defineStore } from 'pinia'
import { interpolateNumber } from 'd3-interpolate'
import { scaleLinear } from 'd3-scale'
import { clone } from '@/util/clone'
import { clamp } from '@/util/numbers'
import Analyser from '../classes/AudioAnalyser'
import { easing } from '@/constants/animation'


const DEFAULT_SONG = '/books.mp3'
const lightModeShader = /* glsl */ `

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

const darkModeShader = /* glsl */ `

void main () {
  float stream = stream / 4.;
  vec2 uv = -1. + 2. * gl_FragCoord.xy / resolution.xy;
  uv.x *= resolution.x/resolution.y;
  uv *= zoom;
  uv *= k_rotate2d(stream / -6.);
  for (float i = 5.; i < 30.; i++) {
    uv = uv * iterator;
    vec3 col = k_rainbow(i / iterations, colorShift, colorOffset);
    float a = radius * cos(uv.x / div + stream / 3.);
    float b = radius * sin(uv.y / div + stream / -2.);
    float c = wave * sin(split * uv.x / div - stream / 2.);
    float d = wave * cos(split * uv.y / div - stream / .5);
    float x = a * b - c + d;
    gl_FragColor += k_orb(uv, pow(volume, 1.6) * orbSize, vec2(x, x),  col, contrast);
  }
}

`

// export const DEFAULT_SHADER = /*glsl*/ `
// void main () {
//   vec2 uv = -1. + 2. * gl_FragCoord.xy / resolution.xy;
//   uv.x *= resolution.x/resolution.y;
//   uv *= zoom;
//   uv *= k_rotate2d(stream / -6.);
//   for (float i = 5.; i < 30.; i++) {
//     uv = uv * iterator;
//     vec3 col = k_rainbow(i / iterations, colorShift, colorOffset);
//     float a = radius * cos(uv.x / div + stream / 3.);
//     float b = radius * sin(uv.y / div + stream / -2.);
//     float c = wave * sin(split * uv.x / div - stream / 2.);
//     float d = wave * cos(split * uv.y / div - stream / 1.5);
//     float x = a * b - c + d;
//     gl_FragColor += k_orb(uv, pow(volume, 1.) * orbSize, vec2(x, x),  col, contrast);
//   }
// }`

export const rawUniforms: any[] = Object.freeze([
  [
    'zoom',
    0,
    [
      [3.418, 1, 13, 0.001],
      [12.26, 1, 13, 0.001],
      [4.452, 1, 13, 0.001]
    ]
  ],
  [
    'iterator',
    0,
    [
      [1.017, 0.7, 1.5, 0.001],
      [1.079, 0.7, 1.5, 0.001],
      [0.978, 0.7, 1.5, 0.001]
    ]
  ],
  [
    'iterations',
    0,
    [
      [15, 0, 33, 1],
      [15, 0, 33, 1],
      [13, 0, 33, 1]
    ]
  ],
  [
    'colorShift',
    0,
    [
      [0.266, 0, 1, 0.001],
      [0.271, 0, 1, 0.001],
      [0.352, 0, 1, 0.001]
    ]
  ],
  [
    'colorOffset',
    0,
    [
      [14.265, 15, 30, 0.001],
      [18.968, 15, 30, 0.001],
      [17.673, 15, 30, 0.001]
    ]
  ],
  [
    'contrast',
    0,
    [
      [1.031, 0, 3, 0.001],
      [0.942, 0, 3, 0.001],
      [1.146, 0, 3, 0.001]
    ]
  ],
  [
    'orbSize',
    0,
    [
      [10.426, 0, 37, 0.001],
      [5.174, 0, 37, 0.001],
      [26.704, 0, 37, 0.001]
    ]
  ],
  [
    'div',
    0,
    [
      [4.782, 0.01, 15, 0.001],
      [4.782, 0.01, 15, 0.001],
      [3.174, 0.01, 15, 0.001]
    ]
  ],
  [
    'radius',
    0,
    [
      [73.725, 0, 212, 0.001],
      [32.407, 0, 212, 0.001],
      [79.158, 0, 212, 0.001]
    ]
  ],
  [
    'wave',
    0,
    [
      [1222, 0, 1222, 0.001],
      [0, 0, 1333, 0.001],
      [865.131, 0, 2000, 0.001]
    ]
  ],
  [
    'split',
    0,
    [
      [3.288, 0, 40, 0.001],
      [0, 0, 40, 0.001],
      [20.958, 0, 500, 0.001]
    ]
  ]
])

export const DEFAULT_SKETCH: Sketch = {
  shader: lightModeShader,
  uniforms: rawUniforms,
  _id: '001'
}

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
  const ui = useUI()
  const scroll = ref(0)
  const variant = ref(0)
  const analyser: Ref<Analyser | undefined> = ref()
  const volume = ref(1)
  const stream = ref(1)
  const initialized = ref(false)
  const paused = ref(false)
  const shuffle = ref(true)
  const divisor = ref(150)
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

  const shader = computed(() => {
    return ui.darkMode ? darkModeShader : lightModeShader
  })

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
    audio.setAttribute('src', DEFAULT_SONG)
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
    analyser.value = new Analyser({ audio, refreshRate: viewport.refreshRate, pow: 1.5 })
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

  function tweenToVariant(variantIndex: number) {
    if (variantIndex >= rawUniforms?.[0]?.[2].length) return

    const from = uniforms.value.map((u) => [u[0], u[1], u[2]])
    const to = rawUniforms.map((u: any) => [u[0], u[1], u[2][variantIndex]])
    const interpolators = buildInterpolators(from, to)

    TIMERS.splice(
      TIMERS.indexOf((v: any) => v[3] === 'variant'),
      1
    )

    TIMERS.push([
      window.performance.now(),
      1500,
      (progress: number) => {
        interpolators.forEach((interpolator: any, i) => {
          uniforms.value[i][2] = interpolator(progress)
        })
      },
      'variant'
    ])
  }

  function tick(now: DOMHighResTimeStamp) {
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

  function setScroll(value: number) {
    scroll.value = value / viewport.height / 5
  }

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
