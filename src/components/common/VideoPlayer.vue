<template lang="pug">
div(:class="{ playing }" @mousemove="onMouseMove").container
  video(ref="video" playsinline :poster="poster" preload="none" @timeupdate="onTimeUpdate")
   source(:src="src" type="video/mp4")
  transition(name="fade")
    IconButton(icon="play" v-if="!playing && !loading" @click="_play" color="white")
  transition(name="fade")
    IconButton(v-if="playing && showPause && !loading" icon="pause" @click="_pause" color="white")
  transition(name="fade")
    Loading(v-if="loading")
</template>

<script>
import IconButton from '@/components/common/IconButton'
import Loading from '@/components/common/Loading'

export default {
  props: {
    src: {
      type: String,
      required: true
    },
    active: {
      type: Boolean,
      required: true
    }
  },
  components: {
    IconButton,
    Loading
  },
  data: () => ({
    playing: false,
    showPause: false,
    timeout: null,
    loading: false,
    initialized: false
    // showVideo: false
  }),
  computed: {
    poster () {
      return this.src.replace('.mp4', '.jpg')
    }
  },
  methods: {
    async play () {
      // this.showVideo = true
      // await this.$nextTick()
      this.loading = true
      try {
        await this.$refs.video.play()
        this.playing = true
      } catch (e) {
        // interrupted by pause()
      }
    },
    pause () {
      this.$refs.video.pause()
      this.playing = false
      this.loading = false
    },
    _play () {
      this.play()
      this.$emit('play')
    },
    _pause () {
      this.pause()
      this.$emit('pause')
    },
    onMouseMove () {
      this.showPause = true
      clearTimeout(this.timeout)
      this.timeout = setTimeout(() => {
        this.showPause = false
      }, 1000)
    },
    onTimeUpdate () {
      this.loading = false
    }
  }
}
</script>

<style lang="scss" scoped>
.container {
  @include size(100%, auto);
  @include flex;
  position: relative;
}

video, img {
  @include size(100%);
  display: block;
  z-index: 5;
}

img {
  @include size(100%, auto);
  position: absolute;

  @include mobile-landscape {
    display: none;
  }
}

button {
  @include size(50px);
  position: absolute;
  background: transparent;
  border: 0;
  outline: 0;
  z-index: 30;
  background: rgba(white, 1);
  transition: all 350ms $base-easing !important;
  border-radius: 100%;
  mix-blend-mode: lighten;
}

svg {
  @include size(100%);
  display: block;

  * {
    stroke: black;
    fill: black;
  }
}

.icon-button {
  @include position(absolute, 0 0 0 0);
}
</style>