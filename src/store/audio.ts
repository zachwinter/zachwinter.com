import { acceptHMRUpdate, defineStore } from 'pinia'
import { ShallowRef } from 'vue'
import { scaleLinear } from 'd3-scale'

const SILENCE = `/mp3/meditation.mp3`
const BIT_DEPTH = Math.pow(2, 10)
const VARIANTS: any = { andy: 0, max: 1, kat: 2 }

export const useAudio = defineStore('audio', () => {
  const raf = useRAF()
  const initialized = ref(false)
  const playing = ref(false)
  const element: ShallowRef<HTMLAudioElement | null> = shallowRef(null)
  const context: ShallowRef<AudioContext | null> = shallowRef(null)
  const analyser: ShallowRef<AnalyserNode | null> = shallowRef(null)
  const hipass: ShallowRef<BiquadFilterNode | null> = shallowRef(null)
  const buffer: ShallowRef<Uint8Array | null> = shallowRef(null)
  const source: ShallowRef<MediaElementAudioSourceNode | MediaStreamAudioSourceNode | null> =
    shallowRef(null)
  const audioBuffer: ShallowRef<AudioBuffer | null> = shallowRef(null)
  const bufferSource: ShallowRef<AudioBufferSourceNode | null> = shallowRef(null)
  const volume = ref(1)
  const stream = ref(1)
  const started = ref(0)
  const mode: Ref<'BLOB' | 'MEDIA' | 'MICROPHONE'> = ref('BLOB')
  const media: Ref<'MUSIC' | 'PODCAST'> = ref('PODCAST')
  const volumeBuffer: number[] = []
  const volumeBufferSize = ref(5 * 480)
  const streamDefinitions: Ref<any> = ref({
    volume: [
      [
        [4, 0.2, 1],
        [3, 0.15, 1]
      ],
      5
    ],
    stream: [
      [
        [2, 0.1, 2],
        [1, 0.1, 2]
      ],
      3
    ]
  })
  const activeEvent = ref(-1)
  const speakerVariant: Ref<number> = ref(-1)
  const podcastEvents = ref([])
  const podcastSpeakers = ref([])
  const podcastVariants = ref<any>({})

  watch(
    () => playing.value,
    (val) => {
      if (val) {
        raf.add({ tick }, 'audio')
      } else {
        raf.remove('audio')
      }
    }
  )

  async function initialize(srcOrBlob?: string | Blob) {
    if (initialized.value) return

    initializeAudioContext()

    if (mode.value === 'MEDIA') {
      initializeAudioElement(srcOrBlob as string)
      createMediaElementSource()
    }

    if (mode.value === 'BLOB') {
      await loadAudioBuffer(srcOrBlob as Blob)
    }

    if (mode.value === 'MICROPHONE') {
      await initializeMicrophone()
    }

    initialized.value = true
  }

  async function loadAudioBuffer(blob: Blob) {
    const arrayBuffer = await blob.arrayBuffer()
    const buffer = await context.value?.decodeAudioData(arrayBuffer)
    if (buffer) audioBuffer.value = buffer
  }

  function createBufferSource() {
    if (context.value && audioBuffer.value && analyser.value) {
      bufferSource.value = context.value.createBufferSource()
      bufferSource.value.buffer = audioBuffer.value
      bufferSource.value.connect(hipass.value!)
      hipass.value?.connect(analyser.value)
      bufferSource.value.connect(context.value.destination)
    }
  }

  function createMediaElementSource() {
    if (!context.value || !element.value || !analyser.value || !hipass.value) return
    source.value = context.value.createMediaElementSource(element.value)
    source.value.connect(hipass.value)
    hipass.value.connect(analyser.value)
    source.value.connect(context.value.destination)
  }

  function initializeAudioElement(src = SILENCE) {
    element.value = document.createElement('audio')
    element.value.crossOrigin = 'anonymous'
    element.value.autoplay = true
    element.value.src = src

    element.value.addEventListener('play', () => {
      console.log('onplay')
      playing.value = true
    })

    element.value.addEventListener('pause', () => {
      console.log('onpause')
      playing.value = false
    })

    element.value.addEventListener('ended', () => {
      console.log('onended')
      playing.value = false
    })

    element.value.addEventListener('error', (e) => {
      console.log('onerror')
      console.log((e.target as HTMLAudioElement).error)
      playing.value = false
    })

    element.value.addEventListener('abort', (e) => {
      console.log('onabort')
      console.log((e.target as HTMLAudioElement).error)
    })

    element.value.addEventListener('canplay', (e) => {
      console.log('oncanplay')
    })

    element.value.addEventListener('canplaythrough', (e) => {
      console.log('oncanplaythrough')
    })

    element.value.addEventListener('loadeddata', (e) => {
      console.log('onloadeddata')
    })

    element.value.addEventListener('loadedmetadata', (e) => {
      console.log('onloadedmetadata')
    })

    element.value.addEventListener('loadstart', (e) => {
      console.log('onloadstart')
    })

    element.value.addEventListener('stalled', (e) => {
      console.log('onloadstart')
      console.log((e.target as HTMLAudioElement).error)
    })
  }

  async function initializeMicrophone() {
    if (!context.value || !analyser.value || !hipass.value) return

    source.value = context.value.createMediaStreamSource(
      await navigator.mediaDevices.getUserMedia({ audio: true, video: false })
    )

    source.value.connect(hipass.value)
    hipass.value.connect(analyser.value)
    playing.value = true
  }

  function initializeAudioContext() {
    context.value = new AudioContext()

    if (!context.value) {
      console.error('Error instantiating audio context.')
      return
    }

    analyser.value = context.value.createAnalyser()
    analyser.value.smoothingTimeConstant = 0
    analyser.value.fftSize = BIT_DEPTH

    hipass.value = context.value.createBiquadFilter()

    if (!hipass.value) return

    hipass.value.type = 'lowpass'
    hipass.value.frequency.value = 9000
    hipass.value.Q.value = 0.6

    buffer.value = new Uint8Array(BIT_DEPTH / 2)

    for (let i = 0; i < BIT_DEPTH / 2; i++) buffer.value[i] = 1

    initialized.value = true
  }

  function sampleVolume(totalSamples: number): [number, number] {
    let value = 0
    const start = Math.max(volumeBuffer.length - 1, 0)
    const end = Math.max(start - totalSamples, 0)

    let min = Infinity

    for (let i = start; i > end; i--) {
      value += volumeBuffer[i]

      if (volumeBuffer[i] < min) min = volumeBuffer[i]
    }

    return [value / totalSamples, min]
  }

  function updateStream(method: '*' | '+', streams: [number, number, number][]) {
    const fps = raf.frameRate || 60

    return streams.reduce(
      (acc: number, stream: any) => {
        const [ref, min] = sampleVolume(stream[0] * fps)
        const [sample] = sampleVolume(stream[1] * fps)
        const tick = Math.pow(scaleLinear([min, ref], [0, 1])(sample), stream[2])
        if (method === '*') {
          return acc * tick
        } else {
          return acc + tick / 10
        }
      },
      method === '*' ? 1 : 0
    )
  }

  function updateStreams() {
    if (!streamDefinitions.value || !raf.frameRate) return

    const defs = streamDefinitions.value
    const vol = updateStream('*', defs.volume[0])
    const str = updateStream('+', defs.stream[0])
    const mul = 60 / (raf.frameRate || 60)
    const volDiv = defs.volume[1] * mul
    const strDiv = defs.stream[1] * mul
    const base = 0.075 * mul

    volume.value = vol / volDiv
    stream.value += (str / strDiv + base) * mul
  }

  async function playBlob(blob: Blob) {
    if (!initialized.value) {
      await initialize(blob)
    } else {
      await loadAudioBuffer(blob)
    }

    if (bufferSource.value) {
      bufferSource.value.stop()
    }

    createBufferSource()

    if (bufferSource.value) {
      started.value = window.performance.now()
      bufferSource.value.start()
      playing.value = true
    }
  }

  function playSrc(track: string) {
    if (!initialized.value) initialize(track)
    else if (element.value) {
      ;(element.value as any).src = track
    }

    return
  }

  async function play(track: Blob | string) {
    if (mode.value === 'MEDIA' && typeof track === 'string') {
      playSrc(track)
      return
    }

    playBlob(track as Blob)
  }

  function pause() {
    if (mode.value === 'MEDIA' && element.value) {
      element.value.pause()
      return
    }

    if (bufferSource.value) {
      bufferSource.value.stop()
    }
  }

  function getVolume(): number {
    if (!buffer.value) return 1

    analyser.value?.getByteFrequencyData(buffer.value)

    let val = 0
    let i = 0

    const len: number = BIT_DEPTH / 2

    for (; i < len; i++) val += buffer.value[i]

    val /= len

    return val
  }

  function updateBuffer() {
    const volume = getVolume()

    volumeBuffer.push(volume)

    while (volumeBuffer.length > volumeBufferSize.value) {
      volumeBuffer.shift()
    }
  }

  function updateEvents() {
    const seconds = (window.performance.now() - started.value) / 1000

    podcastEvents.value.forEach((event, i) => {
      if (event.seconds < seconds && podcastEvents.value[i + 1]?.seconds > seconds) {
        if (activeEvent.value !== i) {
          activeEvent.value = i
          speakerVariant.value = VARIANTS?.[podcastEvents.value?.[i]?.speaker]
        }
      }
    })
  }

  function tick() {
    if (!analyser.value || !buffer.value) return

    updateBuffer()
    updateStreams()

    if (media.value === 'PODCAST') updateEvents()
  }

  return {
    streamDefinitions,
    initialize,
    initialized,
    speakerVariant,
    play,
    pause,
    playing,
    tick,
    volume,
    stream,
    podcastEvents,
    podcastSpeakers,
    podcastVariants
  }
})

if (import.meta.hot) import.meta.hot.accept(acceptHMRUpdate(useAudio, import.meta.hot))
