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
  @include size(100vw, 100vh);
  @include scroll-bar;
}
</style>
