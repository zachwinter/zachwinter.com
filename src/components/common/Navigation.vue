<template lang="pug">
nav(ref="container")
  IconButton(:class="{ visible: index !== 0 }" icon="chevron-up" @click="$emit('previous')").previous
  IconButton(:class="{ visible: index !== last }" icon="chevron-down" @click="$emit('next')").next
</template>

<script>
import IconButton from '@/components/common/IconButton'
import swipe from '@/mixins/swipe'

export default {
  mixins: [swipe],
  props: {
    index: Number,
    last: Number
  },
  components: { IconButton },
  mounted () {
    this.initSwipe(this.$refs.container)
  }
}
</script>

<style lang="scss" scoped>
nav {
  width: 100%;
  z-index: 1;
}

@keyframes bobble {
  0% {
    transform: translateY(0px) translateX(-50%);
  }

  50% {
    transform: translateY(10px) translateX(-50%);
  }

  100% {
    transform: translateY(0px) translateX(-50%);
  }
}

.icon-button {
  opacity: 0;
  pointer-events: none;
  transition: opacity $base-transition;
  animation: bobble 2s $base-easing infinite;

  &.visible {
    opacity: 1;
    pointer-events: all;
  }
}

.icon-button:nth-child(1) {
  @include position(absolute, $outer-padding null null 50%);
  transform: translateX(-50%);
  z-index: 50;
}

.icon-button:nth-child(2) {
  @include position(absolute, null null $outer-padding 50%);
  transform: translateX(-50%);
  z-index: 50;
}
</style>