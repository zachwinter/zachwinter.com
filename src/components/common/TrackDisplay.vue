<template>
  <Row class="track-display" align="center" justify="center">
    <Transition name="fade">
      <Row v-if="currentTrack" center>
        <div class="track-artwork">
          <img v-if="displayArtwork" :src="displayArtwork" :alt="`${displayTitle} by ${displayArtist}`" @error="onImageError" />
          <div v-else class="artwork-placeholder">
            <Icon icon="vinyl" />
          </div>
        </div>

        <Row justify="center" padding="1" gap="1" class="meta">
          <h3 class="track-title">
            <span class="title">{{ displayTitle }}</span> <em> | </em>
            <span v-if="displayArtist" class="artist"> {{ displayArtist }}</span>
          </h3>

          <!-- <Row class="position" v-if="currentTrack.duration" align="center" gap="1">
          <span>{{ positionFormatted }}</span>

          <div class="progress-bar">
            <div class="progress-fill" :style="{ width: `${progressPercent}%` }"></div>
          </div>
          <div class="progress-time">
            <span>{{ displayDuration }}</span>
          </div>
        </Row> -->
        </Row>
      </Row>
    </Transition>

    <Transition name="fade">
      <h3 v-if="!currentTrack && shouldShowNoTrackMessage" class="none">No track currently playing</h3>
    </Transition>
  </Row>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { Row, Icon } from "../../components";
import { useQueue, useSources } from "@/stores";
import { AudioSource } from "@kaleidosync/types";

const queue = useQueue();
const sources = useSources();
const currentTrack = computed(() => {
  const track = queue.currentTrack;
  return track;
});

const shouldShowNoTrackMessage = computed(() => {
  return sources.source === AudioSource.SPOTIFY;
});

const displayTitle = computed(() => currentTrack.value?.title || "Unknown Track");
const displayArtist = computed(() => currentTrack.value?.artist || "Unknown Artist");
const displayArtwork = computed(() => {
  const artwork = currentTrack.value?.artwork;
  return artwork?.medium || artwork?.large || artwork?.small;
});
const displayDuration = computed(() => {
  const duration = currentTrack.value?.durationSeconds;
  if (!duration) return null;

  const minutes = Math.floor(duration / 60);
  const seconds = duration % 60;
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
});

// Progress helpers
const progressPercent = computed(() => {
  const progress = currentTrack.value?.progress;
  return progress ? Math.round(progress * 100) : 0;
});

const positionFormatted = computed(() => {
  const position = currentTrack.value?.position;
  if (!position) return "0:00";

  const seconds = Math.floor(position / 1000);
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
});

function getSourceLabel(source: AudioSource): string {
  const labels: Record<AudioSource, string> = {
    [AudioSource.NONE]: "None",
    [AudioSource.SPOTIFY]: "Spotify",
    [AudioSource.AUDIUS]: "Audius",
    [AudioSource.RADIO_PARADISE]: "Radio Paradise",
    [AudioSource.KEXP]: "KEXP",
    [AudioSource.MICROPHONE]: "Microphone",
    [AudioSource.FILE]: "File",
    [AudioSource.BROWSER_AUDIO]: "Browser Audio"
  };
  return labels[source] || "Unknown";
}

function onImageError(event: Event) {
  console.warn("🖼️ Artwork failed to load:", (event.target as HTMLImageElement)?.src);
}
</script>

<style lang="scss" scoped>
.track-display {
  @include position(fixed, null 0 1rem 1rem, 500);
  @include flex-row(start, center);
  width: 100%;

  * {
    font-family: "Space Mono", monospace;
  }

  @include mobile {
    @include position(fixed, null 0 0.5rem 0, 500);
    width: 100% !important;
    padding: 0 !important;
    transform: none;
  }
}

h3 {
  @include shadow;
  @include box(0.25 0.5);

  @include mobile {
    @include box(0.5 1.5 0.5 1);
  }
}

img {
  @include size(80px);
  @include shadow;
  border-radius: 4px;

  @include mobile {
    @include size(50px);
  }
}

.artwork-placeholder {
  @include size(80px);
  @include flex-row(center, center);
  @include shadow;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 4px;
  border: 1px dashed rgba(255, 255, 255, 0.3);

  @include mobile {
    @include size(50px);
  }

  svg {
    @include size(32px);
    opacity: 0.5;

    @include mobile {
      @include size(24px);
    }
  }
}

.track-album {
  text-wrap: nowrap;
}

.position {
  span {
    @include shadow;
  }

  @include mobile {
    padding: 0 !important;
    width: 100% !important;
    transform: none;
  }
}

.progress-bar {
  width: 100%;
  height: 1px;
  background: $white;
}

.progress-fill {
  height: 1px;
  background: $pink;
}

.title {
  padding-left: 0.5rem;
}

.artist {
  color: $pink;
  padding-right: 0.75rem;

  @include mobile {
    @include box(0.5);
  }
}

.meta {
  position: relative;
}

em {
  @include mobile {
    display: block;
    width: 100%;
    height: 0;
    color: transparent;
  }
}
</style>
