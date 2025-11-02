<template>
  <Arrows />

  <Scroller
    @update:navigation="scroll.onMainNavigation"
    @update:state="scroll.onMainState"
    ref="mainScroller"
  >
    <Section title="Intro" description=" ">
      <Transition name="fade">
        <Logo v-if="show && scroll.mainState.activeIndex === 0" />
      </Transition>
    </Section>

    <Kaleidosync />
    <COVID />
    <MSF />
    <Contact />
  </Scroller>

  <CanvasText
    :text="scroll.text"
    :fontSize="32"
    :width="viewport.width"
    :height="viewport.height"
    color="#ffffff"
    :cascadeDelay="12"
    :enterDuration="200"
  />
</template>

<script setup lang="ts">
import { pause } from '../util/time'
import { useScroll } from '../store/scroll'

const show = ref(false)
const viewport = useViewport()
const scroll = useScroll()
const mainScroller = ref()

onMounted(() => {
  pause(2000).then(() => {
    show.value = true
  })

  // Set the main scroller ref in the store
  if (mainScroller.value) {
    scroll.mainScrollerRef = mainScroller.value
  }
})
</script>

<style lang="scss" scoped>
.scroller {
  mix-blend-mode: exclusion;
}

.canvas-text {
  @include position(fixed, 50% null null 0);
  @include box;
  z-index: 1110;
  transform: translateY(-50%);
  background-image: linear-gradient(to top, rgba($purple, 0.25), rgba($black, 0.5));
}
</style>
