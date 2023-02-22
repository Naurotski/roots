import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useSharedStore = defineStore('shared', () => {
  const essentialLinks = ref([
    { name: 'Home', path: '/home' },
    { name: 'Artists', path: '/artists' },
    { name: 'Exhibitions', path: '/actions/exhibitions' },
    { name: 'Events', path: '/actions/events' },
    { name: 'About', path: '/about' }
  ])
  const actionsLinks = ref(['current', 'upcoming', 'archive'])
  const rightDrawerOpen = ref(false)

  const toggleRightDrawer = () => (rightDrawerOpen.value = !rightDrawerOpen.value)

  return { essentialLinks, actionsLinks, rightDrawerOpen, toggleRightDrawer }
})
