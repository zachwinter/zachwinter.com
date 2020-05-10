<template lang="pug">
main
  Slides 
  SlideButtons
</template>

<script>
import Slides from '@/components/Slides'
import SlideButtons from '@/components/SlideButtons'
import { SET_PLAYING } from '@/store/mutation-types'

export default {
  components: {
    Slides,
    SlideButtons
  },
  destroyed () {
    this.$store.commit(SET_PLAYING, false)
  }
}
</script> 