<template>
  <Shader
    class="background"
    ref="shader"
    :animate="false"
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
      shader.value.instance.tick()
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
  @include position(absolute, 0 null null 0);
  z-index: -1;
  pointer-events: none;
}
</style>
