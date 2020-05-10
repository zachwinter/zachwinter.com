<template lang="pug">
.app
  Header
  transition(name="page")
    router-view
</template>

<script>
import Header from '@/components/Header'

export default {
  components: { Header },
  mounted () {
    window.addEventListener('resize', () => {
      this.$store.dispatch('detectMobile')
    })
  }
}
</script>

<style lang="scss">
@import url('https://fonts.googleapis.com/css2?family=PT+Sans+Narrow:wght@400;700&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Dosis:wght@300;700&display=swap');

*, *:before, *:after {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

@include transitions;

html, body, main, .app {
  height: 100%;
}

main {
  @include position(fixed, 0 0 0 0);
}

body {
  background: rgba(0, 0, 0, .05);
  font-family: 'Dosis', sans-serif;
  font-weight: 300;

  * { 
    font-family: inherit;
    font-weight: inherit;
  }
}
</style>
