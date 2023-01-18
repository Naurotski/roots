import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useSharedStore = defineStore('shared', () => {
  const essentialLinks = ref([
    {
      title: 'Home',
      caption: 'quasar.dev',
      icon: 'school'
    },
    {
      title: 'Test',
      caption: 'github.com/quasarframework',
      icon: 'code'
    }
  ])
  const rightDrawerOpen = ref(false)

  const toggleRightDrawer = () => {
    console.log(rightDrawerOpen.value)
    rightDrawerOpen.value = !rightDrawerOpen.value
  }

  return { essentialLinks, rightDrawerOpen, toggleRightDrawer }
})
