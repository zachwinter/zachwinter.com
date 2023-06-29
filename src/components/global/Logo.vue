<template>
  <div ref="container" class="logo" :class="{ open: ui.menuOpen, visible }" @click="toggle">
    <Logo />
  </div>

  <nav :class="{ visible: ui.menuOpen }" @click="toggle">
    <RouterLink to="/" @mouseover="select('home')" @click="background.tweenToVariant(0)">
      <H2>Home</H2>
    </RouterLink>
    <RouterLink to="/work" @mouseover="select('work')" @click="background.tweenToVariant(1)">
      <H2>Work</H2>
    </RouterLink>

    <RouterLink to="/contact" @mouseover="select('contact')" @click="background.tweenToVariant(3)">
      <H2>Contact</H2>
    </RouterLink>
  </nav>
</template>

<script setup lang="ts">
import Logo from '@/assets/svg/logo.svg?component'

defineProps<{ visible: boolean }>()

const viewport = useViewport()
const background = useBackground()
const ui = useUI()
const container = ref()
const shade = ref()
const color = ref('')

function toggle() {
  // const { width, height, x: tX } = container.value.getBoundingClientRect()
  // const sX = viewport.width / width
  // const sY = viewport.height / height
  // shade.value.style.transform = ui.menuOpen
  //   ? 'none'
  //   : `translateX(-${tX}px) scaleX(${sX}) scaleY(${sY})`
  ui.menuOpen = !ui.menuOpen
}

function select(page: string) {
  // switch (page) {
  //   case 'home':
  //     color.value = 'var(--pink)'
  //     break
  //   case 'work':
  //     color.value = 'var(--purple)'
  //     break
  //   case 'contact':
  //     color.value = 'var(--blue)'
  //     break
  //   default:
  //     return
  // }
}
</script>

<style lang="scss" scoped>
.logo {
  @include position(fixed, 0 null null calc(var(--outer-padding) + #{notch(left)}));
  @include size(px(120));
  @include shadow;
  @include flex;
  border-radius: var(--border-radius);
  padding: px(10);
  background: var(--white);
  z-index: 100;
  will-change: transform, opacity;
  opacity: 0;

  @include dark-mode {
    background: var(--black);
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
    stroke: var(--gray);

    @include dark-mode {
      stroke: var(--white);
    }
  }

  &:hover {
    svg :deep(*) {
      stroke: var(--pink);
    }

    @include dark-mode {
      svg :deep(*) {
        stroke: var(--white);
      }
      background: lighten(map-get($colors, 'black'), 5%);
    }
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
