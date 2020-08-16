<template lang="pug">
h1(@transitionend="onTransitionEnd" :class="{ visible: textVisible }") #[span(v-if="text.length") /] {{ text }} &nbsp;
</template>

<script>
export default {
  data: () => ({
    text: '',
    textVisible: false,
    nextText: null,
    initialized: false
  }),
  watch: {
    '$route' ({ name }) {
      if (name === 'Home') return
      this.nextText = name
      this.textVisible = false
    }
  },
  async mounted () {
    if (this.$route.name === 'Home') {
      this.textVisible = true
      return
    }
    await this.$nextTick()
    this.text = this.$route.name
    this.textVisible = true
  },
  methods: {
    async onTransitionEnd () {
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
  @include position(fixed, $outer-padding null null calc(#{$logo-size} + #{$outer-padding} + #{notch(left)}));
  @include scale(font-size 1rem 1.5rem);
  text-transform: uppercase;
  font-weight: 700;
  z-index: 50;
  line-height: $logo-size;
  opacity: 0;
  transition: opacity $page-transition-duration/2 $base-easing, transform $page-transition-duration/2 $base-easing;
  display: block;

  span {
    font-weight: 300;
    padding-right: 10px;
  }

  &.visible {
    transform: scale(1);
    opacity: 1;
  }


  @include mobile-portrait { display: none; }
  
  @include mobile-landscape {
    @include position(fixed, $outer-padding null null calc(#{$mobile-logo-size} + #{$outer-padding} + #{notch(left)}));
    line-height: $mobile-logo-size;
  }
}  
</style>