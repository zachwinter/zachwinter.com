<template>
  <component class="pill" :is="is">
    <slot />
  </component>
</template>

<script setup lang="ts">
const { is = "div" } = defineProps<{
  is?: string;
}>();
</script>

<style lang="scss" scoped>
.pill {
  @include flex-column(center, start);
  @include box(0 1.5 0 0.75, 0);
  height: 2rem;
  width: fit-content;
  background: var(--black);
  border-radius: 100px;
  font-size: 0.9rem;
  font-weight: 300;
  color: var(--light);

  :deep(*) {
    white-space: nowrap;
  }
}
</style>
