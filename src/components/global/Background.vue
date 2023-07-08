<template>
  <Shader
    v-if="viewport.refreshRate"
    ref="shader"
    position="fixed"
    :animate="false"
    :shader="background.shader"
    :uniforms="background.uniforms"
    :width="viewport.width"
    :height="viewport.height"
    :dpr="viewport.dpr"
    :stream="background.stream"
    :volume="background.volume"
    :scroll="background.scroll"
  />
</template>

<script setup lang="ts">
const shader = ref()
const raf = useRAF()
const viewport = useViewport()
const background = useBackground()

onMounted(() => {
  raf.add(
    {
      tick({ now }: { now: DOMHighResTimeStamp }) {
        background.tick(now)
        shader.value.instance.stream = background.stream
        shader.value.instance.volume = background.volume
        shader.value.instance.tick(window.performance.now())
      }
    },
    'background'
  )
})
</script>
