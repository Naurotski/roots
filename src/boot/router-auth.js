import { boot } from 'quasar/wrappers'
import { LocalStorage } from 'quasar'
import { useGraphics3DStore } from 'stores/graphics3D-store'
import { storeToRefs } from 'pinia'

export default boot(({ router }) => {
  router.beforeEach((to) => {
    if (
      !LocalStorage.getItem('loggedIn') &&
      (to.name === 'Your Account' || to.name === '3D Gallery')
    ) {
      return { name: 'Home' }
    }
    if (to.name === '3D Gallery') {
      const graphicsStore = useGraphics3DStore()
      const id = String(to.params.galleryId)
      const { filteredListGalleriesNonDraft } = storeToRefs(graphicsStore)
      const payment = filteredListGalleriesNonDraft.value[id]?.payment
      if (!payment) {
        return { name: 'Home' } // или на страницу оплаты/превью
      }
    }
  })
})
