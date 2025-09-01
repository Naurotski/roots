<template>
  <q-select
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
    lazy-rules
    :disable="!!selectedElementId?.id"
    @filter="filterFn"
    :rules="[(val) => (val && val.galleryName.length > 0) || 'Please choose something']"
    style="bottom: 3%; left: 5%; position: absolute; width: 300px"
  />
  <!--  для использования поиска все готово просто надо добавить use-input  в  <q-select-->
  <!--    <pre>selectedGallery - {{ selectedGallery }}</pre>-->
</template>

<script>
import { ref, computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useGraphics3DStore } from 'stores/graphics3D-store'

export default {
  name: 'SelectGallery',
  setup() {
    const graphics3DStore = useGraphics3DStore()
    const { listGalleries, selectedGallery, selectedElementId, filteredListGalleriesNonDraft } =
      storeToRefs(graphics3DStore)
    const { listenForChildEvents, clearSelectedGallery } = graphics3DStore
    if (!Object.keys(listGalleries.value).length) listenForChildEvents('listGalleries')
    const options = ref('')
    const sortedGalleries = computed(() =>
      Object.values(filteredListGalleriesNonDraft.value)
        .filter((item) => !!item.payment)
        .sort((a, b) => {
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
      set(val) {
        if (selectedGallery.value.galleryId) {
          clearSelectedGallery()
        }
        listenForChildEvents(`galleries/${val.galleryId}`)
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
      selectedGallery,
      selectedElementId,
      filterFn
    }
  }
}
</script>

<style scoped></style>
