import { boot } from 'quasar/wrappers'
import { storeToRefs } from 'pinia'
import { LocalStorage, Loading } from 'quasar'
import { useGraphics3DStore } from 'stores/graphics3D-store'

const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

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
      const { listenForChildEvents } = graphicsStore
      const id = String(to.params.galleryId)
      let payment = filteredListGalleriesNonDraft.value[id]?.payment
      if (!payment) {
        // запускаем загрузку и ждём немного
        listenForChildEvents('listGalleries')
        Loading.show()
        try {
          await sleep(2000)
          payment = filteredListGalleriesNonDraft.value[id]?.payment
          if (!payment) {
            return { name: 'Home' }
          }
        } finally {
          Loading.hide()
        }
      }
    }
  })
})
