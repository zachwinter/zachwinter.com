<template lang="pug">
Renderer(:uniforms="uniforms" :shader="shader" :y-offset="yOffset" :dark-mode="darkMode" ref="renderer")
</template>

<script>
import { bind } from '@/store/util'
import Renderer from '@/components/common/Renderer'

export default {
  components: { Renderer },
  computed: bind([
    'background/uniforms', 
    'background/shader',
    'background/yOffset',
    'ui/darkMode'
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