<template>
  <div class="absolute-bottom-left q-pa-md q-ml-xl" >
    <q-select
      ref="gallerySel"
      v-model="gallery"
      :options="options"
      dense
      rounded
      outlined
      bg-color="white"
      option-label="galleryName"
      label="Gallery Name"
      options-dense
      emit-value
      input-debounce="0"
      :disable="!!selectedElementId?.id"
      @filter="filterFn"
      style="max-width: 300px"
    >
      <template v-slot:option="scope">
        <q-item v-bind="scope.itemProps" v-on="scope.itemEvents">
          <q-item-section>
            <q-item-label :class="!scope.opt.payment && !scope.opt.free ? 'text-negative' : ''">
              {{ scope.opt.galleryName }}
            </q-item-label>
          </q-item-section>
        </q-item>
      </template>
    </q-select>
  </div>

  <!--  для использования поиска все готово просто надо добавить use-input  в  <q-select-->
  <subscribe-dialog ref="subDlg" :action="localGallery">
    <template #default>.</template>
  </subscribe-dialog>
</template>

<script>
import { ref, computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useQuasar } from 'quasar'
import { useI18n } from 'vue-i18n'
import { useGraphics3DStore } from 'stores/graphics3D-store'
import { useAuthStore } from 'stores/auth-store'
import { useMerchStore } from 'stores/merch-store'
import SubscribeDialog from 'components/dialogs/SubscribeDialog.vue'

export default {
  name: 'SelectGallery',
  components: {
    SubscribeDialog
  },
  setup() {
    const $q = useQuasar()
    const { locale } = useI18n({ useScope: 'global' })
    const authStore = useAuthStore()
    const { loggedIn } = storeToRefs(authStore)
    const { showLoginDialog } = authStore
    const graphics3DStore = useGraphics3DStore()
    const { listGalleries, selectedGallery, selectedElementId, filteredListGalleriesNonDraft } =
      storeToRefs(graphics3DStore)
    const { getGraphics3D, listenForChildEvents, clearSelectedGallery } = graphics3DStore
    if (!Object.keys(listGalleries.value).length) listenForChildEvents('listGalleries')
    const merchStore = useMerchStore()
    const { getRealtimeDatabase } = merchStore
    const options = ref([])
    const gallerySel = ref(null)
    const subDlg = ref(null)
    const localGallery = ref({})
    const sortedGalleries = computed(() =>
      Object.values(filteredListGalleriesNonDraft.value).sort((a, b) => {
        if (a.galleryName > b.galleryName) return 1
        if (a.galleryName < b.galleryName) return -1
        return 0
      })
    )
    const gallery = computed({
      get() {
        if (selectedGallery.value.galleryId) {
          return filteredListGalleriesNonDraft.value[selectedGallery.value.galleryId]
        } else {
          return null
        }
      },
      async set(val) {
        if (val.free) {
          if (selectedGallery.value.galleryId) {
            await clearSelectedGallery()
          }
          await getGraphics3D(`galleries/${val.galleryId}`)
          gallerySel.value?.hidePopup()
          gallerySel.value?.blur?.()
          return
        }
        if (!loggedIn.value) {
          if ($q.fullscreen.isActive) $q.fullscreen.exit()
          showLoginDialog(true)
          return
        }
        if (val.payment) {
          if (selectedGallery.value.galleryId) {
            await clearSelectedGallery()
          }
          await getGraphics3D(`galleries/${val.galleryId}`)
          gallerySel.value?.hidePopup()
          gallerySel.value?.blur?.()
          return
        }
        const action = await getRealtimeDatabase(`exhibitions/${val.galleryId}`)
        if (locale.value === 'it') {
          localGallery.value = {
            ...action,
            city: action.cityIt,
            description: action.descriptionIt,
            name: action.nameIt,
            works: action.works.map((item) => ({
              ...item,
              description: item.descriptionIt,
              name: item.nameIt
            }))
          }
        } else {
          localGallery.value = action
        }
        subDlg.value.dialogActivator = true
      }
    })
    const filterFn = (val, update) => {
      update(() => {
        const needle = val.toLowerCase()
        options.value = sortedGalleries.value.filter(
          (item) => item.galleryName.toLowerCase().indexOf(needle) > -1
        )
      })
    }
    return {
      gallery,
      options,
      gallerySel,
      subDlg,
      selectedGallery,
      selectedElementId,
      localGallery,
      filterFn
    }
  }
}
</script>

<style scoped></style>
