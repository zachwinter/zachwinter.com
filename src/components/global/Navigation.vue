<template lang="pug">
nav(ref="container")
  IconButton(icon="chevron-up" text-position="bottom" :class="{ visible: previousVisible }" @click="previous" :text="previousText")
  IconButton(icon="chevron-down" text-position="top" :class="{ visible: nextVisible }" @click="next" :text="nextText")
</template>

<script>
import IconButton from '@/components/common/IconButton'
import { bind } from '@/store/util'

const DELTA = 50

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
      this.touchStart = touch.clientY
    },

    onTouchMove ({ touches }) {
      const touch = touches[0]
      this.touchEnd = touch.clientY
    },

    onTouchEnd () {
      if (this.touchEnd === null) return
      const deltaY = this.touchEnd - this.touchStart
      if (deltaY > DELTA) this.previous()
      if (deltaY < -DELTA) this.next()
      this.touchStart = null
      this.touchEnd = null
    },

    onMouseWheel ({ deltaY }) {
      if (deltaY < -DELTA) this.previous()
      if (deltaY > DELTA) this.next()
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
  0% { transform: translateY(0px) translateX(-50%); }
  50% { transform: translateY(10px) translateX(-50%); }
  100% { transform: translateY(0px) translateX(-50%); }
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
  z-index: 20;
}

.icon-button:nth-child(2) {
  @include position(absolute, null null $outer-padding 50%);
  transform: translateX(-50%);
  z-index: 20;
}
</style>