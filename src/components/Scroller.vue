<template>
  <div class="scroller" :class="[axis]" ref="container">
    <slot></slot>
  </div>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    axis?: 'y' | 'x'
  }>(),
  {
    axis: 'y'
  }
)

const container = ref()

defineExpose({
  element: container
})
</script>

<style lang="scss" scoped>
.scroller {
  @include size(100%);
  @include hide-scroll-bar;
  scroll-behavior: smooth;

  :deep(> *) {
    scroll-snap-align: start;
  }
}

.y {
  overflow-y: scroll;
  scroll-snap-type: y mandatory;
}

.x {
  @include flex-row(start, start);
  flex-wrap: no-wrap;
  overflow-x: scroll;
  scroll-snap-type: x mandatory;
}
</style>
