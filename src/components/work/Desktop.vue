<template lang="pug">
.desktop(:class="{ active }")
  .chrome
    div
      .dot
      .dot
      .dot
  .slot
    slot
</template>

<script>
export default {
  props: {
    active: Boolean
  }
}
</script>

<style lang="scss" scoped>
$chrome-size: 40px;
$border-radius: 10px;

.slot {
  position: relative;
}

.desktop {
  position: absolute;
  width: 100%;
  background: $white;
  box-shadow: $box-shadow;
  border-radius: $border-radius;
  opacity: 0;
  transition: all $work-item-transition;
  // will-change: transform, opacity;
  transform: scale(.8);
  z-index: 0;

  &.active {
    transform: scale(1);
    opacity: 1;
    z-index: 1;
  }
}

.chrome {
  @include size(100%, $chrome-size);
  min-height: $chrome-size;
  display: flex;
  padding: 0 1rem;
  background: $gray;
  position: relative;
  border-top-right-radius: $border-radius;
  border-top-left-radius: $border-radius;

  > div { @include flex; }

  .dark & { background: $black; }
}

.dot {
  @include size(12px);
  background: $blue;
  border-radius: 100%;
  margin: 0;
  margin-right: 6px; 
}

.dot:nth-of-type(1) { background: $pink; }
.dot:nth-of-type(2) { background: $yellow; }
.dot:nth-of-type(3) { background: $green; }
</style>