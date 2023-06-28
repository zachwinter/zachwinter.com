<template>
  <figure
    class="album-art"
    transition
    :class="{
      visible: true
    }"
  >
    <i class="image-container" transition>
      <button :class="{ visible: background.playing }" @click="background.pause()">
        <PauseIcon />
      </button>
      <button :class="{ visible: !background.playing }" @click="background.init()">
        <PlayIcon />
      </button>
      <img :src="src" :alt="alt" />
    </i>
  </figure>
</template>

<script lang="ts" setup>
import PlayIcon from '@/assets/svg/play.svg'
import PauseIcon from '@/assets/svg/pause.svg'

const background = useBackground()
const props = defineProps<{
  src: string
  alt: string
  track: string
  artist: string
  controls: boolean
}>()
const displayedTrack = ref()
const displayedArtist = ref()

watch(
  () => [props.track, props.artist],
  ([track, artist]) => {
    displayedTrack.value = track
    displayedArtist.value = artist
  },
  { immediate: true }
)
</script>

<style lang="scss" scoped>
figure {
  @include position(fixed, null null 0 notch(left));
  @include flex(center, flex-start, row);
  z-index: 1000;
  overflow: visible;
  white-space: nowrap;
  will-change: transform, opacity;
  opacity: 0;

  :deep(*) {
    color: inherit;
  }

  // @include mobile-portrait {
  //   @include position(fixed, null 0 0 0);

  //   * {
  //     color: var(--gray);
  //   }
  // }

  &.visible {
    opacity: 1;
  }

  .image-container {
    @include size(px(120));
    @include shadow;
    position: relative;
    display: block;

    &:before {
      @include position(absolute, 0 0 0 0);
      background: linear-gradient(
        to top right,
        rgba(map-get($colors, 'pink'), 0.3),
        rgba(map-get($colors, 'purple'), 0.3)
      );
      content: '';
      z-index: 10;
    }
  }

  @include mobile-landscape {
    @include size(auto, px(150));

    .image-container {
      @include size(px(150));
    }
  }

  img {
    @include shadow;
    @include size(100%);
    transition: var(--base-transition);
    will-change: transform, opacity;
    border-radius: var(--border-radius);
  }

  span {
    padding: px(2) px(4);
  }

  .track {
    @include flex(center, flex-start, row);
    font-family: 'Bungee';
    font-weight: normal;
    font-size: px(38);
    line-height: px(50);
    width: 100%;
  }

  .artist {
    font-size: px(28);
  }

  // @include mobile-portrait {
  //   @include size(px(120));

  //   .image-container,
  //   img {
  //     @include size(px(120));
  //   }

  //   .track {
  //     font-size: px(28);
  //     width: 100%;
  //     white-space: nowrap;
  //     text-overflow: ellipsis;
  //     overflow: hidden;
  //     display: inline-block;
  //   }

  //   .artist {
  //     font-size: px(26);
  //   }
  // }
}

.text {
  opacity: 1;
  will-change: transform, opacity;
  position: relative;
  height: 100%;
  overflow: hidden;
  margin-left: auto;

  &.hidden {
    opacity: 0;
  }

  @include mobile-portrait {
    max-width: 100%;
  }
}

div {
  @include flex(flex-start, center);
  will-change: transform, opacity;
}

button {
  @include size(100%);
  border: 0;
  position: absolute;
  background: transparent !important;
  opacity: 0;
  transition: var(--base-transition);
  pointer-events: none;
  cursor: pointer;
  z-index: 10;

  &.visible {
    opacity: 1;
    pointer-events: all;
  }
}

button :deep(svg) {
  @include size(50%);

  * {
    fill: var(--white);
  }
}

.button {
  @include size(px(50));
  position: relative;
  margin-left: var(--base-spacer);
}

.track {
  width: 100%;
  // background: var(--white);
  margin-left: auto;
  border-radius: var(--border-radius);
  padding: var(--base-spacer);
}

small {
  @include type(32, 32, 400);
  font-family: var(--font-family);
  padding-left: var(--base-spacer);

  strong {
    @include type(32, 32, 400);
    text-transform: uppercase;
  }
}
</style>
