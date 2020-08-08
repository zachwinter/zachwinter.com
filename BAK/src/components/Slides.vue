<template lang="pug">
.slides(ref="container")
  .transform(:style="{ transform }" @transitionend="onTransitionEnd")
    Slide(
      v-for="({ src, song, artist }, i) in slides"
      :key="i"
      :src="src"
      :song="song"
      :artist="artist"
      :index="i"
    )
</template>

<script>
import { mapState } from 'vuex'
import { SET_TOTAL_SLIDES, SET_TRANSITIONING } from '@/store/mutation-types'
import Slide from '@/components/Slide' 
import swipe from '@/mixins/swipe'

export default {
  mixins: [swipe],
  components: {
    Slide
  },
  data: () => ({
    slides: [
      {
        src: 'https://s3-us-west-1.amazonaws.com/zachwinter.com/sunlight.mp4',
        song: 'Sunlight',
        artist: 'Tune-Yards'
      },
      {
        src: 'https://s3-us-west-1.amazonaws.com/zachwinter.com/anodyne.mp4',
        song: 'Me & Anodyne',
        artist: 'Hundred Waters'
      },
      {
        src: 'https://s3-us-west-1.amazonaws.com/zachwinter.com/canada.mp4',
        song: 'Chromakey Dreamcoast',
        artist: 'Boards of Canada'
      },
      {
        src: 'https://s3-us-west-1.amazonaws.com/zachwinter.com/dance.mp4',
        song: 'Dance Yrself Clean',
        artist: 'LCD Soundsystem'
      },
      {
        src: 'https://s3-us-west-1.amazonaws.com/zachwinter.com/harder.mp4',
        song: 'Harder, Better, Faster, Stronger',
        artist: 'Daft Punk'
      },
      {
        src: 'https://s3-us-west-1.amazonaws.com/zachwinter.com/crystal.mp4',
        song: 'Untrust Us',
        artist: 'Crystal Castles'
      }
    ]
  }),
  computed: {
    ...mapState(['activeSlide', 'transitioning', 'isMobile']),
    transform () {
      return `translateY(${this.activeSlide * -100}%)`
    }
  },
  mounted () {
    this.$store.commit(SET_TOTAL_SLIDES, this.$children.length)
    this.initSwipe(this.$refs.container)
  },
  methods: {
    onTransitionEnd (e) {
      if (e.target.classList.contains('transform')) {
        this.$store.commit(SET_TRANSITIONING, false)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.slides {
  @include size(100vh);
  overflow: hidden;
  margin: 0 auto;

  @include max-width(tablet) {
    @include size(100%);
  }

  @include mobile-landscape {
    @include size(100vh);
  }
}

.transform {
  height: 100%;
  transition: $slide-transition;
}
</style>