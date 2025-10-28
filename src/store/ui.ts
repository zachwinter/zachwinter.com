import { acceptHMRUpdate, defineStore } from 'pinia'

const DARK_MODE = '(prefers-color-scheme: dark)'

export const useUI = defineStore('ui', () => {
  const loading = ref(true)
  const menuOpen = ref(false)
  const darkMode: Ref<boolean> = ref(true)
  const initialized = ref(false)

  return {
    loading,
    menuOpen,
    darkMode,
    initialized
  }
})

if (import.meta.hot) import.meta.hot.accept(acceptHMRUpdate(useUI, import.meta.hot))
