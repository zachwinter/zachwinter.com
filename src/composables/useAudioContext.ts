import { ref, shallowRef } from 'vue'
import Meyda, { type MeydaAudioFeature } from 'meyda'
import { useStream } from './useStream'

function euclideanDistance(a: number[], b: number[]): number {
  if (!a || !b || a.length !== b.length) return 0
  return Math.sqrt(a.reduce((sum, val, i) => sum + Math.pow(val - b[i], 2), 0))
}

function calculateDeltaTone(c: any, p: any): number {
  if (!p) return 0
  const { abs } = Math
  const chromaDelta = euclideanDistance(c.chroma, p.chroma) / Math.sqrt(12)
  const centroidDelta = abs(c.spectralCentroid - p.spectralCentroid) / 256
  const kurtosisDelta = abs(c.spectralKurtosis - p.spectralKurtosis)
  return chromaDelta + centroidDelta + kurtosisDelta
}

function calculateDeltaTexture(c: any, p: any): number {
  if (!p) return 0
  const { abs } = Math
  const spreadDelta = abs(c.spectralSpread - c.spectralSpread) / 256
  const flatnessDelta = abs(c.spectralFlatness - c.spectralFlatness)
  const sharpnessDelta = abs(c.perceptualSharpness - p.perceptualSharpness)
  const centroidDelta = abs(c.spectralCentroid - p.spectralCentroid) / 256
  return spreadDelta + flatnessDelta + sharpnessDelta + centroidDelta
}

export type AudioStream = [number, number]
export type AudioStreamDefinitions = AudioStream[]

const BIT_DEPTH = Math.pow(2, 10)
const FILTER_TYPE = 'lowpass'
const FILTER_FREQUENCY = 7500
const FILTER_Q = 0.75
const BASE_FEATURES: MeydaAudioFeature[] = [
  'rms',
  'chroma',
  'energy',
  'spectralCentroid',
  'spectralKurtosis',
  'spectralSpread',
  'spectralFlatness',
  'perceptualSharpness'
]

const BASE_REF = 3
const BASE_SAMPLE = 0.1

export function useAudioContext() {
  const primed = ref(false)
  const ctx = shallowRef<AudioContext>()
  const filter = shallowRef()
  const analyser = shallowRef()
  const timeBuffer = shallowRef(new Float32Array(BIT_DEPTH))
  const currentFeatures = ref<any>({})
  const previousFeatures = ref<any>(null)
  const previousBuffer = ref<Float32Array | null>(null)
  const deltaTone = ref(0)
  const deltaTexture = ref(0)
  const motionSalience = ref(0)
  const bloomSalience = ref(0)
  const baseEnergy = ref(0)
  const changeIntensity = ref(0)

  const motionStream = useStream(() => motionSalience.value, {
    def: [BASE_REF, BASE_SAMPLE]
  })
  const toneStream = useStream(() => deltaTone.value, {
    def: [BASE_REF * 1, BASE_SAMPLE * 3]
  })
  const textureStream = useStream(() => deltaTexture.value, {
    def: [BASE_REF * 1, BASE_SAMPLE * 3]
  })
  const energyStreamA = useStream(() => baseEnergy.value, {
    def: [BASE_REF, BASE_SAMPLE * 1.5]
  })
  const energyStreamB = useStream(() => baseEnergy.value, {
    def: [BASE_REF, BASE_SAMPLE * 1.4]
  })
  const energyStreamC = useStream(() => baseEnergy.value, {
    def: [BASE_REF, BASE_SAMPLE * 1.25]
  })

  const energyStreamD = useStream(() => baseEnergy.value, {
    def: [BASE_REF, BASE_SAMPLE * 1]
  })

  function tick(frameRate: number) {
    analyser.value?.getFloatTimeDomainData?.(timeBuffer.value)
    const features = Meyda.extract(BASE_FEATURES, timeBuffer.value) as any
    currentFeatures.value = features
    deltaTone.value = calculateDeltaTone(features, previousFeatures.value)
    deltaTexture.value = calculateDeltaTexture(features, previousFeatures.value)

    baseEnergy.value = (features.rms || 0) * (features.energy || 0)
    changeIntensity.value = Math.pow(deltaTone.value + deltaTexture.value, 0.5)
    motionSalience.value = Math.pow(baseEnergy.value * changeIntensity.value, 0.25)
    bloomSalience.value = Math.pow(baseEnergy.value, 1)
    previousFeatures.value = { ...features }
    previousBuffer.value = new Float32Array(timeBuffer.value)

    const motion = motionStream.tick(frameRate)
    const energy = Math.pow(
      (energyStreamD.tick(frameRate) +
        (energyStreamA.tick(frameRate) +
          energyStreamB.tick(frameRate) +
          energyStreamC.tick(frameRate))) /
        3,
      1
    )
    const tone = toneStream.tick(frameRate)
    const texture = textureStream.tick(frameRate)

    return {
      motion: motion / 5,
      bloom: Math.pow(energy * Math.pow(tone + texture, 1), 0.5)
    }
  }

  function initialize() {
    ctx.value?.close()
    analyser.value?.disconnect()
    filter.value?.disconnect()
    ctx.value = new AudioContext()
    analyser.value = ctx.value.createAnalyser()
    filter.value = ctx.value.createBiquadFilter()
    analyser.value.smoothingTimeConstant = 0
    analyser.value.fftSize = BIT_DEPTH
    filter.value.type = FILTER_TYPE
    filter.value.frequency.value = FILTER_FREQUENCY
    filter.value.Q.value = FILTER_Q
    primed.value = true
  }

  document.body.addEventListener('click', initialize, { once: true })

  return {
    ctx,
    filter,
    analyser,
    initialize,
    primed,
    tick,
    getRMS: () => currentFeatures.value.rms || 0,
    getMotionSalience: () => motionSalience.value,
    getBloomSalience: () => bloomSalience.value,
    getDeltaTone: () => deltaTone.value,
    getDeltaTexture: () => deltaTexture.value,
    features: currentFeatures,
    deltaTone,
    deltaTexture,
    motionSalience,
    bloomSalience
  }
}
