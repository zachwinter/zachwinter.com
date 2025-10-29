<template>
  <div class="shader" ref="container" @click="$emit('click')" />
</template>

<script setup lang="ts">
import Shader from 'fragment-shader/classes/Shader'
import { type ShaderConfig } from 'fragment-shader/types/shader'

defineEmits(['click'])

interface Props extends ShaderConfig {
  stream?: number
  volume?: number
  scroll?: number
}

const props = withDefaults(defineProps<Props>(), {
  width: window.innerWidth,
  height: window.innerHeight,
  dpr: Math.min(window.devicePixelRatio, 3),
  shader: `void main () { gl_FragColor = vec4(.8, .2, .6, 1.); }`,
  animate: true,
  fillViewport: false,
  variant: 0,
  scroll: 0
})

const instance: Ref<Shader | null> = ref(null)
const container: Ref<HTMLElement | undefined> = ref()

defineExpose({ instance })

watch(
  () => [props.width, props.height, props.dpr],
  ([width, height, dpr]) => {
    if (!instance.value) return
    instance.value.size = { width, height, dpr }
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
    if (typeof stream === 'number') instance.value.stream = stream
    if (typeof volume === 'number') instance.value.volume = volume
  }
)

onMounted(() => {
  if (!container.value) return

  instance.value = new Shader({
    ...props,
    parent: container.value
  })
})

onBeforeUnmount(() => {
  instance.value?.destroy?.()
})
</script>

<style lang="scss" scoped>
.shader {
  @include position(absolute, 0 null null 0);
  z-index: 10;
}
</style>
