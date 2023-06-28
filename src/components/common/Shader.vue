<template>
  <div ref="container" class="shader"></div>
</template>

<script setup lang="ts">
import { Shader, Editor } from 'fragment-shader'

const container = ref()
const instance = ref()

interface Props {
  shader?: string
  uniforms?: any
  width?: number
  height?: number
  dpr?: number
  editor: boolean
  fillViewport?: boolean
  fillContainer?: boolean
}

const props: Record<string, unknown> = withDefaults(defineProps<Props>(), {
  width: window.innerWidth,
  height: window.innerHeight,
  dpr: window.devicePixelRatio,
  editor: false,
  fillViewport: false,
  fillContainer: false
})

watch(
  () => [props.width, props.height, props.dpr],
  ([width, height, dpr]) => {
    instance.value.size = { width, height, dpr }
  }
)

onMounted(() => {
  const { editor, ...config } = Object.keys(props).reduce(
    (acc: Record<string, any>, key: string) => {
      if (typeof props[key] !== 'undefined') acc[key] = props[key]
      return acc
    },
    {
      parent: container.value
    }
  )

  instance.value = editor ? new Editor(config) : new Shader(config)
})

onBeforeUnmount(() => {
  instance.value.destroy()
})
</script>