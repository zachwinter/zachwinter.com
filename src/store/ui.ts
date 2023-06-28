import { acceptHMRUpdate, defineStore } from 'pinia'

export const useUI = defineStore('ui', () => {
  const loading = ref(true)

  return {
    loading
  }
})

if (import.meta.hot) import.meta.hot.accept(acceptHMRUpdate(useUI, import.meta.hot))
