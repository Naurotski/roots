<template>
  <transition name="fade">
    <q-card
      v-if="selectedElementId"
      style="max-width: 300px; bottom: 15%; left: 8%; position: absolute"
    >
      <q-card-section class="text-center">
        <div class="text-h6 text-bold">{{ selectedElement.name }}</div>
        <div v-if="selectedElement.material" class="text-body2">
          {{ selectedElement.material }}
        </div>
        <div v-if="selectedElement.artistName" class="text-subtitle1">
          {{ selectedElement.artistName }}
        </div>
      </q-card-section>
      <q-separator v-if="selectedElement.description" class="q-mx-md" color="negative" />
      <q-card-section v-if="selectedElement.description" class="scroll" style="max-height: 450px">
        <div class="text-justify text-body2" style="white-space: pre-line">
          {{ selectedElement.description }}
        </div>
      </q-card-section>
    </q-card>
  </transition>
  <transition name="fade">
    <q-card
      v-if="selectedElementId"
      style="max-width: 300px; bottom: 15%; right: 10%; position: absolute"
    >
      <q-card-section v-if="selectedElement.price" class="text-center">
        <div class="text-h6 text-bold">{{ selectedElement.price }} €</div>
        <payment-dialog
          :works="[
            {
              ...selectedElement,
              galleryId: selectedGallery.galleryId,
              id: selectedElement.workIdSite,
              galleryElementId: selectedElement.id
            }
          ]"
        >
        </payment-dialog>
      </q-card-section>
      <q-separator
        v-if="selectedElement.nftLink && selectedElement.price"
        class="q-mx-md"
        color="negative"
      />
      <q-card-section v-if="selectedElement.nftLink" class="text-center">
        <div class="text-h6 text-bold q-mb-xs">{{ selectedElement.nftPrice }} ETH</div>
        <q-btn
          :label="$t('common.buyNft')"
          icon="fab fa-ethereum"
          no-caps
          outline
          rounded
          style="width: 150px"
          type="a"
          :href="selectedElement.nftLink"
          target="_blank"
        />
      </q-card-section>
    </q-card>
  </transition>
</template>
<script>
import { computed, onUnmounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useI18n } from 'vue-i18n'
import { useGraphics3DStore } from 'stores/graphics3D-store'
import PaymentDialog from 'components/dialogs/PaymentDialog.vue'

export default {
  name: 'GalleryLabels',
  components: {
    PaymentDialog
  },
  setup() {
    const { locale } = useI18n({ useScope: 'global' })
    const graphics3DStore = useGraphics3DStore()
    const { selectedGallery, selectedElementId } = storeToRefs(graphics3DStore)
    const { updateSelectedElementId } = graphics3DStore
    const selectedElement = computed(() => {
      if (!selectedElementId) return
      const typeStore = selectedElementId.value.isPainting ? 'storeroom' : 'store'
      let localElement = selectedGallery.value[typeStore][selectedElementId.value.id]
      return {
        ...localElement,
        name: locale.value === 'en' ? localElement.name : localElement.nameIt,
        material: locale.value === 'en' ? localElement.material : localElement.materialIt,
        description: locale.value === 'en' ? localElement.description : localElement.descriptionIt,
        typeStore
      }
    })
    onUnmounted(() => {
      if (selectedElementId.value) updateSelectedElementId(null)
    })
    return {
      selectedGallery,
      selectedElement,
      selectedElementId
    }
  }
}
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.4s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.slide-fade-enter-active {
  transition: all 0.4s ease;
}
.slide-fade-enter-from {
  opacity: 0;
  transform: translateY(10px);
}
.slide-fade-leave-to {
  opacity: 0;
  transform: translateY(10px);
}
</style>
