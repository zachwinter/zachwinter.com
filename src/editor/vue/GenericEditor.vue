<template>
  <aside ref="container"></aside>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, onBeforeUnmount } from 'vue'
import GenericEditor, { type ErrorObject } from '../codemirror'
import { LanguageRegistry } from '..'
import {
  glslLanguageDefinition,
  javascriptLanguageDefinition,
  rustLanguageDefinition,
  pythonLanguageDefinition,
  cppLanguageDefinition,
  htmlLanguageDefinition,
  xmlLanguageDefinition,
  vueLanguageDefinition
} from '../languages'

LanguageRegistry.register(javascriptLanguageDefinition)
LanguageRegistry.register(glslLanguageDefinition)
LanguageRegistry.register(rustLanguageDefinition)
LanguageRegistry.register(pythonLanguageDefinition)
LanguageRegistry.register(cppLanguageDefinition)
LanguageRegistry.register(htmlLanguageDefinition)
LanguageRegistry.register(xmlLanguageDefinition)
LanguageRegistry.register(vueLanguageDefinition)

const props = defineProps<{
  modelValue: string
  languageId: string
  languageOptions?: any
  error?: any
}>()

const $emits = defineEmits(['update:modelValue', 'node-click'])
const container = ref()
const editor = shallowRef()

function init() {
  if (!container.value) return
  if (editor.value) {
    editor.value.destroy()
    editor.value = null
  }

  editor.value = new GenericEditor({
    target: container.value,
    content: props.modelValue,
    languageId: props.languageId,
    languageOptions: props.languageOptions,
    onUpdate: (update) => {
      const { docChanged } = update
      if (docChanged) {
        const newValue = editor.value?.getContent() || ''
        $emits('update:modelValue', newValue)
      }
    }
  })
}

function destroy() {
  if (editor.value) {
    editor.value.destroy()
    editor.value = null
  }
}

function convertError(error: any): ErrorObject | null {
  if (!error?.line || !error?.message) return null

  return {
    message: `${error.message}${error.problem ? ` (${error.problem})` : ''}`,
    line: error.line,
    severity: 'error'
  }
}

watch(
  () => props.error,
  (newError) => {
    if (!editor.value) return

    if (newError) {
      const errorObj = convertError(newError)
      if (errorObj) {
        editor.value.setErrors([errorObj])
      }
    } else {
      editor.value.clearErrors()
    }
  },
  { deep: true }
)

// Watch for language changes
watch(
  () => props?.languageId,
  (newLanguageId) => {
    if (editor?.value) {
      const newOptions = props?.languageOptions
      editor.value.setLanguage(newLanguageId, newOptions)
    }
  },
  { deep: true }
)

watch(
  () => props?.languageOptions,
  (newOptions) => {
    if (editor.value) {
      editor.value.setLanguageOptions(newOptions)
    }
  },
  { deep: true }
)

watch(
  () => props.modelValue,
  (newContent) => {
    console.log(newContent)
    if (editor.value && editor.value.getContent() !== newContent) {
      editor.value.setContent(newContent)
    }
  }
)

onMounted(() => {
  init()
})

onBeforeUnmount(() => {
  destroy()
})
</script>
