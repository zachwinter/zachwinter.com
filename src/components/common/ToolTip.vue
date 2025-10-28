<template>
  <div ref="container" class="tooltip" :class="{ visible }" :style="{ transform }">
    <div class="row">
      <p class="key">{{ datum?.city || ' ' }}</p>
      <p class="value">
        <strong>{{ value }}</strong>
        <small>{{ stats }}</small>
      </p>
    </div>
    <div class="row">
      <p class="key">{{ datum?.state || ' ' }}</p>
      <p class="value">
        <strong>{{ stateValue }}</strong>
        <small>{{ stateStats }}</small>
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { type ToolTipData } from './Map.vue'

const viewport = useViewport()
const props = defineProps<ToolTipData>()
const size: Ref<[number, number]> = ref([0, 0])
const container = ref()

watch(
  () => viewport.screen,
  async () => {
    await nextTick()
    setSize()
  }
)

const value = computed(() => {
  return props.datum?.values?.[props.datasetIndex]?.toLocaleString()
})

const stateValue = computed(() => {
  return props.state?.values?.[0]?.[props.datasetIndex]?.toLocaleString()
})

const stats = computed(() => {
  if (!props.datum?.population) return ''
  const sign = (props.deltas?.[props.datasetIndex] ?? -1) > -1 ? '+' : ''
  const delta = props.deltas?.[props.datasetIndex]?.toLocaleString()
  const capita = (
    (100 * props.datum?.values?.[props.datasetIndex]) /
    props.datum?.population
  ).toFixed(2)
  return `${sign}${delta} | ${capita}%`
})

const stateStats = computed(() => {
  const sign = (props.state?.values?.[1]?.[props.datasetIndex] ?? -1) > -1 ? '+' : ''
  const delta = props.state?.values?.[1]?.[props.datasetIndex]?.toLocaleString()
  const capita = (
    (100 * props.state?.values?.[0]?.[props.datasetIndex]) /
    props.state?.population
  ).toFixed(2)
  return `${sign}${delta} | ${capita}%`
})

const transform = computed(() => {
  const coords = props.coords
  const x = Math.max(size.value[0], coords[0])
  const y = Math.min(viewport.height - size.value[1], coords[1] + 50)
  return `translateX(-100%) translateX(${x}px) translateY(${y}px)`
})

function setSize() {
  const { width, height } = container.value.getBoundingClientRect()
  size.value = [width, height]
}

onMounted(() => {
  setSize()
})
</script>

<style lang="scss" scoped>
.tooltip {
  @include position(absolute, 0 null null 0);
  @include flex(flex-start, flex-start, column);
  @include size(320px, 5rem);
  @include box;
  z-index: 100;
  background: $black;
  color: var(--white);
  pointer-events: none;
  will-change: opacity, transform;
  opacity: 0;
  transition: opacity var(--base-transition);
  contain: strict;
  overflow: hidden;

  &.visible {
    opacity: 1;
  }

  div {
    @include flex(center, space-between, row);
    width: 100%;
  }
}

.key,
.value {
  font-size: 1rem;
}

.key {
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
}
.value {
  @include flex(center, space-between, row);
  margin-left: auto;
  text-align: right;
}

.state {
  font-size: 0.75rem;
}

.row + .row p {
}

strong {
  font-weight: 700;
  margin-left: auto;
}

small {
  font-size: 1rem;
  min-width: 100px;
  opacity: 0.5;
}
</style>
