<template lang="pug">
Canvas(ref="canvas")
</template>

<script>
import Canvas from '@/components/Canvas'
// import interpolateNumber from 'd3-interpolate/src/number'
import interpolateBasis from 'd3-interpolate/src/basis'
import { polygon, drawShape } from '@/util/canvas'
import { adjustColor } from '@/util/color'
import interpolateRgb from 'd3-interpolate/src/rgb'

export default {
  props: {
    mouse: {
      type: Object,
      required: true
    },
    background: {
      type: String,
      required: true
    }
  },

  components: { Canvas },

  data: () => ({
    queue: [],
    queueLength: 60,
    actualColor: null
  }),

  computed: {
    color () {
      return adjustColor(this.background, .4)
    }
  },

  watch: {
    background: {
      handler (val, old) {
        const a = c => adjustColor(c, .4)
        this.iColor = interpolateRgb(a(old || val), a(val))
        this.colorNow = window.performance.now()
      },
      immediate: true
    }
  },

  mounted () {
    requestAnimationFrame(this.paint.bind(this))
  },

  methods: {
    processMouseCoordinates () {
      this.queue.unshift({...this.mouse})
      while (this.queue.length > this.queueLength) this.queue.pop()
    },

    paint (now) {
    const { ctx, width, height } = this.$refs.canvas
      this.processMouseCoordinates({ width, height })
      requestAnimationFrame(this.paint.bind(this))
      if (!ctx) return
      ctx.clearRect(0, 0, width, height)
      this.colorNow = this.colorNow || now
      const colorProgress = this.colorNow ? Math.min(Math.max((now - this.colorNow) / 150, 0), 1) : 1
      ctx.strokeStyle = this.iColor(colorProgress)
      ctx.lineWidth = 1
      const iSize = interpolateBasis([0, 1, 0])
      this.queue.forEach(({ x, y }, i) => {
        const progress = this.queue.length / (this.queue.length*i)
        const size = iSize(progress)
        const constant = 5000
        const actual = size * constant
        ctx.save()
        ctx.lineWidth = 3
        ctx.translate(width/2, height/2)
        ctx.rotate(now/2500 + 5 * i * Math.PI / 180)
        ctx.scale(progress, progress)
        ctx.translate(-width/2, -height/2)
        ctx.beginPath()
        const vertices = polygon(5, actual, x, y, i)
        drawShape(ctx, vertices)
        ctx.closePath()
        ctx.stroke()
        ctx.restore()
      })
    }
  }
}
</script>

<style lang="scss" scoped>

</style>