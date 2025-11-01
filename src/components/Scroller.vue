<template>
  <div class="scroller" :class="[axis]" ref="container" @scroll="onScroll">
    <slot></slot>
  </div>
</template>

<script setup lang="ts">
interface SectionData {
  title: ComputedRef<string>
  label: ComputedRef<string>
  element: Ref<HTMLElement | undefined>
  description: ComputedRef<string>
}

interface NavigationState {
  up: SectionData | null
  down: SectionData | null
  left: SectionData | null
  right: SectionData | null
  current: SectionData | null
}

interface ScrollerState {
  activeIndex: number
  totalSections: number
  isScrolling: boolean
  scrollPosition: number
}

const props = withDefaults(
  defineProps<{
    axis?: 'y' | 'x'
  }>(),
  {
    axis: 'y'
  }
)

const emit = defineEmits<{
  'update:navigation': [NavigationState]
  'update:state': [ScrollerState]
  'section-change': [number]
}>()

const container = ref<HTMLElement>()
const sections = ref<SectionData[]>([])
const activeIndex = ref(0)
const scrolling = ref(false)
const scrollPosition = ref(0)
const viewport = useViewport()

let scrollTimeout: any

// Provide registration methods for child Sections
provide('registerSection', (section: SectionData) => {
  sections.value.push(section)
})

provide('unregisterSection', (section: SectionData) => {
  sections.value = sections.value.filter((s) => s !== section)
})

// Handle scroll events
function onScroll(e: Event) {
  const target = e.target as HTMLElement
  scrolling.value = true

  const scrollPos = props.axis === 'y' ? target.scrollTop : target.scrollLeft
  scrollPosition.value = scrollPos

  const dimension = props.axis === 'y' ? viewport.height : viewport.width
  const newIndex = Math.round(scrollPos / dimension)

  if (newIndex !== activeIndex.value) {
    activeIndex.value = newIndex
    emit('section-change', newIndex)
  }

  clearTimeout(scrollTimeout)
  scrollTimeout = setTimeout(() => {
    scrolling.value = false
  }, 150)
}

// Compute navigation state
const navigation = computed<NavigationState>(() => {
  const nav: NavigationState = {
    up: null,
    down: null,
    left: null,
    right: null,
    current: null
  }

  nav.current = sections.value[activeIndex.value]

  if (props.axis === 'y') {
    if (activeIndex.value > 0) {
      nav.up = sections.value[activeIndex.value - 1] || null
    }
    if (activeIndex.value < sections.value.length - 1) {
      nav.down = sections.value[activeIndex.value + 1] || null
    }
  } else {
    if (activeIndex.value > 0) {
      nav.left = sections.value[activeIndex.value - 1] || null
    }
    if (activeIndex.value < sections.value.length - 1) {
      nav.right = sections.value[activeIndex.value + 1] || null
    }
  }

  return nav
})

// Compute general state
const state = computed<ScrollerState>(() => ({
  activeIndex: activeIndex.value,
  totalSections: sections.value.length,
  isScrolling: scrolling.value,
  scrollPosition: scrollPosition.value
}))

// Emit navigation changes
watch(
  navigation,
  (nav) => {
    emit('update:navigation', nav)
  },
  { deep: true, immediate: true }
)

// Emit state changes
watch(
  state,
  (s) => {
    emit('update:state', s)
  },
  { deep: true, immediate: true }
)

// Navigation methods
function next() {
  if (activeIndex.value < sections.value.length - 1) {
    scrollToSection(activeIndex.value + 1)
  }
}

function prev() {
  if (activeIndex.value > 0) {
    scrollToSection(activeIndex.value - 1)
  }
}

function scrollToSection(index: number) {
  if (!container.value) return

  const dimension = props.axis === 'y' ? viewport.height : viewport.width
  const scrollOptions: ScrollToOptions = {
    behavior: 'smooth'
  }

  if (props.axis === 'y') {
    scrollOptions.top = index * dimension
  } else {
    scrollOptions.left = index * dimension
  }

  container.value.scrollTo(scrollOptions)
}

defineExpose({
  element: container,
  next,
  prev,
  scrollToSection,
  sections,
  activeIndex,
  navigation,
  state
})
</script>

<style lang="scss" scoped>
.scroller {
  @include size(100%);
  @include hide-scroll-bar;
  position: relative;
  scroll-behavior: smooth;
  will-change: transform, opacity;

  :deep(> *) {
    scroll-snap-align: start;
  }
}

.y {
  overflow-y: scroll;
  scroll-snap-type: y mandatory;
}

.x {
  @include flex-row(start, start);
  flex-wrap: no-wrap;
  overflow-x: scroll;
  scroll-snap-type: x mandatory;
}
</style>
