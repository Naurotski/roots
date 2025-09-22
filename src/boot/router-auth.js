import { boot } from 'quasar/wrappers'
import { storeToRefs } from 'pinia'
import { LocalStorage } from 'quasar'
import { useGraphics3DStore } from 'stores/graphics3D-store'

export default boot(({ router }) => {
  router.beforeEach(async (to) => {
    if (
      !LocalStorage.getItem('loggedIn') &&
      (to.name === 'Your Account' || to.name === '3D Gallery')
    ) {
      return { name: 'Home' }
    }
    if (to.name === '3D Gallery') {
      const graphicsStore = useGraphics3DStore()
      const { filteredListGalleriesNonDraft } = storeToRefs(graphicsStore)
      const { getGraphics3D } = graphicsStore
      const id = String(to.params.galleryId)

      let payment = filteredListGalleriesNonDraft.value[id]?.payment
      if (!payment) {
        await getGraphics3D('listGalleries')
        payment = filteredListGalleriesNonDraft.value[id]?.payment
        if (!payment) {
          return { name: 'Home' }
        }
      }
    }
  })
})
