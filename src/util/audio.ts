const BASE_CONFIG = {
  bitDepth: Math.pow(2, 10),
  smoothingTimeConstant: 0
}

export function getVolume(analyser: AnalyserNode, buffers: any) {
  analyser.getByteFrequencyData(buffers.frequency)

  let i = 0
  let volume = 0
  let length = buffers.frequency.length / 2

  for (; i < length; i++) {
    buffers.delta[i] = Math.abs(buffers.frequency[i] - buffers.last[i])
    buffers.last[i] = buffers.frequency[i]
    volume += buffers.frequency[i]
  }

  return {
    delta: [...buffers.delta.slice(0, length)]
      .sort((a, b) => (a < b ? 1 : -1))
      .reduce((acc, value, i) => {
        acc += value
        return acc
      }, 0),
    volume
  }
}

export function analyzeAudioElement(args = {}) {
  try {
    const config: any = { ...BASE_CONFIG, ...args }
    const ctx: AudioContext = new AudioContext()

    let analyser: AnalyserNode
    let stream = null
    let buffers = {
      frequency: new Uint8Array(config.bitDepth / 2),
      last: new Uint8Array(config.bitDepth / 2),
      delta: new Float32Array(config.bitDepth / 2)
    }

    for (let i = 0; i < config.bitDepth / 2; i++) {
      buffers.frequency[i] = 0
      buffers.last[i] = 0
      buffers.delta[i] = 0
    }

    stream = ctx.createMediaElementSource(config.audio)
    analyser = ctx.createAnalyser()
    analyser.fftSize = config.bitDepth
    analyser.smoothingTimeConstant = config.smoothingTimeConstant
    stream.connect(analyser)
    analyser.connect(ctx.destination)

    return () => getVolume(analyser, buffers)
  } catch (e) {
    return () => ({ delta: 1, volume: 1 })
  }
}

export async function analyzeMicrophoneStream(args = {}) {
  const source = await navigator.mediaDevices.getUserMedia({ audio: true })
  const config = { ...BASE_CONFIG, ...args }
  const ctx = new AudioContext()

  let analyser: AnalyserNode
  let stream = null
  let buffers = {
    frequency: new Uint8Array(config.bitDepth / 2),
    last: new Uint8Array(config.bitDepth / 2),
    delta: new Float32Array(config.bitDepth / 2)
  }

  for (let i = 0; i < config.bitDepth / 2; i++) {
    buffers.frequency[i] = 0
    buffers.last[i] = 0
    buffers.delta[i] = 0
  }

  analyser = ctx.createAnalyser()
  analyser.fftSize = config.bitDepth
  stream = ctx.createMediaStreamSource(source)
  stream.connect(analyser)

  return () => getVolume(analyser, buffers)
}
