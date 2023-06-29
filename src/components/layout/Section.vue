<template>
  <section>
    <slot></slot>
  </section>
</template>

<style lang="scss" scoped>
section {
  @include size(100vw, 100vh);
  @include flex(center, flex-start, row);
  @include scroll-bar;
}
</style>
