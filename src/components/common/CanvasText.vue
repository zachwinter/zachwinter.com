<template>
  <canvas ref="canvas" :width="width" :height="height" :style="canvasStyle" class="canvas-text" />
</template>

<script setup lang="ts">
import { ease } from '@/util/easing'
import { CharacterRenderer, type CharRenderOptions } from '@/classes/CharacterRenderer'

// Animation function type: returns transform values for a character
export type CharAnimationFn = (params: {
  elapsed: number
  duration: number
  charIndex: number
  totalChars: number
  cascadeDelay: number
  lineHeight: number
}) => {
  opacity: number
  scale: number
  translateX: number
  translateY: number
}

// Character state tracking
interface CharState {
  char: string
  index: number // Index in full text string
  row: number
  col: number
  enteredAt: number
  exitingAt: number | null
}

interface Props {
  text: string
  fontSize?: number
  fontFamily?: string
  color?: string
  width?: number
  height?: number
  lineHeight?: number
  padding?: number
  enterAnimation?: CharAnimationFn
  exitAnimation?: CharAnimationFn
  enterDuration?: number
  exitDuration?: number
  cascadeDelay?: number
  animated?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  text: '',
  fontSize: 16,
  fontFamily: `'Doto', monospace`,
  color: 'var(--purple)',
  width: 100,
  height: 200,
  lineHeight: 1,
  padding: 0,
  enterDuration: 300,
  exitDuration: 200,
  cascadeDelay: 30,
  animated: true
})

const canvas = ref<HTMLCanvasElement>()
const ctx = ref<CanvasRenderingContext2D>()
const dpr = window.devicePixelRatio
const raf = useRAF()

// Character renderer
let renderer: CharacterRenderer

// Character states
const charStates = ref<CharState[]>([])
const animating = ref(false)

// Computed values
const lineHeightPx = computed(() => props.fontSize * props.lineHeight)
const maxCols = computed(() => {
  if (!renderer || !renderer.charWidth) return 1
  return Math.floor((props.width - props.padding * 2) / renderer.charWidth)
})
const maxRows = computed(() => Math.floor((props.height - props.padding * 2) / lineHeightPx.value))

// Default animations
const defaultEnterAnimation: CharAnimationFn = ({
  elapsed,
  duration,
  charIndex,
  cascadeDelay,
  lineHeight
}) => {
  const delay = charIndex * cascadeDelay
  const t = Math.max(0, Math.min(1, (elapsed - delay) / duration))
  const eased = ease(t)

  return {
    opacity: eased,
    scale: 0.7 + 0.3 * eased,
    translateX: 0,
    translateY: 0
  }
}

const defaultExitAnimation: CharAnimationFn = ({
  elapsed,
  duration,
  charIndex,
  cascadeDelay,
  lineHeight
}) => {
  const delay = charIndex * cascadeDelay
  const t = Math.max(0, Math.min(1, (elapsed - delay) / duration))
  const eased = ease(t)

  return {
    opacity: 1 - eased,
    scale: 1,
    translateX: 0,
    translateY: lineHeight * eased
  }
}

const canvasStyle = computed(() => ({
  width: `${props.width}px`,
  height: `${props.height}px`
}))

// Layout text into lines with word wrapping
function layoutText(text: string): string[] {
  const lines: string[] = []
  const words = text.split(' ')
  let currentLine = ''

  for (const word of words) {
    const testLine = currentLine ? `${currentLine} ${word}` : word

    if (testLine.length <= maxCols.value) {
      currentLine = testLine
    } else {
      if (currentLine) {
        lines.push(currentLine)
      }
      // If single word is longer than maxCols, break it
      if (word.length > maxCols.value) {
        let remaining = word
        while (remaining.length > 0) {
          lines.push(remaining.slice(0, maxCols.value))
          remaining = remaining.slice(maxCols.value)
        }
        currentLine = ''
      } else {
        currentLine = word
      }
    }
  }

  if (currentLine) {
    lines.push(currentLine)
  }

  // Limit to maxRows
  return lines.slice(0, maxRows.value)
}

// Render text to canvas with transforms
function render(now?: number) {
  if (!ctx.value || !canvas.value || !renderer) return

  // Clear canvas (use logical dimensions, context is already scaled)
  ctx.value.clearRect(0, 0, props.width, props.height)

  if (!props.animated || charStates.value.length === 0) {
    // Fast path: no animations
    const lines = layoutText(props.text)
    lines.forEach((line, rowIndex) => {
      for (let colIndex = 0; colIndex < line.length; colIndex++) {
        const char = line[colIndex]
        const x = props.padding + colIndex * renderer.charWidth
        const y = props.padding + rowIndex * lineHeightPx.value
        renderer.renderChar(ctx.value!, char, x, y, props.color)
      }
    })
    return
  }

  // Animated path: apply transforms per character
  const enterAnim = props.enterAnimation || defaultEnterAnimation
  const exitAnim = props.exitAnimation || defaultExitAnimation
  const _now = now || performance.now()

  charStates.value.forEach((state) => {
    // Base position
    const baseX = props.padding + state.col * renderer.charWidth
    const baseY = props.padding + state.row * lineHeightPx.value

    // Calculate transform
    let transform = { opacity: 1, scale: 1, translateX: 0, translateY: 0 }

    if (state.exitingAt !== null) {
      // Exiting
      const elapsed = _now - state.exitingAt
      transform = exitAnim({
        elapsed,
        duration: props.exitDuration,
        charIndex: state.index,
        totalChars: charStates.value.length,
        cascadeDelay: props.cascadeDelay,
        lineHeight: lineHeightPx.value
      })
    } else {
      // Entering
      const elapsed = _now - state.enteredAt
      transform = enterAnim({
        elapsed,
        duration: props.enterDuration,
        charIndex: state.index,
        totalChars: charStates.value.length,
        cascadeDelay: props.cascadeDelay,
        lineHeight: lineHeightPx.value
      })
    }

    // Render with transform
    renderer.renderChar(ctx.value!, state.char, baseX, baseY, props.color, transform)
  })
}

// Build character states from text
function buildCharStates(text: string): CharState[] {
  const lines = layoutText(text)
  const states: CharState[] = []
  const now = performance.now()

  let index = 0
  lines.forEach((line, rowIndex) => {
    for (let colIndex = 0; colIndex < line.length; colIndex++) {
      states.push({
        char: line[colIndex],
        index,
        row: rowIndex,
        col: colIndex,
        enteredAt: now,
        exitingAt: null
      })
      index++
    }
  })

  return states
}

// Start animation loop
function startAnimation(duration: number, id: string) {
  if (!props.animated) return

  animating.value = true

  raf.add(
    (now) => {
      render(now)
    },
    {
      id,
      duration,
      autoStart: true
    }
  )
}

// Stop animation
function stopAnimation(id: string) {
  raf.remove(id)
  animating.value = false
}

// Handle text changes
watch(
  () => props.text,
  (newText, oldText) => {
    // Don't process until renderer is ready
    if (!renderer) return

    if (!props.animated) {
      charStates.value = []
      render()
      return
    }

    // Stop any existing animations
    stopAnimation('canvas-text-enter')
    stopAnimation('canvas-text-exit')

    // Build new character states
    charStates.value = buildCharStates(newText)

    // Calculate total animation duration (including cascade)
    const totalDuration = props.enterDuration + charStates.value.length * props.cascadeDelay

    // Start enter animation
    startAnimation(totalDuration, 'canvas-text-enter')
  }
)

watch(
  () => props.color,
  () => {
    // Clear cache when color changes
    if (renderer) {
      renderer.clearCache()
      render()
    }
  }
)

watch(
  () => props.fontSize,
  () => {
    if (renderer && ctx.value) {
      renderer.updateSettings({ fontSize: props.fontSize })
      renderer.measureCharWidth(ctx.value)
      if (props.text) {
        charStates.value = buildCharStates(props.text)
      }
      render()
    }
  }
)

// Initialize
onMounted(() => {
  if (!canvas.value) return

  const context = canvas.value.getContext('2d')
  if (!context) return

  ctx.value = context

  // Set canvas physical size (bitmap)
  canvas.value.width = props.width * dpr
  canvas.value.height = props.height * dpr

  // Scale context so we can draw in logical pixels
  ctx.value.scale(dpr, dpr)

  // Initialize character renderer
  renderer = new CharacterRenderer({
    fontSize: props.fontSize,
    fontFamily: props.fontFamily,
    color: props.color,
    dpr
  })

  renderer.measureCharWidth(ctx.value)

  // Process initial text if present
  if (props.text && props.animated) {
    charStates.value = buildCharStates(props.text)
    const totalDuration = props.enterDuration + charStates.value.length * props.cascadeDelay
    startAnimation(totalDuration, 'canvas-text-enter')
  } else {
    render()
  }
})

// Cleanup
onBeforeUnmount(() => {
  stopAnimation('canvas-text-enter')
  stopAnimation('canvas-text-exit')
})
</script>

<style scoped>
canvas {
  display: block;
  pointer-events: none;
}
</style>
