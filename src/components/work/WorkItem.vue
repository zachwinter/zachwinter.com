<template lang="pug">
.work-item(:class="{ active }")
  .content
    .inner-content
      slot(name="content")
      CTAs(v-if="(!mobile || mobileLandscape) && ctas" :href="ctas.href" :target="ctas.target" :text="ctas.text" :github="ctas.github || null" :color="ctas.color" :toggle="ctas.toggle" :margin="ctas.margin")
  .showcase(:class="{ landscape }")
    slot(name="showcase")
      Desktop(:active="viewMode === 'desktop'")
        Swiper(ref="desktop" :cleanup-styles-on-destroy="false" @slideChange="onDesktopChange" :options="{ grabCursor: true }")
          SwiperSlide(v-for="(a, i) in new Array(total)" :key="i")
            img(:src="`/${namespace}/desktop.${i + 1}.jpg`" :alt="namespace")
        Bullets(:total="total" :active="activeDesktopIndex" @select="selectDesktopSlide")
      Mobile(:active="viewMode === 'mobile'" :landscape="landscape")
        Swiper(ref="mobile" :cleanup-styles-on-destroy="false" @slideChange="onMobileChange" :options="{ grabCursor: true }")
          SwiperSlide(v-for="(a, i) in new Array(total)" :key="i")
            img(:src="`/${namespace}/mobile.${i + 1}.jpg`" :alt="namespace").mobile-screenshot
        Bullets(:total="total" :active="activeMobileIndex" @select="selectMobileSlide")
    CTAs(v-if="mobilePortrait && ctas" :href="ctas.href" :target="ctas.target" :text="ctas.text" :margin="true")
</template>

<script>
import Desktop from '@/components/work/Desktop'
import Mobile from '@/components/work/Mobile'
import Bullets from '@/components/work/Bullets'
import CTAs from '@/components/work/CTAs'
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
    },
    ctas: Object
  },
  components: {
    Mobile,
    Desktop,
    Swiper,
    SwiperSlide,
    Bullets,
    CTAs
  },
  data: () => ({
    activeDesktopIndex: 0,
    activeMobileIndex: 0
  }),
  computed: {
    ...bind([
      'work/viewMode',
      'ui/mobile',
      'ui/mobilePortrait',
      'ui/mobileLandscape'
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
.work-item {
  @include position(absolute, 0 0 0 0);
  @include position(absolute, 0 notch(right) 0 notch(left));
  @include flex;
  padding: $outer-padding;
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
  
  h2, p {
    @include span-text;
  }

  .ctas {
    transform: translateY(50px) scale(.5);
    opacity: 0;
    transition: transform $work-item-transition, opacity $work-item-transition;
  }
}

.showcase {
  @include size(60%, 100%);
  @include flex(center, center, column);
  position: relative;
  transform: translateY(100px);
  opacity: 0;
  transition: transform $work-item-transition, opacity $work-item-transition;

  @include mobile-portrait {
    margin: spacer(1) 0;
  }
}

.active {
  z-index: 1;

  .showcase, h2, p, .ctas {
    transform: translateX(0px);
    opacity: 1;
  }
}

@include mobile-portrait {
  .work-item {
    @include flex(center, center, column);
    background-size: cover;
    background-position: center center;
  }

  .content {
    @include size(100%, auto);
    padding: 0;
  }

  .showcase {
    @include size(100%, auto);
  }
}

@include mobile-landscape {
  .content {
    @include flex(center, center, column);
    flex: 1;
    padding: 0 $outer-padding 0 0;

    h2 { font-size: 1.5rem; }
    // p { font-size: 1.2rem; }
  }
}

@include mobile {
  img.mobile-screenshot {
    @include size(auto, 100%);
  }

  .landscape img.mobile-screenshot {
    @include size(100%, auto);
  }
}
</style>

<style lang="scss">
@include mobile {
  .work-item .showcase .mobile.portrait {
    img {
      @include size(auto, calc(100vh - #{($outer-padding * 2) + 20px}));
      margin: 0 auto;
    }

    .bullets {
      bottom: 0;
    }
  }

  // .work-item .showcase .mobile.landscape {
  //   img {
  //     @include size(100%, auto);
  //   }
  // }
}
</style>