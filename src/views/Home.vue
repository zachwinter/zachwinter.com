<template lang="pug">
.home
  .intro
    transition(name="intro")
      h1(v-if="index === 0") #[strong Hi!] I'm Zach.
    transition(name="intro-down")
      h2(v-if="index === 1") I'm a front-end web specialist.
</template>

<script>
import { pause } from '@/util/timing'

export default {
  data: () => ({
    index: null
  }),
  mounted () {
    this.setNav()
    this.initText()
  },
  methods: {
    setNav () {
      this.$store.dispatch('nav/set', {
        previous: {
          visible: false,
          text: null
        },
        next: {
          visible: false,
          text: null
        }
      })
    },
    async initText () {
      this.index = 0
      await pause(2500)
      this.index++
      await pause(3500)
      this.$store.commit(`ui/SET_LOGO_VISIBLE`, true)
      this.$router.push({ name: 'Work' })
    }
  }
}
</script>

<style lang="scss" scoped>
.home {
  @include page;
}

.intro {
  @include size(100%);
  @include flex;
  position: relative;
  text-align: center;
}

.intro > * {
  @include size(100%, auto);
  position: absolute;
  // will-change: opacity;
}

h1 {
  @include scale(font-size 3rem 5rem);
}

h2 {
  @include scale(font-size 2rem 4rem);
  padding: 0 $outer-padding;
}
</style>