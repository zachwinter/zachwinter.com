import { shallowRef, ref, computed } from 'vue'
import { useAudioContext } from './useAudioContext'

export function useAudioElement() {
  const enabled = ref(false)
  const context = useAudioContext()
  const element = shallowRef(document.createElement('audio'))
  const mediaElementSource = shallowRef()
  const playing = ref(false)

  element.value.crossOrigin = 'anonymous'

  function init() {
    if (!context.ctx.value) return

    mediaElementSource.value = context.ctx.value.createMediaElementSource(element.value)

    if (context.ctx.value.destination) {
      mediaElementSource.value.connect(context.analyser.value)
      context.analyser.value.connect(context.ctx.value.destination)
      enabled.value = true
    }
  }

  function play() {
    if (enabled.value === false) init()
    element.value.play()
    playing.value = true
  }

  function pause() {
    element.value.pause()
    playing.value = false
  }

  return {
    context,
    element,
    enabled,
    playing,
    play,
    pause
  }
}
