import { boot } from 'quasar/wrappers'
import { storeToRefs } from 'pinia'
import { LocalStorage } from 'quasar'
import { startNetworkStatus } from 'src/composables/network/useNetworkStatus'
import { useGraphics3DStore } from 'stores/graphics3D-store'
// import { i18n } from 'boot/i18n'

export default boot(({ router }) => {
  startNetworkStatus()
  router.beforeEach(async (to) => {
    if (!LocalStorage.getItem('loggedIn') && to.name === 'Your Account') {
      return { name: 'Home' }
    }
    if (to.name === '3D Gallery') {
      // const t = i18n.global.t
      // if (Screen.lt.md) {
      //   Notify.create({
      //     type: 'warning',
      //     icon: 'smartphone',
      //     message: t('graphics3D.virtualAvailable'),
      //     position: 'top',
      //     timeout: 8000
      //   })
      //   return { name: 'Home' }
      // }
      const graphicsStore = useGraphics3DStore()
      const { filteredListGalleriesNonDraft, listGalleries } = storeToRefs(graphicsStore)
      const { getGraphics3D } = graphicsStore
      const id = String(to.params.galleryId)
      let free = listGalleries.value[id]?.free
      let payment = filteredListGalleriesNonDraft.value[id]?.payment
      if (!free && !payment) {
        await getGraphics3D('listGalleries')
        free = listGalleries.value[id]?.free
        payment = filteredListGalleriesNonDraft.value[id]?.payment
        if (!free && !payment) {
          return { name: 'Home' }
        }
      }
    }
  })
})
