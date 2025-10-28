<template>
  <canvas ref="canvas" :width="viewport.artboard.width" :height="viewport.artboard.height" :style="viewport.artboard.css" />
</template>

<script setup lang="ts">
import { ref, shallowRef, onMounted, onUnmounted, nextTick, watch } from "vue";
import { useViewport } from "@/stores";
import { useSketches } from "@/stores";
import { useAnimation } from "../../composables/useAnimation";
import { initGlobe } from "../../util/globe";

const viewport = useViewport();
const canvas = ref();
const app = shallowRef<any>({});
const initialized = ref(false);
const sketches = useSketches();

const props = withDefaults(
  defineProps<{
    volume?: number;
    stream?: number;
    shockWave?: {
      enabled?: boolean;
      speed?: number;
      width?: number;
      intensity?: number;
      waveform?: number;
    };
    corkscrew?: {
      amount?: number; // Base twist amount (0.5 = half rotation per unit)
      speed?: number; // Animation speed (0 = static)
      audioReactive?: boolean;
      baseTwist?: number;
      twistRange?: number;
    };
  }>(),
  {
    volume: 1,
    shockWave: {
      enabled: false,
      speed: 0.5,
      width: 180,
      intensity: 1,
      waveform: 2
    },
    corkscrew: {
      amount: 0.5,
      speed: 0.1,
      audioReactive: true,
      baseTwist: 0.3,
      twistRange: 2.0
    }
  } as any
);

function initialize() {
  if (initialized.value || !canvas.value) return;
  nextTick().then(() => {
    app.value = initGlobe({ canvas, viewport });
    initialized.value = true;
  });
}

watch(
  () => [viewport.width, viewport.height, viewport.dpr],
  () => {
    if (!app.value?.renderer) return;
    app.value.renderer.setPixelRatio(viewport.dpr);
    app.value.renderer.setSize(viewport.width, viewport.height);
    app.value.camera.aspect = viewport.width / viewport.height;
    app.value.camera.updateProjectionMatrix();
  }
);

useAnimation(() => {
  if (!initialized.value) return;
  app.value.applyVolume(props);
  app.value.tick();
});

onMounted(() => {
  sketches.sampleSketches();
  initialize();
});

onUnmounted(() => {
  if (app.value) app.value.destroy();
});
</script>
