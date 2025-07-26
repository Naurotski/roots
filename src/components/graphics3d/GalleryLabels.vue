<template>
  <q-card
    v-if="selectedElementId"
    style="max-width: 300px; bottom: 10%; left: 8%; position: absolute"
  >
    <q-card-section class="text-center">
      <div class="text-h6 text-bold">{{ selectedElement.name }}</div>
      <div v-if="selectedElement.artistName" class="text-body2">
        {{ selectedElement.artistName }}
      </div>
    </q-card-section>
    <template v-if="selectedElement.description">
      <q-separator class="q-mx-md" color="negative" />

      <q-card-section>
        <div class="text-justify text-body2" style="white-space: pre-line">
          {{ selectedElement.description }}
        </div>
      </q-card-section>
    </template>
  </q-card>
</template>
<script>
import { computed, onUnmounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useI18n } from 'vue-i18n'
import { useGraphics3DStore } from 'stores/graphics3D-store'

export default {
  name: 'GalleryLabels',
  setup() {
    const { locale } = useI18n({ useScope: 'global' })
    const graphics3DStore = useGraphics3DStore()
    const { selectedGallery, selectedElementId } = storeToRefs(graphics3DStore)
    const { updateSelectedElementId } = graphics3DStore
    const selectedElement = computed(() => {
      if (!selectedElementId) return
      if (selectedElementId.value.isPainting) {
        let localElement = selectedGallery.value.storeroom[selectedElementId.value.id]
        return {
          name: locale.value === 'en' ? localElement.namePainting : localElement.nameItPainting,
          description:
            locale.value === 'en'
              ? localElement.descriptionPainting
              : localElement.descriptionItPainting,
          artistName: localElement.artistName
        }
      } else {
        let localElement = selectedGallery.value.store[selectedElementId.value.id]
        return {
          name: locale.value === 'en' ? localElement.nameObject : localElement.nameItObject,
          description:
            locale.value === 'en'
              ? localElement.descriptionObject
              : localElement.descriptionItObject,
          artistName: localElement.artistName
        }
      }
    })
    onUnmounted(() => {
      if (selectedElementId.value) updateSelectedElementId(null)
    })
    return {
      selectedElement,
      selectedElementId
    }
  }
}
</script>

<style scoped></style>
