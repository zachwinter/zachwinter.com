<template>
  <transition name="fade">
    <Spinner v-if="ui.loading" />
  </transition>

  <Logo :visible="!ui.loading" />

  <div class="app-wrapper" :class="{ visible: !ui.loading, shifted: ui.menuOpen }">
    <router-view v-slot="{ Component }">
      <transition name="page">
        <component :is="Component" />
      </transition>
    </router-view>
  </div>

  <transition name="fade">
    <NowPlaying v-if="!ui.loading" src="/toe.jpg" artist="Toe" alt="Toe" track="メトロノーム" />
  </transition>
  
  <Background />
</template>

<script lang="ts" setup>
import { timer } from './util/time'

const ui = useUI()

onMounted(async () => {
  await Promise.all([document.fonts.ready, timer(750, () => {}).$finished])
  ui.loading = false
})
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
    transform: translateX(var(--page-shift));
    pointer-events: none;
  }
}
</style>
