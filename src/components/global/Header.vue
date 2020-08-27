<template lang="pug">
header(:class="{ visible: headerVisible }" id="header")
  div: router-link(:to="{ name: 'Work' }" @click.native="click") Work
  div: router-link(:to="{ name: 'Contact' }" @click.native="click") Contact
  div: router-link(:to="{ name: 'Resume' }" @click.native="click") Resume
</template>

<script>
import { bind } from '@/store/util'

export default {
  computed: bind('ui/headerVisible'),
  methods: {
    click () {
      this.$store.dispatch('ui/toggleHeader')
    }
  }
}
</script>

<style lang="scss" scoped>
header {
  @include position(fixed, 0 0 null 0);
  @include flex;
  z-index: 50;
  transform: translateY(-100%);
  transition: all $base-transition;
  height: calc(#{$logo-size} + #{$outer-padding * 2});
  background: $white;
  box-shadow: $box-shadow;
  text-align: center;
  will-change: transform, opacity;

  &.visible {
    transform: translateY(0%);
  }

  @include mobile-portrait {
    @include position(fixed, 0 0 0 0);
    @include flex(center, center, column);
    height: auto;
    transform: translateY(0) scale(.7);
    opacity: 0;
    pointer-events: none;

    &.visible {
      opacity: 1;
      pointer-events: all;
      transform: translateY(0) scale(1);
    }
  }

  @include mobile-landscape {
    height: calc(#{$mobile-logo-size} + #{$outer-padding * 2});
  }
}

div {
  @include flex(center, space-evenly);
}

a {
  position: relative;
  z-index: 10;
  text-transform: uppercase;
  font-size: 1.2rem;
  text-decoration: none;
  padding: 0 $outer-padding;
  transition: transform 100ms linear;
  transform-origin: center center;

  &.router-link-exact-active { font-weight: 700; }

  &:hover {
    transform: scale(1.2);
  }
  
  @include max-width(mobile) {
    font-size: 2rem;
    margin: spacer(1) 0;
  }
}
</style>

<style lang="scss">
.dark #header {
  background: $black;
}
</style>