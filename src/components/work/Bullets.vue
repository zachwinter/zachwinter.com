<template lang="pug">
.bullets(:class="{ static: static }")
  .dot(v-for="(a, i) in new Array(total)" :key="i" :class="{ active: i === active }" @click="$emit('select', i)")
</template>

<script>
export default {
  props: { 
    total: Number,
    active: Number,
    static: {
      type: Boolean,
      default: false
    }
  }
}
</script>

<style lang="scss" scoped>
.bullets {
  @include position(absolute, null 0 #{-20px} 0);
  @include flex;

  // &.static {
  //   @include position(absolute, null 0 #{0} 0);
  //   // position: static;
  //   // margin-top: $base-margin;

  //   @include mobile-landscape {
  //     width: calc(90vh - #{2 * $outer-padding});
  //   }
  // }
}

.dot {
  @include size(15px);
  background: $black;
  border-radius: 100%;
  opacity: .2;
  transition: opacity $base-transition;
  margin: 0 3px;

  &.active { opacity: 1; }

  .dark  & {
    background: $white;
  }
}
</style>