<template>
  <section ref="element">
    <slot></slot>
  </section>
</template>

<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    title?: string
    label?: string
    description?: string
  }>(),
  {
    title: '',
    label: '',
    description: ''
  }
)

const element = ref<HTMLElement>()

// Register with parent Scroller
const registerSection = inject<(section: any) => void>('registerSection', () => {})
const unregisterSection = inject<(section: any) => void>('unregisterSection', () => {})

const sectionData = {
  title: computed(() => props.title),
  label: computed(() => props.label || props.title),
  element,
  description: computed(() => props.description || '')
}

onMounted(() => {
  registerSection(sectionData)
})

onBeforeUnmount(() => {
  unregisterSection(sectionData)
})
</script>

<style lang="scss" scoped>
section {
  @include size(100vw, 100%);
  @include flex;
  will-change: transform, opacity;
  overflow: hidden;
  flex-shrink: 0;
}
</style>
