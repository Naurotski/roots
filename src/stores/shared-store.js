import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useSharedStore = defineStore('shared', () => {
  const essentialLinks = ref(['Home', 'About', 'Artists', 'Exhibitions'])
  const rightDrawerOpen = ref(false)

  const toggleRightDrawer = () => (rightDrawerOpen.value = !rightDrawerOpen.value)

  return { essentialLinks, rightDrawerOpen, toggleRightDrawer }
})
