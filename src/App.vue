<template>
  <!-- <nav>
    <RouterLink to="/work" class="invert">Work</RouterLink>
    <RouterLink to="/contact">Contact</RouterLink>
  </nav> -->

  <transition name="fade">
    <Spinner v-if="ui.loading" />
  </transition>

  <Logo :visible="!ui.loading" />
  <NavButtons />

  <div class="app-wrapper" :class="{ visible: !ui.loading, shifted: ui.menuOpen }">
    <router-view v-slot="{ Component }">
      <transition name="page">
        <component :is="Component" />
      </transition>
    </router-view>
  </div>

  <transition name="fade">
    <NowPlaying
      v-if="!ui.loading"
      src="/books.jpg"
      artist="The Books"
      alt="The Books"
      track="Enjoy Your Worries, You May Never Nave Them Again"
    />
  </transition>

  <Background />
</template>

<script lang="ts" setup>
import { timer } from './util/time'

const route = useRoute()
const ui = useUI()
const background = useBackground()
const raf = useRAF();

watch(
  () => route.name,
  (val) => {
    switch (val) {
      case '/':
        background.tweenToVariant(0)
        break
      case '/contact':
        background.tweenToVariant(2)
        break
      case '/work':
        background.tweenToVariant(1)
        break
      default:
        return
    }
  }
)

onMounted(async () => {
  await Promise.all([document.fonts.ready, timer(600, () => {}).$finished])
  ui.loading = false
  raf.start();
})

onBeforeUnmount(() => {
  raf.stop();
});
</script>

<style lang="scss">
@import '@/styles/main.scss';

.app-wrapper {
  @include size(100%);
  @include scroll-bar;
  overflow: hidden;
  opacity: 0;
  transition: var(--base-transition);
  will-change: transform, opacity;
  pointer-events: none;

  &.visible {
    opacity: 1;
    pointer-events: all;
  }

  &.shifted {
    opacity: 0;
    transform: scale(1.5) !important;
    pointer-events: none;
  }
}
</style>

<style lang="scss" scoped>
$size: 220;
$offset: 0.25;

nav {
  @include position(fixed, 0 0 null null);
  @include flex(flex-start, flex-start, row);
  z-index: 100;
  flex-grow: 0;

  @include mobile-landscape {
    font-size: px(#{$size * 0.85});
    line-height: px(#{$size * 0.85});
  }

  @include mobile-portrait {
    font-size: px(#{$size * 0.5});
    line-height: px(#{$size * 0.5});
  }
}

a,
button {
  @include button;
  @include size(px(120), px(120));
  @include shadow;
  @include blur(rgba(0, 0, 0, 0.3), 5px);
  font-weight: 100 !important;
  margin: 0;
}

nav a:first-of-type {
  background: var(--pink);
}
</style>
