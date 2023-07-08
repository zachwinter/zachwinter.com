import { min, mean } from 'd3-array'
import { scaleLinear } from 'd3-scale'

interface AnalyserConfig {
  microphone: boolean
  audio: boolean | HTMLAudioElement
  streamConstant: number
  referenceSize: number
  sampleSize: number
  refreshRate: number
  pow?: number
}

interface AnalyserConfigOptions {
  microphone?: boolean
  audio?: false | HTMLAudioElement
  streamConstant?: number
  referenceSize?: number
  sampleSize?: number
  refreshRate?: number
  pow?: number
}

type AnalyserMode = 'AUDIO' | 'MICROPHONE'

interface AudioConfig {
  bitDepth: number;
  smoothingTimeConstant: number;
  pow: number;
}

const DEFAULT_CONFIG: AnalyserConfig = {
  microphone: false,
  audio: false,
  streamConstant: 0.01,
  referenceSize: 2,
  sampleSize: 0.09,
  refreshRate: 60
}

const DEFAULT_AUDIO_CONFIG: AudioConfig = {
  bitDepth: Math.pow(2, 10),
  smoothingTimeConstant: 0
}

const refreshRateScale: Function = scaleLinear([60, 120], [1, 2])

export default class Analyser {
  private config: AnalyserConfig
  private referenceBuffer: Float32Array
  private sampleBuffer: Float32Array
  private referenceIndex: number
  private sampleIndex: number
  private audioContext: AudioContext | undefined
  private audioBuffer: Uint8Array | undefined
  private audioAnalyser: AnalyserNode | undefined
  private _tick: number
  public stream: number
  public volume: number

  constructor(config: AnalyserConfigOptions) {
    this.config = {
      ...DEFAULT_CONFIG,
      ...config
    }

    this.referenceBuffer = new Float32Array(this.referenceBufferLength)
    this.sampleBuffer = new Float32Array(this.sampleSizeBufferLength)
    this.referenceIndex = 0
    this.sampleIndex = 0
    this._tick = window.performance.now()
    this.stream = 1
    this.volume = 1

    this.init()

    switch (this.mode) {
      case 'AUDIO':
        this.initAudio()
        break
      case 'MICROPHONE':
        this.initMicrophone()
        break
    }
  }

  get mode(): AnalyserMode {
    if (this.config.audio) return 'AUDIO'
    if (this.config.microphone) return 'MICROPHONE'

    throw new Error('Invalid configuration; no analysis mode selected.')
  }

  reinitialize(config: AnalyserConfigOptions) {
    this.config = {
      ...DEFAULT_CONFIG,
      ...config
    }

    this.referenceBuffer = new Float32Array(this.referenceBufferLength)
    this.sampleBuffer = new Float32Array(this.sampleSizeBufferLength)
    this.referenceIndex = 0
    this.sampleIndex = 0
    this._tick = window.performance.now()
    this.stream = 0
    this.volume = 1

    this.init()

    switch (this.mode) {
      case 'AUDIO':
        this.initAudio()
        break
      case 'MICROPHONE':
        this.initMicrophone()
        break
    }
  }

  get referenceBufferLength(): number {
    const scale = refreshRateScale(this.config.refreshRate)
    return Math.ceil(scale * this.config.referenceSize * 60)
  }

  get sampleSizeBufferLength(): number {
    const scale = refreshRateScale(this.config.refreshRate)
    return Math.ceil(scale * this.config.sampleSize * 60)
  }

  get referenceBufferDomain(): [number, number] {
    return [min(this.referenceBuffer) || 0, mean(this.referenceBuffer) || 1]
  }

  get rawVolume(): number {
    if (!this.audioBuffer) return 0
    let volume = 0
    let i = 0
    const len: number = DEFAULT_AUDIO_CONFIG.bitDepth / 2 || 0
    for (; i < len; i++) volume += this.audioBuffer[i]
    return volume
  }

  init(): void {
    const size = DEFAULT_AUDIO_CONFIG.bitDepth / 2

    this.audioContext?.close?.()
    this.audioContext = new AudioContext()
    this.audioAnalyser = this.audioContext.createAnalyser()
    this.audioAnalyser.fftSize = DEFAULT_AUDIO_CONFIG.bitDepth
    this.audioAnalyser.smoothingTimeConstant = DEFAULT_AUDIO_CONFIG.smoothingTimeConstant
    this.audioBuffer = new Uint8Array(size)

    for (let i = 0; i < size; i++) this.audioBuffer[i] = 1
  }

  initAudio(): void {
    if (typeof this.config.audio === 'boolean' || !this.audioContext || !this.audioAnalyser)
      throw new Error('Initialization error.')
    const stream = this.audioContext.createMediaElementSource(this.config.audio)
    stream.connect(this.audioAnalyser)
    this.audioAnalyser.connect(this.audioContext.destination)
  }

  async initMicrophone(): Promise<void> {
    if (!this.audioContext || !this.audioAnalyser) throw new Error('Initialization error.')

    try {
      const source = await navigator.mediaDevices.getUserMedia({ audio: true })
      const stream = this.audioContext.createMediaStreamSource(source)
      stream.connect(this.audioAnalyser)
    } catch (e) {
      console.log(e)

      throw new Error('Microphone initialization error.')
    }
  }

  setRefreshRate(now: DOMHighResTimeStamp): void {
    if (this._tick === 0) {
      this._tick = now
    } else {
      this.config.refreshRate = 1000 / (now - this._tick)
      this._tick = now
    }
  }

  updateIndices(): void {
    this.referenceIndex++
    this.sampleIndex++

    if (this.referenceIndex === this.referenceBufferLength) this.referenceIndex = 0
    if (this.sampleIndex === this.sampleSizeBufferLength) this.sampleIndex = 0
  }

  tick(now: DOMHighResTimeStamp): [number, number] {
    if (!this.audioAnalyser || !this.audioBuffer)
      throw new Error('Analyser has not been initialized.')

    this.audioAnalyser.getByteFrequencyData(this.audioBuffer)

    const volume: number = this.rawVolume

    this.referenceBuffer[this.referenceIndex] = volume
    this.sampleBuffer[this.sampleIndex] = volume
    this.updateIndices()

    const sample: number = mean(this.sampleBuffer) || 1

    this.volume = scaleLinear(this.referenceBufferDomain, [0, 1])(sample) || 1
    this.stream += Math.pow(this.volume / 10 + this.config.streamConstant, this.config.pow)

    return [this.volume, this.stream]
  }
}
