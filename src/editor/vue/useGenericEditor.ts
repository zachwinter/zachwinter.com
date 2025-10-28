import { ref, watch, onMounted, type Ref, onBeforeUnmount } from 'vue'
import GenericEditor, { type OnClickValueHandler, type ErrorObject } from '../codemirror'
import P from '../../components/typography/P.vue'

export interface EditorRefs {
  modelValue: Ref<string>
  languageId: Ref<string>
  languageOptions?: Ref<any>
  error: Ref<any>
}

export function useGenericEditor(
  parentDOMElement: Ref<HTMLElement | undefined>,
  refs: EditorRefs,
  onUpdate: (value: string) => void,
  onClickValue?: OnClickValueHandler
) {
  const editor = ref<GenericEditor | null>(null)

  watch(
    () => refs.modelValue.value,
    (val) => {
      console.log(val)
    }
  )
  function init() {
    if (!parentDOMElement.value) return

    // Destroy existing editor
    if (editor.value) {
      editor.value.destroy()
      editor.value = null
    }

    // Create new editor instance
    editor.value = new GenericEditor({
      target: parentDOMElement.value,
      content: refs.modelValue.value,
      languageId: refs.languageId.value,
      languageOptions: refs.languageOptions?.value,
      onClick: onClickValue,
      onUpdate: (update) => {
        const { docChanged } = update
        if (docChanged) {
          const newValue = editor.value?.getContent() || ''
          onUpdate(newValue)
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

  // Convert error object to ErrorObject format
  function convertError(error: any): ErrorObject | null {
    if (!error?.line || !error?.message) return null

    return {
      message: `${error.message}${error.problem ? ` (${error.problem})` : ''}`,
      line: error.line,
      severity: 'error'
    }
  }

  // Watch for error changes
  watch(
    () => refs?.error?.value,
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
    () => refs?.languageId?.value,
    (newLanguageId) => {
      if (editor?.value) {
        const newOptions = refs?.languageOptions?.value
        editor.value.setLanguage(newLanguageId, newOptions)
      }
    },
    { deep: true }
  )

  if (refs?.languageOptions) {
    watch(
      () => refs?.languageOptions,
      (newOptions) => {
        if (editor.value) {
          editor.value.setLanguageOptions(newOptions)
        }
      },
      { deep: true }
    )
  }

  watch(
    () => refs.modelValue.value,
    (newContent) => {
      if (editor.value && editor.value.getContent() !== newContent) {
        editor.value.setContent(newContent)
      }
    },
    {
      deep: true,
      immediate: true
    }
  )

  // Initialize on mount
  onMounted(() => {
    init()
  })

  onBeforeUnmount(() => {
    editor.value?.destroy?.()
  })

  return {
    editor,
    init,
    destroy
  }
}
