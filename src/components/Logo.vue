<template lang="pug">
.logo(@mouseover="onMouseMove" @mouseout="onMouseOut" @click="$emit('click')")
  svg#logo(xmlns="http://www.w3.org/2000/svg" viewBox="0 0 178.06 250.34")
    path(
      d="M873.4,531.92S1160.15,225.05,934.11,549c45.79-17.9,111,7.6,57.37,71.05-40.59,48-12-64.5,48.18-100.34" 
      transform="translate(-866.45 -390.97)" 
      fill="none" 
      stroke="#000" 
      stroke-miterlimit="10" 
      stroke-width="19" 
      style="stroke-dasharray: 673, 675; stroke-dashoffset: 0;"
    )
</template>

<script>
import Vivus from 'vivus'
// import { pause } from '@/util'

export default {
  data: () => ({
    active: false
  }),
  methods: {
    async onMouseMove () {
      if (this.active) return
      this.active = true
      new Vivus('logo', { duration: 30 })
    },

    onMouseOut () {
      this.active = false
    }
  }  
}
</script>

<style lang="scss" scoped>
$logo-size: 100px;

.logo {
  @include size(100px);
  background: white;
  padding: 20px;

  @include max-width(tablet) {
    @include size(60px);
    padding: 10px;
  }
}

svg {
  @include size(100%);
  display: block;
  pointer-events: none;
}
</style>