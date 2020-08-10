<template lang="pug">
.item(:class="{ active }")
  .content
    slot
  .showcase(v-if="!mobile")
    Desktop(:active="viewMode === 'desktop'")
      Swiper(ref="desktop" :cleanup-styles-on-destroy="false" @slideChange="onDesktopChange")
        SwiperSlide(v-for="(a, i) in new Array(total)" :key="i")
          img(:src="`/${namespace}/desktop.${i + 1}.jpg`" :alt="namespace")
      Bullets(:total="total" :active="activeDesktopIndex" @select="selectDesktopSlide")
    Mobile(:active="viewMode === 'mobile'" :landscape="landscape")
      Swiper(ref="mobile" :cleanup-styles-on-destroy="false" @slideChange="onMobileChange")
        SwiperSlide(v-for="(a, i) in new Array(total)" :key="i")
          img(:src="`/${namespace}/mobile.${i + 1}.jpg`" :alt="namespace")
      Bullets(:total="total" :active="activeMobileIndex" @select="selectMobileSlide")
</template>

<script>
import Desktop from '@/components/work/Desktop'
import Mobile from '@/components/work/Mobile'
import Bullets from '@/components/work/Bullets'
import { bind } from '@/store/util'
import { Swiper, SwiperSlide } from 'vue-awesome-swiper'
import 'swiper/swiper-bundle.css'

export default {
  props: {
    namespace: String,
    total: Number,
    active: Boolean,
    landscape: {
      type: Boolean,
      default: false
    }
  },
  components: {
    Mobile,
    Desktop,
    Swiper,
    SwiperSlide,
    Bullets
  },
  data: () => ({
    activeDesktopIndex: 0,
    activeMobileIndex: 0
  }),
  computed: {
    ...bind([
      'work/viewMode',
      'ui/mobile'
    ])
  },
  methods: {
    onMobileChange ({ activeIndex }) {
      this.activeMobileIndex = activeIndex
    },
    onDesktopChange ({ activeIndex }) {
      this.activeDesktopIndex = activeIndex
    },
    selectDesktopSlide (i) {
      this.$refs.desktop.$swiper.slideTo(i)
    },
    selectMobileSlide (i) {
      this.$refs.mobile.$swiper.slideTo(i)
    }
  }
}
</script>

<style lang="scss" scoped>
.item {
  @include work-item;
  z-index: 0;
}

.content {
  @include size(40%, 100%);
  @include flex(flex-start, center, column);
  padding-right: $outer-padding;
  
  h2 {
    @include work-heading;
  }

  p {
    @include work-text;
  }

  a {
    @include button;
  }
  
  .ctas {
    transform: translateY(50px) scale(.5);
    opacity: 0;
    transition: transform $work-item-transition, opacity $work-item-transition;
  }
}

.showcase {
  @include size(60%, 100%);
  @include flex;
  position: relative;
  transform: translateY(150px);
  opacity: 0;
  transition: transform $work-item-transition, opacity $work-item-transition;
}

.active {
  z-index: 1;

  .showcase, h2, p, .ctas {
    transform: translateX(0px);
    opacity: 1;
  }
}

@include max-width(mobile) {
  .content {
    @include size(100%);
    padding: 0;
    // padding-top: $mobile-logo-size + $outer-padding;
  }

  .showcase {
    @include size(100%, 50%);
  }
}

@include mobile-landscape {
  .content {
    @include size(100%);
    @include flex(center, center, column);
    padding: 0;

    h2 {
      font-size: 1.5rem;
    }
    
    p {
      font-size: 1.2rem;
    }
  }
}
</style>