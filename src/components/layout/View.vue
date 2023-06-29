<template>
  <main ref="view" class="view">
    <slot />
  </main>
</template>

<script lang="ts" setup>
const view = ref<HTMLElement | null>(null)
</script>

<style lang="scss" scoped>
main {
  @include position(fixed, 0 null null 0);
  @include size(100vw, 100vh);
  @include scroll-bar;
  overflow-y: scroll;
}
</style>
