<template lang="pug">
main(ref="main" :style="{ 'background-image': `url(${backgroundUrl})`}")
  Hero
  //- Backdrop(:mouse="mouse")
</template>

<script>
import Hero from '@/components/Hero'
import Backdrop from '@/components/Backdrop'
// import zach from '@/assets/zachary.jpg'
import bwm from '@/assets/bwm.jpg'
import { mapState } from 'vuex'
import bw from '@/assets/bw.jpg'

export default {
  components: {
    Hero,
    Backdrop
  },
  data: () => ({
    mouse: {
      x: window.innerWidth/2,
      y: window.innerHeight/2
    }
  }),
  computed: {
    ...mapState(['isMobile', 'isMobileLandscape']),
    backgroundUrl () {
      if (this.isMobileLandscape) {
        return bw
      }

      if (this.isMobile) {
        return bwm
      }

      return bw
    }
  }
}
</script>

<style lang="scss" scoped>
main {
  position: relative;
  background-size: cover;
}
</style>