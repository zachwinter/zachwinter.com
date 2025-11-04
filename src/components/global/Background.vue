<template>
  <Shader
    class="background"
    ref="shader"
    :animate="true"
    :shader="background.shader"
    :uniforms="background.uniforms"
    :width="viewport.width"
    :stream="background.stream"
    :volume="background.volume"
    :height="viewport.height"
    :dpr="viewport.dpr"
    :useWorker="false"
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
      if (!shader.value?.instance) return

      // Update stream and volume on shader instance (worker or main thread)
      shader.value.instance.setStreamVolume(background.stream, background.volume)

      // Update all uniforms (for variant tweening)
      // Note: This runs every frame to catch variant tween updates
      if (shader.value.instance.updateAllUniforms) {
        shader.value.instance.updateAllUniforms(background.uniforms)
      }
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
  width: 100vw;
  height: 100vh;
}
</style>
