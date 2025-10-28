<template>
  <div class="logo" :class="{ active }">
    <svg ref="svg" :viewBox="viewBox" :xmlns="xmlns">
      <path ref="path" :d="d" :stroke-dasharray="pathLength" :stroke-dashoffset="pathLength" />
    </svg>
  </div>
</template>

<script setup lang="ts">
const svg = ref<SVGSVGElement | null>(null)
const path = ref<SVGPathElement | null>(null)
const xmlns = `http://www.w3.org/2000/svg`
const viewBox = `23.403 24.491 323.086 453.476`
const d = `M 39.64 279.401 C 39.64 279.401 540.9 -257.03 145.766 309.258 C 225.811 277.968 339.803 322.544 246.054 433.458 C 175.099 517.367 225.077 320.709 330.275 258.057`
const pathLength = ref(0)
const active = ref(false)

onMounted(() => {
  if (path.value) {
    pathLength.value = path.value.getTotalLength()
  }
})
</script>

<style lang="scss" scoped>
.logo {
  @include position(fixed, 50% null null 50%);
  @include flex;
  @include size(20rem);
  transform: translateY(-50%) translateX(-50%);
  z-index: 20;
  border-radius: 100%;
  pointer-events: none;
  will-change: transform, opacity;

  &.active {
    border-color: rgba($white, 0.26);
  }
}

svg {
  @include size(25rem, auto);
}

path {
  stroke: rgba(255, 255, 255, 1);
  stroke-width: 0.1rem;
  animation: draw 750ms var(--easing) forwards;
  background-color: transparent;
  fill: none;
}

@keyframes draw {
  to {
    stroke-dashoffset: 0;
  }
}
</style>
