<template>
  <a :href="href" :target="target"
    ><Button><slot></slot></Button
  ></a>
</template>

<script setup lang="ts">
defineProps<{
  href?: string
  target?: string
}>()
</script>

<style lang="scss" scoped>
a {
  cursor: pointer;
  font-family: 'Red Hat Mono';

  :deep(*) {
    font-family: inherit;
  }

  &:hover, &:hover :deep(*) {
    color: var(--blue) !important;
  }
}
</style>