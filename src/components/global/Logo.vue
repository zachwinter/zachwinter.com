<template lang="pug">
.logo(@mouseover="onMouseMove" @mouseout="onMouseOut" @click="$store.dispatch('ui/toggleHeader')" :class="{ visible: logoVisible, 'no-shadow': headerVisible, animate }")
  .text
    span M
    span E
    span N
    span U
  svg#logo(xmlns="http://www.w3.org/2000/svg" viewBox="0 0 178.06 250.34")
    path(
      d="M873.4,531.92S1160.15,225.05,934.11,549c45.79-17.9,111,7.6,57.37,71.05-40.59,48-12-64.5,48.18-100.34" 
      transform="translate(-866.45 -390.97)" 
      fill="none" 
      stroke="#000" 
      stroke-miterlimit="10" 
      stroke-width="10" 
      style="stroke-dasharray: 673, 675; stroke-dashoffset: 0;"
    )
</template>

<script>
import { bind } from '@/store/util'
import Vivus from 'vivus'
import { pause } from '@/util/timing'

export default {
  data: () => ({
    active: false,
    animate: false
  }),
  computed: bind(['ui/logoVisible', 'ui/headerVisible']),
  watch: {
    async logoVisible (val) {
      if (val) {
        await pause(3000)
        this.animate = true
      }
    }
  },
  mounted () {
    // new Vivus('logo', { duration: 30 })
  },
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
    transform: translateY($intro-offset);
    opacity: 0;
  }

  100% {
    opacity: 1;
    transform: trnslateY(0px);
  }
}

.logo {
  @include flex(center, flex-start);
  @include size($logo-size);
  @include position(fixed, $outer-padding null null calc(#{$outer-padding} + #{notch(left)}));
  // box-shadow: $box-shadow;
  opacity: 0;
  // background: white;
  background: transparent;
  will-change: opacity, transform;
  z-index: 100;
  transition: box-shadow $base-transition;

  @include max-width(mobile) {
    @include size($mobile-logo-size);
    padding: 10px;
  }

  @include mobile-landscape {
    @include size($mobile-logo-size);
  }

  &.visible { animation: fade-in $page-transition-duration forwards; }

  &.no-shadow {
    box-shadow: $transparent-box-shadow;
  }
}

@keyframes fade-out-in {
  0% { opacity: 1; }
  50% { opacity: 0; transform: scale(.75); }
  100% { opacity: 1; }
}

svg {
  @include size(auto, 90%);
  display: block;
  pointer-events: none;
}

@keyframes fade-in-out {
  0% { opacity: 0; transform: scale(.5); }
  50% { opacity: 1; transform: scale(1);  }
  100% { opacity: 0; transform: scale(.5); }
}

.text {
  @include flex;
  position: absolute;
  font-size: 1.5rem;
  pointer-events: none;

  span {
    display: block;
    opacity: 0;
  }
}

.animate {
  svg {
    animation: fade-out-in 3000ms forwards;
  }

  .text span {
    @include cascade(4, 150ms);
    animation: fade-in-out 2000ms forwards;
  }
}
</style>

<style lang="scss">
.dark .logo {
  // background: $black;
  * { stroke: $white; }
}
</style>