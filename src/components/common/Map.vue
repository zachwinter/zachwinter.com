<template>
  <figure ref="container" class="container" @mouseout="hideToolTip" @click="selectCounty">
    <canvas ref="map" class="map" :width="width" :height="height" :style="css" />
    <canvas ref="datums" class="datums" :width="width" :height="height" :style="css" />
    <canvas ref="cursor" class="cursor" :width="width" :height="height" :style="css" />
    <ToolTip
      :visible="tooltip.visible"
      :coords="tooltip.coords"
      :datum="tooltip.datum"
      :dataset-index="tooltip.datasetIndex"
      :deltas="tooltip.deltas"
      :state="tooltip.state"
    />
  </figure>
</template>

<script setup lang="ts">
import CovidMap from '../../classes/CovidMap'
import { useArtboard } from '../../composables/useArtboard'
import { useUI } from '../../store/ui'

const ui = useUI()
export type Location = {
  fips: string
  city: string
  state: string
  lat: number
  lon: number
  values?: any[]
  population: number
  stateFips: string
}

export interface ToolTipData {
  visible: boolean
  coords: [number, number]
  datum: Location | null
  datasetIndex: number
  deltas: [number, number, number] | null
  state: any
}

const emit = defineEmits(['hover'])
const viewport = useViewport()
const background = useBackground()

const container = ref()
const map = ref()
const datums = ref()
const cursor = ref()
const initialized = ref(false)
const app = shallowRef<CovidMap>()
const { width, height, css, setSize } = useArtboard()
const tooltip: Ref<ToolTipData> = ref({
  coords: [0, 0],
  datum: null,
  visible: false,
  datasetIndex: -1,
  deltas: null,
  state: null
})

watch(
  () => viewport.screen,
  () => onResize()
)

async function onResize() {
  const { width, height } = container.value.getBoundingClientRect()
  setSize(width, height)
  await nextTick()
  app.value?.resize?.()
}

function onMouseMove({ coords, datum }: any): void {
  tooltip.value.coords = coords
  tooltip.value.datum = datum as Location
  tooltip.value.datasetIndex = 2

  if (!datum) return

  tooltip.value.datum.values = app.value?.getCountyValuesByFips(datum.fips)
  tooltip.value.deltas = app.value?.getCountyDeltasByFips(datum.fips)
  tooltip.value.state = app.value?.getStateDataByFips(datum.stateFips)

  emit('hover', datum)

  showToolTip()
  app.value?.paint()
}

function showToolTip() {
  tooltip.value.visible = true
}

function hideToolTip() {
  tooltip.value.visible = false
}

function selectCounty() {
  const cursorDatum = app.value?.state?.cursorDatum
  if (cursorDatum) {
    console.log(cursorDatum)
    app.value?.selectCountyByFips(cursorDatum.fips)
  }
}

function onZoom({ x, y, k }: { x: number; y: number; k: number }) {
  background.setUniform('zoom_x', x)
  background.setUniform('zoom_y', y)
  background.setUniform('zoom_k', k)
}

const interval = shallowRef<any>()
const examples = ['11052020', '08172021', '12252021', '09012022']

async function init() {
  const { width, height } = container.value.getBoundingClientRect()
  setSize(width, height)

  await nextTick()

  const canvases = {
    map: map.value,
    datums: datums.value,
    cursor: cursor.value
  }

  app.value = new CovidMap({
    canvases,
    onMouseMove,
    hideToolTip,
    onZoom
  })

  // Fetch data and initialize
  await app.value.fetchData()

  const locs = ['46009', '28099', '36061']
  initialized.value = true

  let i = 0

  // Go to first example and focus
  app.value.chooseExample(examples[i])
  app.value.focusDatumByFIPS(locs[i])

  interval.value = setInterval(() => {
    i++
    if (i === locs.length) i = 0
    app.value?.chooseExample(examples[i])
    app.value?.focusDatumByFIPS(locs[i])
  }, 4000)
}

onMounted(() => {
  init()

  ui.initialized = true
})

onBeforeUnmount(() => {
  clearInterval(interval.value)
  app.value?.destroy()
})
</script>

<style lang="scss" scoped>
figure.container {
  @include size(100vw, 100%);
  pointer-events: none !important;
}

canvas {
  @include position(absolute, 0 null null 0);

  display: block;

  &.map {
    z-index: 5;
  }
  &.datums {
    z-index: 6;
  }
  &.cursor {
    z-index: 7;
  }
}
</style>
