<template>
  <section>
    <slot></slot>
  </section>
</template>

<style lang="scss" scoped>
section {
  @include size(100vw, 100vh);
  @include flex;
  @include scroll-bar;
  overflow-x: hidden;
}
</style>
