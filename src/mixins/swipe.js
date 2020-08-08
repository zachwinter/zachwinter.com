const DELTA = 30

export default {
  data: () => ({
    touchStart: 0,
    touchEnd: 0,
    isScrolling: false
  }),

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
      if (deltaY > DELTA) {
        this.$emit('previous')
        if (typeof this.previous === 'function') this.previous()
      }
      if (deltaY < -DELTA) {
        this.$emit('next')
        if (typeof this.next === 'function') this.next()
      }
      this.touchStart = null
      this.touchEnd = null
    },

    onMouseWheel ({ deltaY }) {
      if (this.swipeInProgress) {
        if (Math.abs(deltaY) < DELTA) {
          this.swipeInProgress = false
        } else {
          return
        }
      }

      if (deltaY > DELTA) {
        this.swipeInProgress = true
        this.$emit('next')
        if (typeof this.next === 'function') this.next()
      }
      if (deltaY < -DELTA) {
        this.swipeInProgress = true
        this.$emit('previous')
        if (typeof this.previous === 'function') this.previous()
      }
    }
  }
}