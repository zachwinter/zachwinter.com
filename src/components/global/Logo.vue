<template>
  <div ref="container" class="logo" :class="{ open }" @click="toggle">
    <Logo />
    <div ref="shade" class="shade" :style="{ 'background-color': open ? color : 'var(--white)' }"/>
  </div>

  <nav :class="{ visible: open }" @click="toggle">
    <H1><RouterLink to="/" @mouseover="select('home')">Home</RouterLink></H1>
    <H1><RouterLink to="/work" @mouseover="select('work')">Work</RouterLink></H1>
    <H1><RouterLink to="/contact" @mouseover="select('contact')">Contact</RouterLink></H1>
  </nav>
</template>

<script setup lang="ts">
import Logo from '@/assets/svg/logo.svg?component'

const viewport = useViewport()
const open = ref(false)
const container = ref()
const shade = ref()
const color = ref('')

function toggle() {
  const { width, height, x: tX } = container.value.getBoundingClientRect()
  const sX = viewport.width / width
  const sY = viewport.height / height
  shade.value.style.transform = open.value
    ? 'none'
    : `translateX(-${tX}px) scaleX(${sX}) scaleY(${sY})`
  open.value = !open.value
}

function select(page: string) {
  switch (page) {
    case 'home':
      color.value = 'var(--pink)'
      break
    case 'work':
      color.value = 'var(--purple)'
      break
    case 'contact':
      color.value = 'var(--blue)'
      break
    default:
      return
  }
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

  .shade {
    @include position(absolute, 0 0 0 0);
    background: var(--white);
    z-index: 1;
    transform-origin: top left;
    transition: var(--base-transition);
  }

  &.open .shade {
    background: var(--gray);
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
  }

  &:hover :deep(svg *) {
    stroke: var(--pink);
  }

  &:active svg {
    transform: scale(0.8);
  }

  &.open :deep(svg *) {
    stroke: var(--white);
  }
}

nav {
  @include position(
    fixed,
    calc(var(--outer-padding) + #{px(120)}) var(--outer-padding)
      calc(var(--outer-padding) + #{px(120)}) var(--outer-padding)
  );
  @include flex(flex-start, center, column);
  padding-left: notch(left);
  gap: var(--outer-padding);
  z-index: 100;
  pointer-events: none;
  transition: all var(--duration) var(--easing);
  opacity: 0;

  &.visible {
    pointer-events: all;
    opacity: 1;
  }

  a {
    transition: var(--hover-transition);
  };

  :deep(a) {
    text-decoration: none;
    color: var(--white);
  }

  &:hover a {
    opacity: .5;

    &:hover {
      opacity: 1;
    }
  }
}

h1 {
  @include type(60, 60, 400);
  transition: var(--hover-transition);

  &:active {
    transform: scale(.9);
  }

  @include mobile-portrait {
    @include type(100, 100, 400);
  }
}
</style>
