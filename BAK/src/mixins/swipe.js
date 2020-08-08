export default {
  data: () => ({
    touchStart: null,
    touchEnd: null
  }),
  methods: {
    initSwipe (container) {
      container.addEventListener('touchstart', this.onTouchStart.bind(this))
      container.addEventListener('touchend', this.onTouchEnd.bind(this))
      container.addEventListener('touchmove', this.onTouchMove.bind(this))
      container.addEventListener('mousewheel', this.onMouseWheel.bind(this))
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
      if (deltaY > 30) this.$store.dispatch('previous')
      if (deltaY < -30) this.$store.dispatch('next')
      this.touchStart = null
      this.touchEnd = null
    },

    onMouseWheel ({ deltaY }) {
      if (deltaY > 30) this.$store.dispatch('next')
      if (deltaY < -30) this.$store.dispatch('previous')
    }
  }
}