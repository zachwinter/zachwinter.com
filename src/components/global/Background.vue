<template lang="pug">
Renderer(:uniforms="uniforms" :shader="shader" :y-offset="yOffset" ref="renderer")
</template>

<script>
import { bind } from '@/store/util'
import Renderer from '@/components/global/Renderer'

export default {
  components: { Renderer },
  computed: bind([
    'background/uniforms', 
    'background/shader',
    'background/yOffset'
  ]),
  watch: {
    '$route' ({ name }) {
      this.$store.dispatch('background/tween', name)
    }
  },
  mounted () {
    const tick = now => {
      window.requestAnimationFrame(tick)
      this.$refs.renderer.tick(now)
    }

    window.requestAnimationFrame(tick)
  }
}
</script>