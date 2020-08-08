<template lang="pug">
.app
  Logo
  Header
  transition(name="page")
    router-view
  Background
</template>

<script>
import Logo from '@/components/global/Logo'
import Background from '@/components/global/Background'
import Header from '@/components/global/Header'

export default {
  components: {
    Logo,
    Background,
    Header
  },
  mounted () {
    this.$store.dispatch('init')
  }
}
</script>

<style lang="scss">
// Typography
@import url('https://fonts.googleapis.com/css2?family=Dosis:wght@300;700&display=swap');

// Global Mixins
@include reset;

// Global Styles
html, body, .app {
  @include size(100%);
  overflow: hidden;
}

body {
  font-family: 'Dosis', sans-serif;
  font-weight: 300;
  background: rgba(0, 0, 0, .05);
}

strong {
  font-weight: 700;
}

img {
  width: 100%;
  display: block;
}

// Transitions
.intro-enter-active, .intro-leave-active { transition: transform $intro-duration $intro-easing, opacity $intro-duration $intro-easing; }
.intro-enter, .intro-leave-to { opacity: 0; }
.intro-enter { transform: translateX($intro-offset); }
.intro-leave-to { transform: translateX(-$intro-offset); }

.intro-down-enter-active, .intro-down-leave-active { transition: transform $intro-duration $intro-easing, opacity $intro-duration $intro-easing; }
.intro-down-enter, .intro-down-leave-to { opacity: 0; }
.intro-down-enter { transform: translateX($intro-offset); }
.intro-down-leave-to { transform: translateY($intro-offset); }

.fade-enter-active, .fade-leave-active { transition: opacity $base-transition $base-easing; }
.fade-enter, .fade-leave-to { opacity: 0; }

.page-enter-active, .page-leave-active { transition: all $page-transition-duration $base-easing; }
.page-enter, .page-leave-to { opacity: 0; transform: scale(.75); }
</style>