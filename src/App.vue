<template>
  <transition name="fade">
    <Spinner v-if="ui.loading" />
  </transition>

  <main class="app-wrapper" :class="{ visible: !ui.loading }" @scroll="onScroll">
    <Logo />
    <!-- <Navigation /> -->
    <NowPlaying src="/toe.jpg" artist="Toe" alt="Toe" track="メトロノーム" :controls="true" />
    <RouterView />
    <Background />
  </main>
</template>

<script lang="ts" setup>
import { timer } from '@/util/time'

const ui = useUI()
const background = useBackground()


function onScroll (e) {
  background.setScroll(e.target.scrollTop)
}

onMounted(async () => {
  await Promise.all([document.fonts.ready, timer(750, () => {}).$finished])
  ui.loading = false
})
</script>

<style lang="scss">
@import '@/styles/main.scss';

.app-wrapper {
  @include size(100vw, 100vh);
  @include scroll-bar;
  overflow-y: scroll;
  overflow-x: hidden;
  opacity: 0;
  transition: var(--page-transition);
  will-change: opacity;

  &.visible {
    opacity: 1;
  }
}
</style>
