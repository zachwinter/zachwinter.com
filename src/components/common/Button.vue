<template>
  <button @click="$emit('click')"><slot /></button>
</template>

<script setup lang="ts">
const $emit = defineEmits(['click'])
</script>

<style lang="scss" scoped>
button {
  @include strip;
  // @include shadow;
  font-family: Bungee;
  border-radius: px(100);
  // border: 1px solid rgba(#bba2f3, 0.5);
  font-weight: 400;
  font-size: px(28);
  line-height: 100%;
  // padding: 0 px(30);
  height: var(--element-height);
  transition: all var(--hover-duration) var(--easing);
  background: transparent;
  color: var(--pink);
  cursor: pointer;
  // color: var(--gray);

  &:hover {
    background: var(--black);
  }

  &:active {
    transform: scale(0.8);
  }

  :deep(*) {
    text-decoration: none;
  }

  @include mobile-portrait {
    font-size: px(38);
    line-height: px(38);
  }
}
</style>
