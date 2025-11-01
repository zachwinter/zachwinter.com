<template>
  <canvas ref="canvas" :width="width" :height="height" :style="canvasStyle" @wheel="onWheel" />
</template>

<script setup lang="ts">
import { CharacterRenderer } from '@/classes/CharacterRenderer'
import { highlightLine, defaultColorScheme, type CharWithColor } from '@/util/syntax-highlight'

interface Props {
  fontSize?: number
  fontFamily?: string
  color?: string
  width?: number
  height?: number
  lineHeight?: number
  padding?: number
  followMode?: boolean // Auto-scroll to bottom on new lines
  language?: string // Syntax highlighting language (typescript, python, etc)
  colorScheme?: Record<string, string> // Token color mapping
}

const props = withDefaults(defineProps<Props>(), {
  fontSize: 14,
  fontFamily: 'monospace',
  color: '#996699',
  width: 800,
  height: 600,
  lineHeight: 1.2,
  padding: 8,
  followMode: true,
  language: '',
  colorScheme: () => defaultColorScheme
})

const canvas = ref<HTMLCanvasElement>()
const ctx = ref<CanvasRenderingContext2D>()
const dpr = window.devicePixelRatio

// Character renderer
let renderer: CharacterRenderer

// Text buffer (lines of text)
const buffer = ref<string[]>([])

// Viewport state
const viewport = ref({
  startRow: 0, // First visible row
  rows: 0, // Number of visible rows
  cols: 0 // Number of visible columns
})

// Computed values
const lineHeightPx = computed(() => props.fontSize * props.lineHeight)
const totalLines = computed(() => buffer.value.length)
const canScroll = computed(() => totalLines.value > viewport.value.rows)
const maxStartRow = computed(() => Math.max(0, totalLines.value - viewport.value.rows))

const canvasStyle = computed(() => ({
  width: `${props.width}px`,
  height: `${props.height}px`,
  cursor: canScroll.value ? 'default' : 'default'
}))

// Calculate viewport dimensions based on canvas size
function calculateViewport() {
  if (!renderer) return

  const contentWidth = props.width - props.padding * 2
  const contentHeight = props.height - props.padding * 2

  viewport.value.cols = Math.floor(contentWidth / renderer.charWidth)
  viewport.value.rows = Math.floor(contentHeight / lineHeightPx.value)
}

// Render visible portion of buffer
function render() {
  if (!ctx.value || !canvas.value || !renderer) return

  // Clear canvas
  ctx.value.clearRect(0, 0, props.width, props.height)

  // Calculate visible range
  const startRow = viewport.value.startRow
  const endRow = Math.min(startRow + viewport.value.rows, totalLines.value)

  // Render only visible lines
  for (let i = startRow; i < endRow; i++) {
    const line = buffer.value[i]
    const rowIndex = i - startRow

    // Syntax highlight if language is specified
    let charsWithColors: CharWithColor[]

    if (props.language) {
      charsWithColors = highlightLine(line, props.language, props.colorScheme)
    } else {
      // No highlighting - use default color
      charsWithColors = line.split('').map(char => ({
        char,
        color: props.color
      }))
    }

    // Render each character (truncate to viewport width)
    const maxChars = Math.min(charsWithColors.length, viewport.value.cols)
    for (let colIndex = 0; colIndex < maxChars; colIndex++) {
      const { char, color } = charsWithColors[colIndex]
      const x = props.padding + colIndex * renderer.charWidth
      const y = props.padding + rowIndex * lineHeightPx.value

      renderer.renderChar(ctx.value, char, x, y, color)
    }
  }
}

// Scroll viewport
function scrollTo(row: number) {
  viewport.value.startRow = Math.max(0, Math.min(row, maxStartRow.value))
  render()
}

function scrollBy(delta: number) {
  scrollTo(viewport.value.startRow + delta)
}

function scrollToBottom() {
  scrollTo(maxStartRow.value)
}

function scrollToTop() {
  scrollTo(0)
}

// Handle mouse wheel scrolling
function onWheel(e: WheelEvent) {
  e.preventDefault()

  const delta = Math.sign(e.deltaY) * 3 // Scroll 3 lines at a time
  scrollBy(delta)
}

// Public API for adding content
function appendLine(line: string) {
  buffer.value.push(line)

  if (props.followMode) {
    scrollToBottom()
  } else {
    render()
  }
}

function appendLines(lines: string[]) {
  buffer.value.push(...lines)

  if (props.followMode) {
    scrollToBottom()
  } else {
    render()
  }
}

function clear() {
  buffer.value = []
  viewport.value.startRow = 0
  render()
}

function setContent(lines: string[]) {
  buffer.value = lines

  if (props.followMode) {
    scrollToBottom()
  } else {
    render()
  }
}

// Watch for dimension changes
watch([() => props.width, () => props.height, () => props.fontSize], () => {
  if (canvas.value && ctx.value) {
    // Resize canvas
    canvas.value.width = props.width * dpr
    canvas.value.height = props.height * dpr
    ctx.value.scale(dpr, dpr)

    // Recalculate viewport
    calculateViewport()

    // Re-render
    if (props.followMode) {
      scrollToBottom()
    } else {
      render()
    }
  }
})

// Initialize
onMounted(() => {
  if (!canvas.value) return

  const context = canvas.value.getContext('2d')
  if (!context) return

  ctx.value = context

  // Set canvas physical size (bitmap)
  canvas.value.width = props.width * dpr
  canvas.value.height = props.height * dpr

  // Scale context for DPR
  ctx.value.scale(dpr, dpr)

  // Initialize character renderer
  renderer = new CharacterRenderer({
    fontSize: props.fontSize,
    fontFamily: props.fontFamily,
    color: props.color,
    dpr
  })

  renderer.measureCharWidth(ctx.value)

  // Calculate viewport
  calculateViewport()

  // Initial render
  render()
})

// Expose public API
defineExpose({
  appendLine,
  appendLines,
  clear,
  setContent,
  scrollTo,
  scrollToTop,
  scrollToBottom,
  buffer,
  viewport
})
</script>

<style scoped>
canvas {
  display: block;
}
</style>
