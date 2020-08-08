<template lang="pug">
.logo(@mouseover="onMouseMove" @mouseout="onMouseOut" @click="$store.dispatch('ui/toggleHeader')" :class="{ visible: logoVisible, 'no-shadow': headerVisible }")
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
import { bind } from '@/store/util'
import Vivus from 'vivus'

export default {
  data: () => ({
    active: false
  }),
  computed: bind(['ui/logoVisible', 'ui/headerVisible']),
  methods: {
    onMouseMove () {
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
@keyframes fade-in {
  0% {
    transform: translateY($intro-offset) translateX(-50%);
    opacity: 0;
  }

  100% {
    opacity: 1;
    transform: trnslateY(0px) translateX(-50%);
  }
}

.logo {
  @include size($logo-size);
  @include position(fixed, $outer-padding null null $outer-padding);
  box-shadow: $box-shadow;
  opacity: 0;
  background: white;
  padding: 20px;
  // will-change: opacity, transform;
  z-index: 100;
  transition: box-shadow $base-transition;

  @include max-width(tablet) {
    @include size($mobile-logo-size);
    padding: 10px;
  }

  &.visible { animation: fade-in $intro-duration $intro-easing forwards; }

  &.no-shadow {
    box-shadow: $transparent-box-shadow;
  }
}

svg {
  @include size(100%);
  display: block;
  pointer-events: none;
}
</style>