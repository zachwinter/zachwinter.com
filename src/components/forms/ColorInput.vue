<template>
  <FormElement
    ref="container"
    :label="label"
    :disabled="disabled"
    :class="{ open }"
    :hide-label="open"
  >
    <Transition name="fade">
      <nav v-if="open">CLOSE</nav>
    </Transition>
    <div
      class="canvas-container"
      @click="activate"
      :style="{ background: value }"
      @mousedown="onPointerDown"
      @mousemove="onPointerMove"
      @mouseup="onPointerUp"
    >
      <input type="color" :value="value" />
      <canvas ref="canvas" />
    </div>
  </FormElement>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import FormElement from './FormElement.vue'
import { glslColorToHex } from '../../util/colors/glsl-color-to-hex'
import { hslToHex } from '../../util/colors/hsl-to-hex'
import { hexToHsl } from '../../util/colors/hex-to-hsl'
import { hexToModelValue } from '../../util/colors/hex-to-model-value'
import { useCanvas2d } from '../../composables/useCanvas2d'

const container = ref()

defineExpose({ container })

const emit = defineEmits<{
  'update:model-value': [value: string | [number, number, number]]
  pointerdown: [event: MouseEvent]
}>()

const props = withDefaults(
  defineProps<{
    label?: string
    modelValue: string | [number, number, number]
    disabled?: boolean
    webgl?: boolean
  }>(),
  {
    disabled: false,
    modelValue: '#000000'
  }
)

const value = computed(() =>
  props.webgl ? glslColorToHex(props.modelValue as [number, number, number]) : props.modelValue
)
const currentHsl = computed(() => hexToHsl(value.value as string))

const artboard = ref({
  width: 200,
  height: 150,
  dpr: window.devicePixelRatio
})
const canvas = ref()
const { draw, clear, normalize } = useCanvas2d(canvas, artboard)
const interactionMode = ref<'saturation-lightness' | 'hue' | null>(null)
const clicked = ref(false)
const open = ref(false)

function drawColorPicker() {
  if (!canvas.value) return
  const { width, height } = artboard.value
  clear()
  normalize()
  draw((ctx) => {
    const hueHeight = Math.floor(height * 0.1)
    const pickerHeight = height - hueHeight - 5
    drawSaturationLightnessPicker(ctx, width, pickerHeight, currentHsl.value.h)
    drawHueStrip(ctx, width, hueHeight, height - hueHeight, currentHsl.value.h)
    drawSaturationLightnessIndicator(ctx, width, pickerHeight, currentHsl.value)
    drawHueIndicator(ctx, width, hueHeight, height - hueHeight, currentHsl.value.h)
  })
}

watch(
  () => props.modelValue,
  () => drawColorPicker()
)

function drawSaturationLightnessPicker(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  hue: number
) {
  const saturationGradient = ctx.createLinearGradient(0, 0, width, 0)
  saturationGradient.addColorStop(0, '#ffffff')
  saturationGradient.addColorStop(1, hslToHex(hue, 1, 0.5))
  ctx.fillStyle = saturationGradient
  ctx.fillRect(0, 0, width, height)
  const lightnessGradient = ctx.createLinearGradient(0, 0, 0, height)
  lightnessGradient.addColorStop(0, 'rgba(0, 0, 0, 0)')
  lightnessGradient.addColorStop(1, 'rgba(0, 0, 0, 1)')
  ctx.fillStyle = lightnessGradient
  ctx.fillRect(0, 0, width, height)
}

function drawHueStrip(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  yOffset: number,
  currentHue: number
) {
  const hueGradient = ctx.createLinearGradient(0, yOffset, width, yOffset)
  for (let i = 0; i <= 360; i += 30) {
    hueGradient.addColorStop(i / 360, hslToHex(i, 1, 0.5))
  }

  ctx.fillStyle = hueGradient
  ctx.fillRect(0, yOffset, width, height)
}

function drawSaturationLightnessIndicator(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  hsl: { h: number; s: number; l: number }
) {
  const hsv = hslToHsv(hsl.h, hsl.s, hsl.l)
  const x = hsv.s * width
  const y = (1 - hsv.v) * height
  ctx.beginPath()
  ctx.arc(x, y, 8, 0, Math.PI * 2)
  ctx.fillStyle = 'white'
  ctx.fill()
  ctx.strokeStyle = 'black'
  ctx.lineWidth = 2
  ctx.stroke()
}

function drawHueIndicator(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  yOffset: number,
  hue: number
) {
  const x = (hue / 360) * width
  const y = yOffset + height / 2
  ctx.beginPath()
  ctx.arc(x, y, 6, 0, Math.PI * 2)
  ctx.fillStyle = 'white'
  ctx.fill()
  ctx.strokeStyle = 'black'
  ctx.lineWidth = 2
  ctx.stroke()
}

function onPointerDown(e: MouseEvent) {
  if (props.disabled) return
  clicked.value = true
  if (!canvas.value || !open.value) return

  const rect = canvas.value.getBoundingClientRect()
  const y = (e.clientY - rect.top) * (artboard.value.height / rect.height)
  const { height } = artboard.value
  const hueHeight = Math.floor(height * 0.1)
  const pickerHeight = height - hueHeight - 5

  if (y <= pickerHeight) {
    interactionMode.value = 'saturation-lightness'
  } else if (y >= height - hueHeight) {
    interactionMode.value = 'hue'
  }

  updateColorFromPointer(e)
}

function updateColorFromPointer(e: MouseEvent) {
  if (!canvas.value) return

  const rect = canvas.value.getBoundingClientRect()
  const x = (e.clientX - rect.left) * (artboard.value.width / rect.width)
  const y = (e.clientY - rect.top) * (artboard.value.height / rect.height)
  const { width, height } = artboard.value
  const hueHeight = Math.floor(height * 0.1)
  const pickerHeight = height - hueHeight - 5
  const mode = clicked.value
    ? interactionMode.value
    : y <= pickerHeight
    ? 'saturation-lightness'
    : y >= height - hueHeight
    ? 'hue'
    : null

  if (mode === 'saturation-lightness') {
    const clampedX = Math.max(0, Math.min(width, x))
    const clampedY = Math.max(0, Math.min(pickerHeight, y))
    const saturationHSV = clampedX / width
    const valueHSV = 1 - clampedY / pickerHeight
    const { s: saturationHSL, l: lightnessHSL } = hsvToHsl(
      currentHsl.value.h,
      saturationHSV,
      valueHSV
    )
    const newHex = hslToHex(currentHsl.value.h, saturationHSL, lightnessHSL)
    const newValue = hexToModelValue(newHex, !!props.webgl)
    emit('update:model-value', newValue)
  } else if (mode === 'hue') {
    const clampedX = Math.max(0, Math.min(width, x))
    const hue = (clampedX / width) * 360
    const newHex = hslToHex(hue, currentHsl.value.s, currentHsl.value.l)
    const newValue = hexToModelValue(newHex, !!props.webgl)
    emit('update:model-value', newValue)
  }
}

function hsvToHsl(h: number, s: number, v: number): { h: number; s: number; l: number } {
  const l = v * (1 - s / 2)
  const sl = l === 0 || l === 1 ? 0 : (v - l) / Math.min(l, 1 - l)
  return { h, s: sl, l }
}

function hslToHsv(h: number, s: number, l: number): { h: number; s: number; v: number } {
  const v = l + s * Math.min(l, 1 - l)
  const sv = v === 0 ? 0 : 2 * (1 - l / v)
  return { h, s: sv, v }
}

function onPointerUp() {
  clicked.value = false
  interactionMode.value = null
}

function onPointerMove(e: MouseEvent) {
  if (clicked.value) {
    updateColorFromPointer(e)
  }
}

onMounted(() => {
  drawColorPicker()
})

function close(e: any) {
  open.value = false
}

function activate(e: any) {
  if (props.disabled) return
  open.value = true
}
</script>

<style lang="scss" scoped>
.form-element {
  position: relative;

  :deep(label) {
    min-width: calc(3rem);
    display: flex;
  }
}

input {
  opacity: 0;
  pointer-events: none;
  position: absolute;
}

div {
  @include flex-row;
  @include size(3.5rem, 1.5rem);
  transition: width var(--transition-duration) var(--transition-easing),
    height var(--transition-duration) var(--transition-easing);
  border-radius: 1.25rem;
  overflow: hidden;
}

nav {
  @include position(absolute, 50% null null 0.75rem, 20);
  @include flex-column;
  @include box(0, 0.5);
  transform: translateY(-50%) !important;

  button {
    border: 1px solid $gray;
  }
}

canvas {
  opacity: 0;
  z-index: 10;
  border-radius: 1.25rem;
  transition: var(--transition);
  pointer-events: none;
}

.open {
  div {
    @include size(200px, 150px);
  }

  canvas {
    opacity: 1;
    pointer-events: all;
  }
}
</style>
