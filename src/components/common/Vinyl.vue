<template>
  <div class="vinyl" :class="{ playing }">
    <div class="overlays"></div>
    <div class="hole"></div>
    <img class="bg" src="../../assets/images/vinyl.png" />
    <div class="center">
      <img class="album" :src="src" />
      <div class="inner"></div>
      <div class="inner-2"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
const { size, src, playing } = defineProps<{ size?: any; src: string; volume?: number; playing?: boolean }>();
</script>

<style lang="scss" scoped>
$BLACK: #111;

.vinyl {
  @include flex;
  position: absolute;
  width: v-bind(size);
  height: v-bind(size);
  border-radius: 100%;
  position: relative;
  overflow: hidden;
}

.overlays {
  @include flex;
  position: absolute;
  @include size(100%);
  // will-change: transform, opacity;
  &:before {
    @include position(absolute, 0 30% 0 30%);
    z-index: 1000;
    background: linear-gradient(to right, transparent, rgba($orange, 0.15), rgba($pink, 0));
    content: "";
    // mix-blend-mode: lighten;
  }

  &:after {
    @include position(absolute, 0 0% 0 0%);
    z-index: 1000;
    background: linear-gradient(to right, transparent, rgba($purple, 0.15), rgba($pink, 0));
    content: "";
    mix-blend-mode: color-dodge;
  }
}

.bg {
  @include size(100%);
  position: absolute;
  // mix-blend-mode: overlay;
}

.center {
  @include size(50%);
  @include flex;
  overflow: hidden;
  position: absolute;
  z-index: 1000;
  background: linear-gradient(to top right, rgba(darken($pink, 10%), 0.5), rgba(lighten($purple, 10%), 0.8)), $black;
  border-radius: 100%;
  box-shadow: inset 0 -0.1vw 0px 0.1vw lighten($red, 20%), inset 0 0.1vw 0.1vw 0.1vw darken($pink, 20%);
  border: 0.1vw solid $blue;
  &:after {
    @include position(absolute, 0 0 0 0);
    z-index: 1000;
    background: linear-gradient(to right, transparent, rgba($black, 0.2), transparent);
    mix-blend-mode: color-dodge;
    content: "";
  }

  &:before {
    @include position(absolute, 0 30% 0 30%);
    z-index: 1000;
    background: linear-gradient(to right, transparent, rgba($purple, 1), transparent);
    content: "";
    mix-blend-mode: screen;
    opacity: 0.3;
  }
}

.inner {
  @include size(70%);
  background: linear-gradient(to top right, rgba(darken($red, 10%), 0.5), rgba(lighten($purple, 10%), 0.8));
  position: absolute;
  box-shadow: inset 0 -0.05vw 0px 0.05vw lighten($blue, 20%), inset 0 0.05vw 0.05vw 0.05vw darken($red, 20%);
  border: 0.05vw solid $red;
  border-radius: 100%;
}

.inner-2 {
  @include size(80%);
  background: linear-gradient(to top right, rgba(darken($red, 10%), 0.5), rgba(lighten($purple, 10%), 0.8));
  position: absolute;
  box-shadow: 0 -0.05vw 0px 0.05vw lighten($purple, 20%), 0 0.05vw 0.05vw 0.05vw darken($red, 20%);
  border: 0.05vw solid $red;
  border-radius: 100%;
}

.hole {
  @include size(8%);
  background: $BLACK;
  position: absolute;
  border-radius: 100%;
  z-index: 2000;
  box-shadow: inset 0 -0.05vw 0px 0.05vw lighten($purple, 20%), inset 0 0.05vw 0.05vw 0.05vw darken($white, 20%);
}

.album {
  @include position(absolute, 0 0 0 0, 999);
  @include size(100%);
  border-radius: 100%;
  overflow: hidden;
  opacity: 0.5;
}
</style>
