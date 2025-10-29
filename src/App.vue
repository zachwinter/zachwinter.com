<template>
  <Background />
  <RouterView />
  <Transition name="fade">
    <Spinner v-if="ui.loading" />
  </Transition>
</template>

<script lang="ts" setup>
import { useUI } from './store/ui'
import { useBackground } from './store/background'
import { pause } from './util/time'

const background = useBackground()
const ui = useUI()
onMounted(() => {
  pause(1500).then(() => {
    ui.loading = false
    background.tweenToVariant(0)
  })
})
</script>

<style lang="scss">
@import '@/styles/main.scss';

html,
body {
  width: 100%;
  overflow-x: hidden;
}
</style>
