<template lang="pug">
.work(ref="container")
  Kaleidosync(:active="index === 0" :index="0")
  Covid(:active="index === 1" :index="1")
  Navigation(:index="index" :last="last" @next="next" @previous="previous")
</template>

<script>
import swipe from '@/mixins/swipe'
import Kaleidosync from '@/components/work/Kaleidosync'
import Covid from '@/components/work/Covid'
import Navigation from '@/components/common/Navigation'

export default {
  mixins: [swipe],
  components: {
    Kaleidosync,
    Covid,
    Navigation
  },
  data: () => ({
    index: 0,
    last: 1
  }),
  mounted () {
    this.initSwipe(this.$refs.container)
  },
  methods: {
    next () {
      if (this.index === this.last) return
      this.index++
      this.$store.dispatch('background/scrollDown')
    },
    previous () {
      if (this.index === 0) return
      this.index--
      this.$store.dispatch('background/scrollUp')
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