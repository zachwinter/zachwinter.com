<template>
  <aside class="arrows">
    <div class="arrow-wrapper up" :class="[nav.up && 'visible']" @click="scroll.navigateUp">
      <div class="inner">
        <svg
          data-v-48d84c02=""
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          class="lucide arrow lucide-arrow-up-icon lucide-arrow-up arrow"
        >
          <path d="m5 12 7-7 7 7"></path>
          <path d="M12 19V5"></path>
        </svg>
      </div>
      <span v-if="nav.up" class="label">{{ nav.up.label }}</span>
    </div>
    <div
      class="arrow-wrapper right"
      :class="[nav.right && 'visible']"
      @click="scroll.navigateRight"
    >
      <div class="inner">
        <svg
          data-v-48d84c02=""
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          class="lucide arrow lucide-arrow-right-icon lucide-arrow-right arrow"
        >
          <path d="M5 12h14"></path>
          <path d="m12 5 7 7-7 7"></path>
        </svg>
      </div>
      <span v-if="nav.right" class="label">{{ nav.right.label }}</span>
    </div>
    <div class="arrow-wrapper down" :class="[nav.down && 'visible']" @click="scroll.navigateDown">
      <div class="inner">
        <svg
          data-v-48d84c02=""
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          class="lucide arrow lucide-arrow-down-icon lucide-arrow-down arrow"
        >
          <path d="M12 5v14"></path>
          <path d="m19 12-7 7-7-7"></path>
        </svg>
      </div>
      <span v-if="nav.down" class="label">{{ nav.down.label }}</span>
    </div>
    <div class="arrow-wrapper left" :class="[nav.left && 'visible']" @click="scroll.navigateLeft">
      <div class="inner">
        <svg
          data-v-48d84c02=""
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          class="lucide arrow lucide-arrow-left-icon lucide-arrow-left arrow"
        >
          <path d="m12 19-7-7 7-7"></path>
          <path d="M19 12H5"></path>
        </svg>
      </div>
      <span v-if="nav.left" class="label">{{ nav.left.label }}</span>
    </div>
  </aside>
</template>

<script lang="ts" setup>
import { useScroll } from '../../store/scroll'

const scroll = useScroll()
// Merged navigation state for arrows
const nav = computed(() => {
  const merged = {
    up: scroll.mainNavigation.up,
    down: scroll.mainNavigation.down,
    left: null as any,
    right: null as any
  }

  // If we're in a section with a horizontal scroller, use its left/right navigation
  const activeSection = scroll.mainState.activeIndex

  // Section 1 has Kaleidosync horizontal scroller
  if (activeSection === 1) {
    merged.left = scroll.kaleidosyncNavigation.left
    merged.right = scroll.kaleidosyncNavigation.right
  }

  // Section 2 has COVID horizontal scroller
  if (activeSection === 2) {
    merged.left = scroll.covidNavigation.left
    merged.right = scroll.covidNavigation.right
  }

  // Section 3 has MSF horizontal scroller
  if (activeSection === 3) {
    merged.left = scroll.msfNavigation.left
    merged.right = scroll.msfNavigation.right
  }

  return merged
})
</script>

<style lang="scss" scoped>
$arrow-size: 2rem;
$arrow-offset: 0rem;
$border-radius: 1rem;
$arrow-width: 0.5;

.arrow-wrapper {
  @include box;
  @include blur(1rem, rgba($purple, 0.25));
  position: fixed;
  display: flex;
  align-items: center;
  opacity: 0;
  transition: opacity 350ms var(--easing);
  will-change: transform, opacity;
  pointer-events: none;
  z-index: 100;

  .inner {
    @include flex;
    @include size(3rem);
    border-radius: 3rem;
  }

  @include mobile {
    @include box(0);
  }

  &.visible {
    opacity: 1;
    pointer-events: auto;
  }

  &.up {
    top: $arrow-offset;
    left: 50%;
    transform: translateX(-50%);
    flex-direction: column;
    display: none;
  }

  &.down {
    bottom: $arrow-offset;
    left: 50%;
    transform: translateX(-50%);
    flex-direction: column-reverse;
  }

  &.right {
    right: $arrow-offset;
    top: 50%;
    transform: translateY(-50%);
    flex-direction: row-reverse;
  }

  &.left {
    left: $arrow-offset;
    top: 50%;
    transform: translateY(-50%);
    flex-direction: row;
  }

  .arrow {
    @include size($arrow-size);
    color: $white;
    stroke-width: $arrow-width;
    flex-shrink: 0;
  }

  .label {
    color: white;
    white-space: nowrap;
    text-transform: uppercase;
    display: none;
    @include mobile {
      display: none;
    }
  }
}
</style>
