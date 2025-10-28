<template>
  <Pill class="fps">{{ displayFps }} FPS</Pill>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import { useRAF } from "@/stores";
import { Pill } from "@/components";

const max = 5;
const raf = useRAF();
const displayFps = ref(60);
const frameCounter = ref(0);

watch(
  () => raf.frameRate,
  fps => {
    frameCounter.value++;
    if (frameCounter.value < max) return;
    displayFps.value = Math.round(fps);
    frameCounter.value = 0;
  }
);
</script>

<style lang="scss" scoped>
.fps {
  @include position(fixed, 1rem 1rem null null);
}
</style>
