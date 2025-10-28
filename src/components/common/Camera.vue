<template>
  <div class="camera-container" :class="{ active: isActive }">
    <video
      ref="videoRef"
      :autoplay="autoplay"
      :width="width * dpr"
      :height="height * dpr"
      :style="{ width: width + 'px', height: height + 'px' }"
      :muted="muted"
      :playsinline="playsinline"
      @loadedmetadata="onVideoLoaded" />
    <slot v-if="!isActive" name="inactive">
      <div class="row">
        <button @click="start"><WandIcon /></button>
      </div>
    </slot>
    <slot v-else name="active">
      <div class="row">
        <button @click="takePhoto"><CameraIcon /></button>
      </div>
    </slot>
    <slot v-if="error" name="error" :error="error">
      <div class="error">{{ error.message }}</div>
    </slot>
  </div>
</template>

<script setup lang="ts">
import WandIcon from "../../assets/icons/wand.svg";
import CameraIcon from "../../assets/icons/camera.svg";

import { ref, onBeforeUnmount } from "vue";

const props = defineProps({
  facingMode: { type: String, default: "environment" },
  width: { type: Number, required: true },
  height: { type: Number, required: true },
  dpr: { type: Number, default: window.devicePixelRatio },
  autostart: { type: Boolean, default: false },
  autoplay: { type: Boolean, default: true },
  muted: { type: Boolean, default: true },
  playsinline: { type: Boolean, default: true }
});

const emit = defineEmits(["started", "stopped", "error", "loaded", "photo"]);
const videoRef = ref<HTMLVideoElement | null>(null);
const stream = ref<MediaStream | null>(null);
const isActive = ref(false);
const error = ref<Error | null>(null);

async function start() {
  try {
    error.value = null;

    const constraints: MediaStreamConstraints = {
      audio: false,
      video: {}
    };

    if (typeof constraints.video === "object") {
      constraints.video.facingMode = props.facingMode;

      if (props.width) {
        constraints.video.width = { ideal: props.width * props.dpr };
      }

      if (props.height) {
        constraints.video.height = { ideal: props.height * props.dpr };
      }
    }

    stream.value = await navigator.mediaDevices.getUserMedia(constraints);

    if (videoRef.value) {
      videoRef.value.srcObject = stream.value;

      try {
        await videoRef.value.play();
      } catch (playError) {
        console.error("Error playing video:", playError);
      }
    }

    isActive.value = true;
    emit("started", stream.value);
  } catch (err) {
    error.value = err as Error;
    console.error("Camera error:", err);
    emit("error", error.value);
  }
}

function stop() {
  if (stream.value) {
    stream.value.getTracks().forEach(track => track.stop());
    if (videoRef.value) {
      videoRef.value.srcObject = null;
    }
    stream.value = null;
    isActive.value = false;
    emit("stopped");
  }
}

function takePhoto() {
  if (!videoRef.value) return;

  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  if (!ctx) {
    console.error("Could not get canvas context");
    return;
  }

  // Use the video's natural size scaled by dpr
  const videoWidth = videoRef.value.videoWidth;
  const videoHeight = videoRef.value.videoHeight;
  canvas.width = videoWidth * props.dpr;
  canvas.height = videoHeight * props.dpr;

  // Draw the video at its natural size scaled by dpr
  ctx.drawImage(videoRef.value, 0, 0, canvas.width, canvas.height);
  emit("photo", canvas);
}

function onVideoLoaded() {
  if (videoRef.value) {
    const { videoWidth, videoHeight } = videoRef.value;
    console.log("Video loaded with dimensions:", videoWidth, "x", videoHeight);
  }
  emit("loaded", videoRef.value);
}

// Start camera automatically if requested
if (props.autostart) {
  start();
}

onBeforeUnmount(() => {
  stop();
});

defineExpose({
  start,
  stop,
  isActive,
  videoElement: videoRef
});
</script>

<style lang="scss" scoped>
.camera-container {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  align-items: center;
  justify-content: end;
  position: relative;
  overflow: hidden;
}

video {
  display: none;
  object-fit: cover;
  background-color: #000;
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 1;
}

.active video {
  display: block;
}
</style>
