<template>
  <div class="record">
    <div class="vinyl-container">
      <Vinyl :src="src" :playing="playing" :volume="volume" />
    </div>
  </div>
</template>

<script setup lang="ts">
import Vinyl from "../common/Vinyl.vue";

withDefaults(
  defineProps<{
    playing?: boolean;
    volume?: number;
    src?: string;
    size?: string;
  }>(),
  {
    src: `/images/native-speaker.jpg`,
    size: "150vh"
  }
);
</script>

<style lang="scss" scoped>
.record {
  @include position(absolute, 0 0 0 0, 0);
}

.vinyl-container {
  @include size(100%);
  @include flex;
  animation: rotate 33.3333s linear infinite;
  position: relative;
}

.vinyl {
  position: absolute;
  width: v-bind(size);
  height: v-bind(size);
  box-shadow: 0 0 10rem darken($black, 10%);
}
</style>
