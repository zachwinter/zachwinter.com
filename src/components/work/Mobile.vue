<template lang="pug">
.mobile(:class="{ active, landscape, portrait: !landscape }")
  slot
</template>

<script>
export default {
  props: {
    active: Boolean,
    landscape: Boolean
  }
}
</script>

<style lang="scss" scoped>
$padding: 55px;

.mobile {
  @include size(100%, auto);
  max-width: 375px + 20px;
  position: absolute;
  border-radius: 20px;
  // overflow: hidden;
  padding: $padding 5px;
  background: rgba($black, .8);
  // box-shadow: $box-shadow;
  opacity: 0;
  transition: all $work-item-transition;
  // will-change: transform, opacity;
  z-index: 0;
  transform: scale(.7);

  &.active {
    transform: scale(.9);
    opacity: 1;
    z-index: 1;

    @include min-width(large) {
      transform: scale(1);
    }
  }

  &:before {
    @include position(absolute, ($padding / 2 - 4px) null null 50%);
    @include size(30%, 8px);
    transform: translateX(-50%);
    background: rgba($white, .2);
    border-radius: 100px;
    content: '';
  }

  &:after {
    @include position(absolute, null 0 ($padding / 2 - 20px) 0);
    @include size(40px);
    background: rgba($white, .2);
    border-radius: 100px;
    margin: 0 auto;
    content: '';
  }

  &.landscape {
    transform: scale(1);
    max-width: 812px + ($padding*2);
    padding: 5px $padding;


    &:before {
      @include position(absolute, 50% null null ($padding / 2 - 4px));
      @include size(8px, 30%);
      transform: translateY(-50%);
    }

    &:after {
      @include position(absolute, 50% ($padding / 2 - 20px) auto auto);
      transform: translateY(-50%);
      margin: 0;
    }
  }

  @include mobile {
    padding: 0;
    background: transparent;
    border-radius: 0;
    // max-width: 100%;

    &:before, &:after { display: none; }

    &.landscape {
      // max-width: 100%;
      padding: 0;

      &:before, &:after {
        padding: 0;
        display: none;
      }
    }
  }

  @include mobile-landscape {
    @include size(auto, 100%);
    max-width: 100%;
    margin: 0;
    padding: 0;

    &.landscape {
      @include size(auto);
      max-width: 100%;
      margin: 0;
      padding: 0;
    }
  }
}
</style>