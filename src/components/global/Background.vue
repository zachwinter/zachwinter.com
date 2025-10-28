<template>
  <Shader
    class="background"
    ref="shader"
    :shader="background.shader"
    :uniforms="background.uniforms"
    :width="viewport.width"
    :stream="background.stream"
    :volume="background.volume"
    :height="viewport.height"
    :dpr="viewport.dpr"
  />
</template>

<script setup lang="ts">
const shader = ref()
const raf = useRAF()
const viewport = useViewport()
const background = useBackground()

onMounted(() => {
  raf.remove('background')
  raf.add(
    () => {
      background.tick()
      if (!shader.value.instance) return
    },
    { id: 'background' }
  )
})

onBeforeUnmount(() => {
  raf.remove('background')
})
</script>

<style lang="scss" scoped>
.background {
  z-index: 0;
  mix-blend-mode: exclusion;
  pointer-events: none;
}
</style>
