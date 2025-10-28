<template>
  <div class="scroller">
    <slot></slot>
  </div>
</template>

<style lang="scss" scoped>
.scroller {
  @include size(100%);
  overflow-y: scroll;
  scroll-snap-type: y mandatory;

  :deep(> *) {
    scroll-snap-align: start;
  }
}
</style>
