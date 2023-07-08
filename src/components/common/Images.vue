<template>
  <div class="container">
    <header>
      <i />
      <i />
      <i />
    </header>
    <section class="image-container">
      <img v-for="(image, i) in images" :key="i" :src="image" />
    </section>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  images: string[]
}>()
</script>

<style lang="scss" scoped>
$header-height: px(60);
$border: none; //px(5) solid rgba(0, 0, 0, .1);

.container {
  @include size(65vw, calc((9 / 16 * 65vw) + #{$header-height}));
  @include shadow;
  position: realtive;
  flex-shrink: 0;
  padding-top: $header-height;
  border-bottom-left-radius: var(--border-radius);
  overflow: hidden;
  border: $border;
  border-right: 0;
  border-top-left-radius: var(--border-radius);
  background: rgba(0, 0, 0, 0.8);
  overflow: hidden;
  will-change: transform;

  @include mobile-portrait {
    @include size(100%, auto);
    margin-right: 0;
    margin-top: var(--outer-padding);
    padding-left: 0;
    border-radius: var(--border-radius);
  }

  @include mobile-landscape {
    @include size(calc(50vw), calc((9 / 16 * calc(50vw)) + #{$header-height}));
    border-top-right-radius: var(--border-radius);
    border-bottom-right-radius: var(--border-radius);
    margin-right: notch(right);
  }
}

header {
  @include size(100%, $header-height);
  @include position(absolute, 0 0 null 0);
  @include flex(center, flex-start, row);
  gap: calc(var(--base-spacer) / 2);
  z-index: 10;
  padding-left: var(--base-spacer);
}

section {
  @include flex(flex-start, flex-start, row);
  @include size(100%);
  @include scroll-bar;
  overflow-x: scroll;
  overflow-y: hidden;
  will-change: transform, opacity;
  background: var(--black);
  padding: 0;

  img {
    @include size(100%, auto);
    display: block;
    margin: 0;

    &:nth-child(1) {
      position: relative;
    }
  }

  // @include mobile-landscape {
  //   img {
  //     @include size(auto, 100%);
  //   }
  // }
}

i {
  @include size(px(20));
  display: block;
  border-radius: 100%;

  &:first-child {
    background: var(--red);
  }

  &:nth-child(2) {
    background: var(--yellow);
  }

  &:nth-child(3) {
    background: var(--green);
  }
}

.image-container {
  scroll-snap-type: x mandatory;

  :deep(> *) {
    scroll-snap-align: start;
  }
}
</style>
