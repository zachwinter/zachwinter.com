<template>
  <main ref="container">
    <Scroller @scroll="onScroll">
      <!-- <NowPlaying :src="`/books.jpg`" /> -->
      <Hero :scroll="!show ? 100 : scrollTop" />
      <Transition name="fade">
        <Logo v-if="show && scrollTop < viewport.height / 2" />
      </Transition>

      <Images v-bind="kaleidosync" />

      <Map />
      <Images v-bind="msf" />
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
const container = ref()
const msf = ref({
  title: 'Mindful Service Foundation',
  images: [
    '/screenshots/msf.01.jpg',
    '/screenshots/msf.02.jpg',
    '/screenshots/msf.03.jpg',
    '/screenshots/msf.04.jpg'
  ]
})
const kaleidosync = ref({
  title: 'Kaleidosync',
  link: 'https://www.kaleidosync.com',
  github: 'https://github.com/zachwinter/kaleidosync',
  images: [
    '/screenshots/5ht.01.jpg',
    '/screenshots/5ht.02.jpg',
    '/screenshots/5ht.03.jpg',
    '/screenshots/5ht.04.jpg'
  ]
})

function onScroll(e: any) {
  scrollTop.value = Math.max(e.target.scrollTop, 0)
  background.scrollY = (scrollTop.value / viewport.height) * 5
}

onMounted(() => {
  pause(2000).then(() => {
    show.value = true
  })
})
</script>

<style lang="scss" scoped>
main {
  @include size(100vw, 100vh);
  overflow-y: scroll;
}

strong {
  font-weight: 900;
}
</style>
