<template lang="pug">
.bullets
  .dot(v-for="(a, i) in new Array(total)" :key="i" :class="{ active: i === active }" @click="$emit('select', i)")
</template>

<script>
export default {
  props: {
    total: Number,
    active: Number
  }
}
</script>

<style lang="scss" scoped>
.bullets {
  @include position(absolute, null 0 #{-$base-margin} 0);
  @include flex;
}

.dot {
  @include size(15px);
  background: $black;
  border-radius: 100%;
  opacity: .2;
  transition: opacity $base-transition;
  margin: 0 3px;

  &.active { opacity: 1; }
}
</style>