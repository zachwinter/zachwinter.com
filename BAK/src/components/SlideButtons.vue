<template lang="pug">
.outer
  .inner
    div
      button(:disabled="activeSlide === 0" @click="$store.dispatch('previous')").previous: Chevron
      button(:disabled="activeSlide === totalSlides - 1" @click="$store.dispatch('next')").next: Chevron
</template>

<script>
import { mapState } from 'vuex'
import Chevron from '@/assets/svg/chevron.svg'

export default {
  components: { Chevron },
  computed: mapState(['activeSlide', 'totalSlides'])
}
</script>

<style lang="scss" scoped>
.outer {
  @include position(fixed, 0 0 0 0);
  @include size(100vh, 100vh);
  @include flex;
  z-index: 0;
  margin: 0 auto;
  z-index: -1;
}

.inner {
  @include position(absolute, 0 null 0 calc(100% + 20px));
  @include flex(center, center, column);

  @include max-width(mobile) {
    @include position(absolute, 50% auto auto 0);
    @include size(100vw, calc(100vw + #{$base-margin*2}));
    @include flex(center, space-between, column);
    transform: translateY(-50%);

    div {
      @include flex(center, space-between, column);
      height: 100%;
    }
  }
}

button {
  // position: absolute;
  background: transparent;
  border: 0;
  outline: 0;
  opacity: .3;

  &:disabled {
    opacity: .1;
  }
}

svg {
  @include size($base-margin/2);
  margin: $base-margin/4;
  display: block;
}

.previous {
  transform: rotate(180deg);
}
</style>