<template>
  <div class="shader" ref="container" @click="$emit('click')" />
</template>

<script setup lang="ts">
import { ShaderWorkerManager } from '@/util/shader-worker'
import type { ShaderWorkerConfig } from '@/util/shader-worker'

defineEmits(['click'])

interface Props {
  // ShaderConfig props
  parent?: HTMLElement
  shader?: string
  uniforms?: any[]
  width?: number
  height?: number
  dpr?: number
  fillViewport?: boolean
  fillContainer?: boolean
  animate?: boolean
  debug?: boolean
  onError?: Function
  onSuccess?: Function
  onResize?: Function
  useWorker?: boolean

  // Additional props
  stream?: number
  volume?: number
  scroll?: number
}

const props = withDefaults(defineProps<Props>(), {
  width: window.innerWidth,
  height: window.innerHeight,
  dpr: Math.min(window.devicePixelRatio, 2),
  shader: `void main () { gl_FragColor = vec4(.8, .2, .6, 1.); }`,
  animate: true,
  fillViewport: false,
  useWorker: true, // Enable worker by default!
  scroll: 0
})

const instance: Ref<ShaderWorkerManager | null> = ref(null)
const container: Ref<HTMLElement | undefined> = ref()

defineExpose({ instance })

watch(
  () => [props.width, props.height, props.dpr],
  ([width, height, dpr]) => {
    if (!instance.value) return
    instance.value.size = { width, height, dpr } as any
  }
)

watch(
  () => props.shader,
  (shader) => {
    if (!instance.value) return
    instance.value.rebuild({ shader, uniforms: props.uniforms })
  }
)

watch(
  () => [props.stream, props.volume],
  ([stream, volume]) => {
    if (!instance.value) return
    if (typeof stream === 'number' && typeof volume === 'number') {
      instance.value.setStreamVolume(stream, volume)
    }
  }
)

onMounted(() => {
  if (!container.value) return

  instance.value = new ShaderWorkerManager({
    parent: container.value,
    shader: props.shader,
    uniforms: props.uniforms,
    width: props.width,
    height: props.height,
    dpr: props.dpr,
    animate: props.animate,
    fillViewport: props.fillViewport,
    fillContainer: props.fillContainer,
    debug: props.debug,
    onError: props.onError,
    onSuccess: props.onSuccess,
    onResize: props.onResize,
    useWorker: props.useWorker
  })
})

onBeforeUnmount(() => {
  instance.value?.destroy?.()
})
</script>
