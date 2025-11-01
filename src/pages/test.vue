<template>
  <main style="background: #0f0611; padding: 2rem; min-height: 100vh">
    <h2 style="color: #996699; margin-bottom: 1rem">CanvasText (Animated)</h2>
    <CanvasText
      :text="text"
      :fontSize="16"
      :width="600"
      :height="200"
      color="#996699"
      :animated="true"
      :cascadeDelay="40"
      :enterDuration="100"
    />
    <button @click="changeText" class="btn">
      Change Text
    </button>

    <h2 style="color: #996699; margin: 3rem 0 1rem">CanvasTerminal (Grid Viewport + Syntax Highlighting)</h2>
    <CanvasTerminal
      ref="terminal"
      :fontSize="14"
      :width="800"
      :height="400"
      color="#81A1C1"
      :followMode="followMode"
      :language="language"
    />
    <div style="display: flex; gap: 1rem; margin-top: 1rem; flex-wrap: wrap">
      <button @click="addLine" class="btn">Add Line</button>
      <button @click="addManyLines" class="btn">Add 100 Lines</button>
      <button @click="streamCode" class="btn">Stream TypeScript</button>
      <button @click="clearTerminal" class="btn">Clear</button>
      <button @click="toggleFollow" class="btn">
        Follow: {{ followMode ? 'ON' : 'OFF' }}
      </button>
      <button @click="toggleLanguage" class="btn">
        Lang: {{ language || 'none' }}
      </button>
    </div>
  </main>
</template>

<script lang="ts" setup>
const ui = useUI()
const text = ref('lets fucking go')
const terminal = ref()
const followMode = ref(true)
const language = ref('typescript')
let lineCount = 0

const sampleCode = `import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useCounter = defineStore('counter', () => {
  const count = ref(0)
  const doubled = computed(() => count.value * 2)

  function increment() {
    count.value++
  }

  function decrement() {
    count.value--
  }

  return { count, doubled, increment, decrement }
})

// Usage
const counter = useCounter()
counter.increment()
console.log(counter.doubled) // 2`.split('\n')

const messages = [
  'lets fucking go',
  'canvas text rendering with zero DOM thrashing',
  'streaming at 80 tokens per second baby',
  'character animations that scale and cascade',
  'transform origin on the bottom left for that crispy scaling',
  'your portfolio is about to be absolutely fire'
]

let index = 0
function changeText() {
  index = (index + 1) % messages.length
  text.value = messages[index]
}

function addLine() {
  lineCount++
  terminal.value?.appendLine(`[${lineCount.toString().padStart(4, '0')}] Line of text in the terminal buffer`)
}

function addManyLines() {
  const lines = []
  for (let i = 0; i < 100; i++) {
    lineCount++
    lines.push(`[${lineCount.toString().padStart(4, '0')}] Generated line ${i + 1}/100`)
  }
  terminal.value?.appendLines(lines)
}

function clearTerminal() {
  terminal.value?.clear()
  lineCount = 0
}

function toggleFollow() {
  followMode.value = !followMode.value
}

function toggleLanguage() {
  const langs = ['', 'typescript', 'python', 'javascript']
  const currentIndex = langs.indexOf(language.value)
  language.value = langs[(currentIndex + 1) % langs.length]
}

async function streamCode() {
  terminal.value?.clear()
  lineCount = 0

  // Simulate streaming at ~80 lines/sec
  for (const line of sampleCode) {
    terminal.value?.appendLine(line)
    await new Promise(resolve => setTimeout(resolve, 50)) // ~20 lines/sec for demo
  }
}

ui.loading = false

// Auto-cycle text demo
onMounted(() => {
  setInterval(() => {
    changeText()
  }, 3000)

  // Add some initial syntax-highlighted code
  terminal.value?.appendLine('// CanvasTerminal with Syntax Highlighting')
  terminal.value?.appendLine('')
  sampleCode.forEach((line) => {
    terminal.value?.appendLine(line)
  })
  terminal.value?.appendLine('')
  terminal.value?.appendLine('// Click "Stream TypeScript" to see streaming in action!')
  terminal.value?.appendLine('// Toggle language to see different highlighting')
})
</script>

<style scoped>
.btn {
  padding: 0.75rem 1.5rem;
  background: #996699;
  color: white;
  border: none;
  cursor: pointer;
  border-radius: 0.25rem;
  font-family: monospace;
  transition: opacity 0.2s;
}

.btn:hover {
  opacity: 0.8;
}
</style>
