<template>
  <section>
    <slot></slot>
  </section>
</template>

<style lang="scss" scoped>
section {
  @include size(100vw, 100%);
  @include flex;
  @include scroll-bar;
  overflow-x: hidden;
  flex-shrink: 0;
}
</style>
