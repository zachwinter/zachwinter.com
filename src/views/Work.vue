<template lang="pug">
.work(ref="container")
  Kaleidosync(:active="index === 0" :index="0" @transition-end="onTransitionEnd")
  Covid(:active="index === 1" :index="1" @transition-end="onTransitionEnd")
  Sketches(:active="index === 2" :index="2" @transition-end="onTransitionEnd")
</template>

<script>
import Kaleidosync from '@/components/work/Kaleidosync'
import Covid from '@/components/work/Covid'
import Sketches from '@/components/work/Sketches'
import { bind, dualBind } from '@/store/util'
import { pause } from '@/util/timing'

export default {
  components: {
    Kaleidosync,
    Covid,
    Sketches
  },
  data: () => ({
    last: 2
  }),
  computed: {
    ...bind(['nav/previous', 'nav/next']),
    ...dualBind('work/index'),
    nav () {
      return {
        previous: {
          visible: this.index !== 0,
          text: null
        },
        next: {
          visible: true,
          text: this.index === this.last ? 'Contact' : null
        }
      }
    }
  },
  watch: {
    previous () {
      if (this.index === 0) return
      this.index--
      this.$store.dispatch('background/previous')
      this.$store.commit(`nav/SET_TRANSITIONING`, true)
    },
    next () {
      if (this.index === this.last) return this.$router.push({ name: 'Contact' })
      this.index++
      this.$store.dispatch('background/next')
      this.$store.commit(`nav/SET_TRANSITIONING`, true)
    },
    nav: {
      handler () {
        this.$store.dispatch('nav/set', this.nav)
      },
      immediate: true
    }
  },
  methods: {
    async onTransitionEnd () {
      await pause(100)
      this.$store.commit(`nav/SET_TRANSITIONING`, false)
    }
  }
}
</script>

<style lang="scss" scoped>
.work {
  @include page;
  @include flex(flex-start, flex-start, column);
}
</style>