<template>
  <transition name="fade">
    <Spinner v-if="ui.loading" />
  </transition>

  <Logo :visible="!ui.loading" />

  <div class="app-wrapper" :class="{ visible: !ui.loading, shifted: ui.menuOpen }">
    <NowPlaying src="/toe.jpg" artist="Toe" alt="Toe" track="メトロノーム" />
    <router-view v-slot="{ Component }">
      <transition name="page">
        <component :is="Component" />
      </transition>
    </router-view>
  </div>

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
  will-change: opacity;

  &.visible {
    opacity: 1;
  }

  &.shifted {
    opacity: 0.2;
    transform: translateX(var(--page-shift));
  }
}
</style>
