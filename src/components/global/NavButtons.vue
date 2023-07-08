<template>
  <div ref="container" class="logo" :class="{ open: ui.menuOpen, visible }" @click="toggle">
    <Logo />
  </div>
</template>

<script setup lang="ts">
import Logo from '@/assets/svg/logo.svg?component'

defineProps<{ visible?: boolean }>()

const background = useBackground()
const route = useRoute()
const ui = useUI()
const container = ref()

function toggle() {
  ui.menuOpen = !ui.menuOpen
}
</script>

<style lang="scss" scoped>
.logo {
  @include position(fixed, 0 calc(var(--outer-padding) + #{notch(left)}) null null);
  @include size(px(120));
  @include shadow;
  @include flex;
  flex-basis: top right;
  border-radius: var(--border-radius);
  padding: px(10);
  background: var(--black);
  z-index: 100;
  will-change: transform, opacity;
  opacity: 0;

  @include mobile {
    @include position(fixed, 0 0 null 0);
  }

  &.visible {
    opacity: 1;
  }

  .shade {
    @include position(absolute, 0 0 0 0);
    background: var(--white);
    z-index: 1;
    transform-origin: top left;
    transition: var(--base-transition);
  }

  @include mobile-landscape {
    @include size(px(150));
  }

  svg {
    @include size(90%);
    transition: all var(--duration) var(--easing);
    position: relative;
    z-index: 2;

    :deep(*) {
      transition: all var(--duration) var(--easing);
    }
  }

  :deep(*) {
    stroke: var(--white);

    @include dark-mode {
      stroke: var(--white);
    }
  }

  &:hover {
    svg :deep(*) {
      stroke: var(--pink);
    }

    svg :deep(*) {
      stroke: var(--white);
    }
    
    background: lighten(map-get($colors, 'black'), 5%);
  }

  &:active svg {
    transform: scale(0.8);
  }
}

nav {
  @include position(fixed, 0 null 0 0);
  @include flex(flex-start, center, column);
  width: var(--page-shift);
  padding-left: calc(var(--outer-padding) + #{notch(left)});
  transform: translateX(-50%);
  gap: var(--outer-padding);
  z-index: 100;
  pointer-events: none;
  transition: var(--base-transition);
  opacity: 0;

  &.visible {
    pointer-events: all;
    transform: translateX(0%);
    opacity: 1;
  }

  a {
    transition: var(--hover-transition);
  }

  :deep(a) {
    text-decoration: none;
    color: var(--pink);
    text-transform: none;

    @include dark-mode {
      color: var(--white);
    }
  }

  a:hover {
    color: var(--black);

    @include dark-mode {
      color: var(--pink);
    }
  }
}

h1 {
  @include type(60, 60, 400);
  transition: var(--hover-transition);

  &:active {
    transform: scale(0.9);
  }

  @include mobile-portrait {
    @include type(100, 100, 400);
  }
}
</style>
