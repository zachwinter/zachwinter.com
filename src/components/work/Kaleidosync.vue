<template>
  <Section title="Kaleidosync">
    <Scroller
      axis="x"
      @update:navigation="scroll.onKaleidosyncNavigation"
      @update:state="scroll.onKaleidosyncScroll"
      ref="kaleidosyncScroller"
    >
      <Section
        title="Kaleidosync"
        description="KALEIDOSYNC - a WebGL music visualizer that works with any audio source"
      >
        <img :src="one" />
      </Section>

      <Section
        title="Kaleidosync"
        description="fully customizable visuals with a live-updating shader editor"
      >
        <img :src="two" />
      </Section>

      <Section title="Kaleidosync" description="supports Radio Paradise, KEXP, Audius & more">
        <img :src="three" />
      </Section>

      <Section title="Kaleidosync" description="unobtrusive UI + tooltips when you want them">
        <img :src="four" />
      </Section>

      <Section title="Kaleidosync" description="~ 50 designs and counting">
        <img :src="five" />
      </Section>
    </Scroller>
  </Section>
</template>

<script lang="ts" setup>
import { useScroll } from '../../store/scroll'
import { useViewport } from '../../store/viewport'

const scroll = useScroll()
const viewport = useViewport()
const kaleidosyncScroller = ref()
const one = computed(() => `/screenshots/kaleidosync.01${viewport.mobile ? '.mobile' : ''}.jpg`)
const two = computed(() => `/screenshots/kaleidosync.02${viewport.mobile ? '.mobile' : ''}.jpg`)
const three = computed(() => `/screenshots/kaleidosync.03${viewport.mobile ? '.mobile' : ''}.jpg`)
const four = computed(() => `/screenshots/kaleidosync.04${viewport.mobile ? '.mobile' : ''}.jpg`)
const five = computed(() => `/screenshots/kaleidosync.05${viewport.mobile ? '.mobile' : ''}.jpg`)

onMounted(() => {
  if (kaleidosyncScroller.value) {
    scroll.kaleidosyncScrollerRef = kaleidosyncScroller.value
  }
})
</script>
