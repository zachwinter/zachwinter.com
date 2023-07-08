<template>
  <div class="container" ref="container" :class="{ open: ui.menuOpen, visible }" @click="toggle">
    <Logo class="logo" />
  </div>

  <nav :class="{ visible: ui.menuOpen }" @click="toggle">
    <RouterLink to="/">
      <H2>Home</H2>
    </RouterLink>
    <RouterLink to="/work">
      <H2>Work</H2>
    </RouterLink>

    <RouterLink to="/contact">
      <H2>Contact</H2>
    </RouterLink>
  </nav>
</template>

<script setup lang="ts">
import Logo from '@/assets/svg/logo.svg?component'

defineProps<{ visible: boolean }>()

const ui = useUI()
const container = ref()

function toggle() {
  ui.menuOpen = !ui.menuOpen
}
</script>

<style lang="scss" scoped>
.container {
  @include position(
    fixed,
    var(--outer-padding) null null calc(var(--outer-padding) + #{notch(left)})
  );
  @include size(px(120));
  @include shadow;
  @include flex;
  border-radius: var(--border-radius);
  padding: px(10);
  background: var(--black);
  z-index: 200;
  will-change: transform, opacity;
  opacity: 0;

  &.visible {
    opacity: 1 !important;

    :deep(*) {
      opacity: 1 !important;
    }
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
  }

  &:hover, &.open {
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
  background: linear-gradient(to right, rgba(map-get($colors, 'black'), 1), rgba(map-get($colors, 'black'), 0));

  &.visible {
    pointer-events: all;
    transform: translateX(0%);
    opacity: 1;
  }

  &.visible:before {
    @include position(fixed, calc(-1 * var(--outer-padding)) 0 0 calc(-1 * var(--outer-padding)));
    width: calc(100vw + 2 * var(--outer-padding));
    height: calc(100vh + 2 * var(--outer-padding));
    content: '';
    background: var(--white);
    z-index: 1;
    transform-origin: top left;
    transition: var(--base-transition);
    opacity: 0;
    pointer-events: none;
  }

  a {
    transition: var(--hover-transition);
  }

  :deep(a) {
    text-decoration: none;
    color: var(--white);
    text-transform: none;
  }

  a:hover {
    color: var(--pink);
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
