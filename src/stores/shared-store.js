import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useSharedStore = defineStore('shared', () => {
  const essentialLinks = ref([
    { name: 'links.home', path: '/home' },
    { name: 'links.artists', path: '/artists' },
    { name: 'links.exhibitions', path: '/actions/exhibitions' },
    { name: 'links.events', path: '/actions/events' },
    { name: 'links.about', path: '/about' }
  ])
  const actionsLinks = ref([
    { label: 'links.current', name: 'current' },
    { label: 'links.upcoming', name: 'upcoming' },
    { label: 'links.archive', name: 'archive' }
  ])
  const rightDrawerOpen = ref(false)

  const toggleRightDrawer = () => (rightDrawerOpen.value = !rightDrawerOpen.value)

  return { essentialLinks, actionsLinks, rightDrawerOpen, toggleRightDrawer }
})
