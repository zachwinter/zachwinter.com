<template>
  <Shader
    v-if="viewport.refreshRate"
    ref="shader"
    position="fixed"
    :animate="true"
    :shader="background.shader"
    :uniforms="background.uniforms"
    :width="width"
    :height="height"
    :dpr="viewport.dpr"
    :stream="background.stream"
    :volume="background.volume"
  />
</template>

<script setup lang="ts">
const viewport = useViewport()
const background = useBackground()
const width = ref(viewport.width)
const height = ref(viewport.height + 100)

watch(
  () => viewport.refreshRate,
  () => requestAnimationFrame(background.tick)
)

watch(
  () => viewport.orientation,
  () => {
    width.value = viewport.width
    height.value = viewport.height + 100
  }
)
</script>