<template>
  <transition name="fade" mode="out-in">
    <q-card
      v-if="selectedElementId"
      :key="selectedElementId.id + '-left'"
      style="width: 300px; position: absolute; z-index: 2"
      :style="leftStyle"
    >
      <q-btn
        size="sm"
        class="absolute-top-right z-max"
        flat
        round
        icon="close"
        @click="deleteSelectedElementId"
      />
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
      <q-card-section
        v-if="selectedElement.description"
        class="scroll"
        :style="{
          maxHeight:
            $q.screen.width / $q.screen.height > 1 && $q.screen.height < 600 ? '50vh' : '30vh'
        }"
      >
        <div class="text-justify text-body2" style="white-space: pre-line">
          {{ selectedElement.description }}
        </div>
      </q-card-section>
    </q-card>
  </transition>
  <transition name="fade" mode="out-in">
    <q-card
      v-if="selectedElementId"
      :key="selectedElementId.id"
      style="width: 300px; position: absolute; z-index: 2"
      :style="rightStyle"
    >
      <q-btn
        v-if="selectedElement.nftLink && selectedElement.price"
        size="sm"
        class="absolute-top-right z-max"
        flat
        round
        icon="close"
        @click="deleteSelectedElementId"
      />
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
      const typeStore = selectedElementId.value.isPainting
        ? 'storeroom'
        : selectedElementId.value.isSticker
        ? 'storeStickers'
        : 'store'
      let localElement = selectedGallery.value[typeStore][selectedElementId.value.id]
      return {
        ...localElement,
        name: locale.value === 'en' ? localElement.name : localElement.nameIt,
        material: locale.value === 'en' ? localElement.material : localElement.materialIt,
        description: locale.value === 'en' ? localElement.description : localElement.descriptionIt,
        typeStore
      }
    })

    const bounds = computed(() => selectedElementId.value?.screenBounds || null)
    const CARD_W = 300
    const GAP = 16
    const MARGIN = 8

    const isPortrait = computed(() => window.innerHeight > window.innerWidth)

    const leftStyle = computed(() => {
      if (!bounds.value) return {}
      const vw = window.innerWidth
      const vh = window.innerHeight
      const b = bounds.value
      const xMid = (b.xMin + b.xMax) / 2
      const yMid = (b.yMin + b.yMax) / 2

      if (isPortrait.value) {
        // сверху над объектом (по центру), сдвигаем на -100% собственной высоты
        const left = Math.min(Math.max(MARGIN, xMid - CARD_W / 2), vw - CARD_W - MARGIN)
        // const top = Math.max(MARGIN, b.yMin - GAP)
        return {
          width: `${CARD_W}px`,
          left: `${left}px`,
          top: `${MARGIN}px`
          // transform: 'translateY(-100%)'
        }
      }

      // слева по вертикальному центру (не зависит от высоты)
      let left = b.xMin - GAP - CARD_W
      if (left < MARGIN) left = MARGIN
      const top = Math.min(Math.max(MARGIN, yMid), vh - MARGIN)
      return {
        width: `${CARD_W}px`,
        left: `${left}px`,
        top: `${top}px`,
        transform: 'translateY(-50%)'
      }
    })

    const rightStyle = computed(() => {
      if (!bounds.value) return {}
      const vw = window.innerWidth
      const vh = window.innerHeight
      const b = bounds.value
      const xMid = (b.xMin + b.xMax) / 2
      const yMid = (b.yMin + b.yMax) / 2

      if (isPortrait.value) {
        // снизу под объектом (по центру)
        const left = Math.min(Math.max(MARGIN, xMid - CARD_W / 2), vw - CARD_W - MARGIN)
        // const top = Math.min(vh - MARGIN, b.yMax + GAP)
        return {
          width: `${CARD_W}px`,
          left: `${left}px`,
          bottom: `${MARGIN}px`
        }
      }

      // справа по вертикальному центру
      let left = b.xMax + GAP
      if (left + CARD_W > vw - MARGIN) left = vw - CARD_W - MARGIN
      const top = Math.min(Math.max(MARGIN, yMid), vh - MARGIN)
      return {
        width: `${CARD_W}px`,
        left: `${left}px`,
        top: `${top}px`,
        transform: 'translateY(-50%)'
      }
    })

    const deleteSelectedElementId = () => updateSelectedElementId(null)
    onUnmounted(() => {
      if (selectedElementId.value) updateSelectedElementId(null)
    })
    return {
      selectedGallery,
      selectedElement,
      selectedElementId,
      leftStyle,
      rightStyle,
      deleteSelectedElementId
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
</style>
