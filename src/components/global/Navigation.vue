<template lang="pug">
nav(ref="container")
  IconButton(icon="chevron-up" text-position="bottom" :class="{ visible: previousVisible }" @click="previous" :text="previousText")
  IconButton(icon="chevron-down" text-position="top" :class="{ visible: nextVisible }" @click="next" :text="nextText")
</template>

<script>
import IconButton from '@/components/common/IconButton'
import { bind } from '@/store/util'

const Y_DELTA = 20
const X_DELTA = 40
const TIME_DELTA = 300

export default {
  props: {
    index: Number,
    last: Number
  },
  components: { IconButton },
  computed: bind([
    'nav/previousVisible',
    'nav/nextVisible',
    'nav/previousText',
    'nav/nextText'
  ]),
  mounted () {
    this.initSwipe(document.body)
  },
  methods: {
    initSwipe (container) {
      container.addEventListener('touchstart', this.onTouchStart.bind(this))
      container.addEventListener('touchend', this.onTouchEnd.bind(this))
      container.addEventListener('touchmove', this.onTouchMove.bind(this))
      container.addEventListener('wheel', this.onMouseWheel.bind(this))
    },

    onTouchStart ({ touches }) {
      const touch = touches[0]
      this.touchStartY = touch.clientY
      this.touchStartX = touch.clientX
      this.touchStartTime = window.performance.now()
    },

    onTouchMove ({ touches }) {
      const touch = touches[0]
      this.touchEndY = touch.clientY
      this.touchEndX = touch.clientX
    },

    onTouchEnd () {
      if (this.touchEndY === null) return
      const deltaY = this.touchEndY - this.touchStartY
      const deltaX = this.touchEndX - this.touchStartX
      if (deltaX > X_DELTA) return
      const deltaTime = window.performance.now() - this.touchStartTime
      if (deltaY > Y_DELTA && deltaTime < TIME_DELTA) this.previous()
      if (deltaY < -Y_DELTA && deltaTime < TIME_DELTA) this.next()
      this.touchStartY = null
      this.touchEndY = null
      this.touchStartX = null
      this.touchEndX = null
    },

    onMouseWheel ({ deltaY }) {
      if (deltaY < -Y_DELTA) this.previous()
      if (deltaY > Y_DELTA) this.next()
    },

    previous () {
      this.$store.dispatch('nav/previousClicked')
    },

    next () {
      this.$store.dispatch('nav/nextClicked') 
    }
  }
}
</script>

<style lang="scss" scoped>
nav {
  width: 100%;
  z-index: 1;
}

@keyframes bobble {
  0% { transform: translateY(-5px) translateX(-50%); }
  50% { transform: translateY(5px) translateX(-50%); }
  100% { transform: translateY(-5px) translateX(-50%); }
}

.icon-button {
  opacity: 0;
  pointer-events: none;
  transition: opacity $base-transition;
  animation: bobble 2s $base-easing infinite;
  transform: translateX(-50%);
  z-index: 20;

  &.visible {
    opacity: 1;
    pointer-events: all;
  }
}

.icon-button:nth-child(1) {
  @include position(absolute, $outer-padding null null 50%);
  @include max-width(tablet) {
    @include position(absolute, $outer-padding/2 null null 50%);
  }
}

.icon-button:nth-child(2) {
  @include position(absolute, null null $outer-padding 50%);

  @include max-width(tablet) {
    @include position(absolute, null null $outer-padding/2 50%);
  }
}
</style>