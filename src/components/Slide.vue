<template lang="pug">
.slide(:class="{ active }")
  .meta
    p.track #[span.song {{song}}] #[i by] #[span.artist {{ artist }}]
    p.total {{ index + 1 }} / {{ totalSlides }}
  VideoPlayer(:src="src" ref="player" :active="active" @play="onPlay" @pause="onPause")
</template>

<script>
import { mapState } from 'vuex'
import { SET_PLAYING } from '@/store/mutation-types'
import VideoPlayer from '@/components/VideoPlayer'

export default {
  props: {
    src: {
      type: String,
      required: true
    },

    artist: {
      type: String,
      required: true
    },

    song: {
      type: String,
      required: true
    },

    index: {
      type: Number,
      required: true
    }
  },
  components: {
    VideoPlayer
  },
  computed: {
    ...mapState([
      'activeSlide', 
      'playing', 
      'totalSlides',
      'isMobile'
    ]),
    active () {
      return this.activeSlide === this.index
    },
    poster () {
      return this.src.replace('.mp4', '.jpg')
    }
  },
  watch: {
    active (val) {
      if (!this.$refs.player) return
      
      if (val && this.playing) {
        this.$refs.player.play()
      }

      if (!val) {
        this.$refs.player.pause()
        this.$refs.player.showVideo = false
      }
    }
  },
  methods: {
    onPlay () {
      this.$store.commit(SET_PLAYING, true)
    },

    onPause () {
      this.$store.commit(SET_PLAYING, false)
    }
  }
}
</script>

<style lang="scss" scoped>
.slide {
  @include size(100vh);
  margin: 0 auto;
  padding: $base-margin;
  background: white;
  color: black;
  transition: $slide-transition;
  transform: scale(.5);
  will-change: transform, opacity;
  opacity: 0;
  
  @include max-width(tablet) {
    @include size(100%);
    padding: 0;
  }

  &.active {
    transform: scale(1);
    opacity: 1;
  }
}

.meta {
  @include flex(center, space-between);
  @include position(absolute, 0 $base-margin null $base-margin);

  @include max-width(tablet) {
    @include position(absolute, auto $outer-padding $outer-padding $outer-padding);
    // @include flex(flex-end, space-between);
    p {
      padding: 0;
      text-align: right;
      line-height: 14px;
    }
  }
}

p {
  text-transform: uppercase;
  font-weight: 400;
  letter-spacing: .025em;
  text-align: right; 
  line-height: $base-margin;
}

.total {
  // @include position(absolute, 0 null null $base-margin);
  white-space: nowrap ;
}

.meta .track {
  @include max-width(tablet) {
    // @include position(absolute, null 0 0 0);
    padding: 0px 10px;
    line-height: 14px;
    text-align: right;
    z-index: 10;
    font-size: 10px;
    display: inline-block;
  }
}

.song, .artist, i {
    font-weight: 700;
    font-style: normal;
    background: rgba(255, 255, 255, .5);
    backdrop-filter: blur(5px);
    line-height: 14px;
    padding: 0 3px;
  @include max-width(tablet) {
    display: inline-flex;
    text-align: right;
  }
}

i {
  opacity: .5;
  font-weight: normal;
}
</style>