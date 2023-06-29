import { acceptHMRUpdate, defineStore } from 'pinia'
import { matchMedia, watchMatchMedia } from '../util/css'

const DARK_MODE = '(prefers-color-scheme: dark)'

export const useUI = defineStore('ui', () => {
  const loading = ref(true)
  const menuOpen = ref(false)
  const darkMode: Ref<boolean> = ref(matchMedia(DARK_MODE))

  watchMatchMedia(DARK_MODE, (val:boolean) => {
    darkMode.value = val
  })

  return {
    loading,
    menuOpen,
    darkMode
  }
})

if (import.meta.hot) import.meta.hot.accept(acceptHMRUpdate(useUI, import.meta.hot))
