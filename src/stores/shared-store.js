import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useSharedStore = defineStore('shared', () => {
  const essentialLinks = ref(['Home', 'Artists', 'Exhibitions', 'About'])
  const exhibitionsLinks = ref(['current', 'upcoming', 'archive'])
  const rightDrawerOpen = ref(false)

  const toggleRightDrawer = () => (rightDrawerOpen.value = !rightDrawerOpen.value)

  return { essentialLinks, exhibitionsLinks, rightDrawerOpen, toggleRightDrawer }
})
