<template>
  <Button @click="() => (background.playing ? background.pause() : background.init())">
    <span :class="{ visible: !background.playing }"><PlayIcon /></span>
    <span :class="{ visible: background.playing }"><PauseIcon /></span>
  </Button>
</template>

<script setup lang="ts">
import PlayIcon from '@/assets/svg/play.svg?component'
import PauseIcon from '@/assets/svg/pause.svg?component'

const background = useBackground()
</script>

<style lang="scss" scoped>
button {
  @include flex;
  @include size(px(120));
  @include shadow;
  display: inline-flex;
  border-radius: 100%;
  cursor: pointer;
  // border-color: var(--blue);
  // border-width: px(2);
  background: transparent;

  &:hover {
    color: var(--white);
    background: lighten(map-get($colors, 'purple'), 18%);
  }

  &:active {
    transform: scale(0.8);
  }

  @include mobile-portrait {
    display: flex;
    margin-top: var(--base-spacer);
  }
}

span {
  @include size(100%);
  @include flex;
  position: absolute;
  font-size: px(25);
  opacity: 0;
  transition: var(--base-transition);

  &.visible {
    opacity: 1;
  }
}

span:nth-child(2) {
  @include flex;
}

span svg {
  @include size(40%);
  fill: var(--gray);
}
</style>
