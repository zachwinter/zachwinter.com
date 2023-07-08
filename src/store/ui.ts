import { acceptHMRUpdate, defineStore } from 'pinia'

const DARK_MODE = '(prefers-color-scheme: dark)'

export const useUI = defineStore('ui', () => {
  const loading = ref(true)
  const menuOpen = ref(false)
  const darkMode: Ref<boolean> = ref(true)

  return {
    loading,
    menuOpen,
    darkMode
  }
})

if (import.meta.hot) import.meta.hot.accept(acceptHMRUpdate(useUI, import.meta.hot))
