import { shallowRef } from 'vue'
import { scaleLinear } from 'd3-scale'

export type AudioStream = [number, number]
export type AudioStreamDefinitions = AudioStream[]
export type VolumeStreamConfig = {
  bitDepth?: number
  def: [number, number]
}

export function useStream(getRaw: () => number, config?: VolumeStreamConfig) {
  const def = config?.def || [2.5, 0.1]
  const volumeBuffer = shallowRef<number[]>([])

  function sampleVolume(totalSamples: number) {
    let value = 0
    const start = Math.max(volumeBuffer.value.length - 1, 0)
    const end = Math.max(start - totalSamples, 0)
    let min = Infinity
    for (let i = start; i >= end; i--) {
      value += volumeBuffer.value[i]
      if (volumeBuffer.value[i] < min) min = volumeBuffer.value[i]
    }
    return [value / totalSamples, min]
  }

  function tick(frameRate: number) {
    const raw = getRaw()
    volumeBuffer.value.push(raw)
    const [ref, min] = sampleVolume((def[0] * 1000) / (1000 / frameRate))
    const [sample] = sampleVolume((def[1] * 1000) / (1000 / frameRate))
    const scaled = scaleLinear([min, ref], [0, 1])(sample)
    const fixed = Number(Math.pow(scaled, 1).toFixed(3))
    return isNaN(fixed) ? 1 : fixed / 2
  }

  return {
    tick
  }
}
