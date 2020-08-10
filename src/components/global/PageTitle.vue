<template lang="pug">
h1(@transitionend="onTransitionEnd" :class="{ visible: textVisible }") {{ text }} &nbsp;
</template>

<script>
export default {
  data: () => ({
    text: '',
    textVisible: true,
    nextText: null
  }),
  watch: {
    '$route' ({ name }) {
      this.nextText = name
      this.textVisible = false
    }
  },
  mounted () {
    this.nextText = this.$route.name
    this.textVisible = false
  },
  methods: {
    onTransitionEnd () {
      if (this.nextText) {
        this.text = this.nextText
        this.textVisible = true
      }
    }
  }
}
</script>

<style lang="scss" scoped>
h1 {
  @include position(fixed, $outer-padding null null #{$logo-size + ($outer-padding * 2)});
  @include scale(font-size 1rem 1.5rem);
  text-transform: uppercase;
  font-weight: 700;
  z-index: 50;
  line-height: $logo-size;
  opacity: 0;
  transition: opacity $base-transition;

  &.visible { opacity: 1; }

  @include max-width(mobile) {
    @include position(fixed, #{$mobile-logo-size + ($outer-padding * 1.5)} null null $outer-padding);
    @include size($mobile-logo-size, auto);
    line-height: 1;
    text-align: center;
  }
}
</style>