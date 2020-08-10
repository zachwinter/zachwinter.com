<template lang="pug">
.work(ref="container")
  Kaleidosync(:active="index === 0" :index="0" @transition-end="onTransitionEnd")
  Covid(:active="index === 1" :index="1" @transition-end="onTransitionEnd")
</template>

<script>
import Kaleidosync from '@/components/work/Kaleidosync'
import Covid from '@/components/work/Covid'
import { bind } from '@/store/util'
import { SET_TRANSITIONING } from '@/store/modules/nav'

export default {
  components: {
    Kaleidosync,
    Covid
  },
  data: () => ({
    index: 0
  }),
  computed: {
    ...bind(['nav/previous', 'nav/next']),
    nav () {
      return {
        previous: {
          visible: this.index !== 0,
          text: null
        },
        next: {
          visible: true,
          text: this.index === 1 ? 'Contact' : null
        }
      }
    }
  },
  watch: {
    previous () {
      if (this.index === 0) return
      this.index--
      this.$store.dispatch('background/previous')
      this.$store.commit(`nav/${SET_TRANSITIONING}`, true)
    },
    next () {
      if (this.index === 1) return this.$router.push({ name: 'Contact' })
      this.index++
      this.$store.dispatch('background/next')
      this.$store.commit(`nav/${SET_TRANSITIONING}`, true)
    },
    nav: {
      handler () {
        this.$store.dispatch('nav/set', this.nav)
      },
      immediate: true
    }
  },
  mounted () {
    this.$store.dispatch('ui/showElements')
  },
  methods: {
    onTransitionEnd () {
      this.$store.commit(`nav/${SET_TRANSITIONING}`, false)
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