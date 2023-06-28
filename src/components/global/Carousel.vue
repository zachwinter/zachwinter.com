<template>
  <section>
    <slot />
  </section>
</template>

<style lang="scss" scoped>
section {
  @include size(calc(100%), 100%);
  @include scroll-bar;
  will-change: transform;
  transition: var(--page-transition);
  scroll-snap-type: y mandatory;
  overflow-y: scroll;

  :deep(> *) {
    scroll-snap-align: top;
  }
}
</style>
