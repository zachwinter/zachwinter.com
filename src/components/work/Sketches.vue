<template lang="pug">
.sketches(:class="{ active }" @transitionend="$emit('transition-end')")
  WorkItem(:total="animations.length" :active="active" :landscape="true" :ctas="ctas")
    template(v-slot:content)
      h2: span Audio-Reactive Sketches
      p: span Powered by WebGL and the Echo Nest.
    template(v-slot:showcase)
      Swiper(:cleanup-styles-on-destroy="false" @slideChange="onSlideChange" ref="swiper" :options="{ grabCursor: true }")
        SwiperSlide(v-for="({ src, song, artist }, i) in animations" :key="i")
          VideoPlayer(:src="src" :active="i === index" ref="player" @play="onPlay(i)" @pause="onPause(i)")
          .song: span #[strong {{ song }}] by {{ artist }}
      Bullets(:total="animations.length" :active="index" @select="selectSlide" :side="true" :static="true")
</template>

<script>
import Bullets from '@/components/work/Bullets'
import workItem from '@/mixins/work-item'
import VideoPlayer from '@/components/common/VideoPlayer'
import { Swiper, SwiperSlide } from 'vue-awesome-swiper'
import { bind } from '@/store/util'
import 'swiper/swiper-bundle.css'

export default {
  mixins: [workItem],
  props: {
    active: Boolean
  },
  components: {
    Swiper,
    SwiperSlide,
    VideoPlayer,
    Bullets
  },
  data: () => ({
    index: 0,
    playing: false,
    ctas: {
      href: 'https://instagram.com/zachary.io',
      target: 'instagram',
      text: 'View Instagram',
      toggle: false,
      margin: true
    },
    animations: [{
      src: 'https://s3-us-west-1.amazonaws.com/zachwinter.com/melody.mp4',
      song: 'Bisou Magique',
      artist: `Melody's Echo Chamber`
    }, {
      src: 'https://s3-us-west-1.amazonaws.com/zachwinter.com/electric.mp4',
      song: 'Electric Feel',
      artist: 'MGMT'
    }, {
      src: 'https://s3-us-west-1.amazonaws.com/zachwinter.com/eilish.mp4',
      song: 'You Should See Me In A Crown',
      artist: 'Billie Eilish'
    }, {
      src: 'https://s3-us-west-1.amazonaws.com/zachwinter.com/harder.mp4',
      song: 'Harder, Better, Faster, Stronger',
      artist: 'Daft Punk'
    }, {
      src: 'https://s3-us-west-1.amazonaws.com/zachwinter.com/december.mp4',
      song: 'December',
      artist: 'Braids'
    }, {
      src: 'https://s3-us-west-1.amazonaws.com/zachwinter.com/sky.mp4',
      song: 'What Would I Want? Sky',
      artist: 'Animal Collective'
    }, {
      src: 'https://s3-us-west-1.amazonaws.com/zachwinter.com/high.mp4',
      song: "High Road",
      artist: "Angel Deradoorian"
    }],
    options: {
      grabCursor: true
    }
  }),
  computed: bind('ui/mobile'),
  watch: {
    active () {
      this.$refs.player.forEach(p => p.pause())
    }
  },
  methods: {
    onSlideChange ({ activeIndex }) {
      this.index = activeIndex
      this.$refs.player.forEach(p => p.pause())
      this.$refs.swiper.$swiper.slideTo(this.index)
      if (this.playing && this.$refs.player[this.index] && !this.mobile) this.$refs.player[this.index].play()
    },
    selectSlide (i) {
      this.onSlideChange({ activeIndex: i })
    },
    onPlay (i) {
      if (i === this.index) this.playing = true
    },
    onPause (i) {
      if (i === this.index) this.playing = false
    }
  },
  beforeDestroy () {
    if (this.$refs.player) this.$refs.player.forEach(p => p.pause())
  }
}
</script>

<style lang="scss" scoped>
.sketches {
  @include size(100%);
}

.song {
  font-size: 1rem;
  text-transform: uppercase;
  text-align: center;
  margin-top: $base-margin / 2;
}

.outer-container {
  position: relative;
}

$base: 500px;
$large: 700px;
$m-p: calc(100vw - #{2 * $outer-padding});
$m-l: calc(90vh - #{2 * $outer-padding});

.swiper-container {
  @include size($base);
  @include min-width(large) { @include size($large); }
  @include mobile-portrait { @include size($m-p); }
  @include mobile-landscape {
    @include size($m-l);
    margin-right: 0;
    margin-left: auto;
  }
}

.bullets {
  position: static;
  margin-top: 5px;

  @include size($base, auto);
  @include min-width(large) { @include size($large, auto); }
  @include mobile-portrait { @include size($m-p, auto); }
  @include mobile-landscape {
    @include size($m-l, auto);
    margin-right: 0;
    margin-left: auto;
  }
}

.song {
  @include position(absolute, null 0 0 0);
  @include flex;
  @include scale(font-size .6em .8em);
  display: block;
  z-index: 20;
  margin: 0;

  * { line-height: 30px; }

  span {
    position: relative;
    z-index: 1;
    padding: 0 0 $base-margin / 2 0;
    color: $white;
    text-shadow: 1px 1px 0px rgba($black, .3);
    margin: 0;
  }

  &:before {
    @include position(absolute, null 0 0 0);
    @include size(100%, 30px);
    content: '';
    z-index: 0;
    background: rgba($black, .5);
  }
}

.video-container {
  @include size(100%, auto);

  @include mobile-landscape {
    @include size(auto, 100%);
  }
}

.content p a {
  @include strip;
  color: $red;
}
</style>