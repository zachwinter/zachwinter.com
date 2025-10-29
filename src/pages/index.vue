<template>
  <main ref="container">
    <Breadcrumbs @select="scrollToSection" @select-covid="selectCovid" :section="section" />
    <Scroller @scroll="onScrollY" ref="scroller">
      <Section>
        <Transition name="fade">
          <Logo v-if="show && scrollTop < viewport.height / 2" />
        </Transition>
      </Section>

      <Section class="images">
        <header>
          <img src="/kaleidosync.png" class="icon" />
          <h2>Kaleidosync</h2>
          <p>a webgl music visualizer</p>
        </header>
        <Scroller>
          <img src="/screenshots/kaleidosync.01.png" />
          <img src="/screenshots/kaleidosync.02.png" />
          <img src="/screenshots/kaleidosync.03.png" />
          <img src="/screenshots/kaleidosync.04.png" />
          <img src="/screenshots/kaleidosync.05.png" />
        </Scroller>
      </Section>
      <Section>
        <Map ref="covid" />
      </Section>
      <Contact />
    </Scroller>
  </main>
</template>

<script setup lang="ts">
import { pause } from '../util/time'

const background = useBackground()
const show = ref(false)
const viewport = useViewport()
const scrollTop = ref(0)
const covid = ref()
const container = ref()
const scroller = ref()
const scrolling = ref(false)
const section = computed(() => Math.round(scrollTop.value / viewport.height))
let timeout: any

function onScrollY(e: any) {
  scrolling.value = true
  scrollTop.value = Math.max(e.target.scrollTop, 0)
  background.scrollY = (scrollTop.value / viewport.height) * 5
  clearTimeout(timeout)
  timeout = setTimeout(() => {
    if (e.target.scrollTop % viewport.height === 0) {
      scrolling.value = false
    }
  }, 30)
}

function scrollToSection(i: number) {
  scroller.value.element.scrollTo({
    top: i * viewport.height,
    behavior: 'smooth'
  })
}

function selectCovid(i: number) {
  covid.value?.selectExample(i)
}

onMounted(() => {
  pause(2000).then(() => {
    show.value = true
  })
})
</script>

<style lang="scss" scoped>
* {
  font-family: 'Space Mono';
  font-weight: 400;
}

img {
  @include size(100%, auto);
}

.images {
  margin-left: auto;
  width: 80vw;

  @include mobile {
    width: 100vw;
  }
}

header {
  @include flex-row(start, center);
  @include box;
  width: 100%;
  background: $black;

  * {
    font-size: 1rem;
  }

  @include mobile {
    @include box(0.5, 0.5);
    * {
      font-size: 0.8rem;
    }
  }

  h2 {
    color: $purple;
    font-weight: 100;
  }
}

.icon {
  @include size(1rem);
}
</style>
