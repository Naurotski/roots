<template>
  <q-page class="q-pa-none">
    <div class="fs-root" ref="fsRoot" :class="{ 'fs-emulated': headerFooterHidden }">
      <gallery3-d />
      <how-to v-if="mode === 'keyboard' && showCard">
        <q-btn
          class="absolute-top-right"
          flat
          round
          icon="close"
          color="negative"
          @click="showCard = false"
        />
      </how-to>
      <how-to-touch v-if="mode !== 'keyboard' && showCard">
        <q-btn
          class="absolute-top-right"
          flat
          round
          icon="close"
          color="negative"
          @click="showCard = false"
      /></how-to-touch>
      <gallery-labels />
      <gallery3-d-video-sound />
      <select-gallery />
      <q-btn
        :color="shouldBlink ? 'red' : 'white'"
        text-color="black"
        class="absolute-top-left"
        :class="[
          mode === 'keyboard' ? 'q-mt-xl q-ml-xl' : 'q-mt-md q-ml-md',
          { blink: shouldBlink }
        ]"
        round
        :icon="$q.fullscreen.isActive || headerFooterHidden ? 'fullscreen_exit' : 'fullscreen'"
        @click="toggleFs"
      />
      <q-btn
        v-if="!showCard"
        round
        color="white"
        text-color="black"
        class="absolute-top-right"
        :class="mode === 'keyboard' ? 'q-mt-xl q-mr-xl' : 'q-mt-md q-mr-md'"
        size="md"
        icon="fa-solid fa-bars"
        @click="showCard = true"
      />
    </div>
  </q-page>
</template>

<script>
import { ref, toRefs, watch, onMounted, onUnmounted, computed } from 'vue'
import { useQuasar } from 'quasar'
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useMeta } from 'quasar'
import { useAuthStore } from 'stores/auth-store'
import { useGraphics3DStore } from 'stores/graphics3D-store'
import { useActionStore } from 'stores/actions-store'
import { useMerchStore } from 'stores/merch-store'
import { useSharedStore } from 'stores/shared-store'
import Gallery3D from 'components/graphics3d/Gallery3D.vue'
import HowTo from 'components/graphics3d/HowTo.vue'
import HowToTouch from 'components/graphics3d/HowToTouch.vue'
import GalleryLabels from 'components/graphics3d/GalleryLabels.vue'
import Gallery3DVideoSound from 'components/graphics3d/Gallery3DVideoSound.vue'
import SelectGallery from 'components/graphics3d/SelectGallery.vue'

export default {
  name: '3DPage',
  components: {
    HowTo,
    HowToTouch,
    Gallery3D,
    GalleryLabels,
    Gallery3DVideoSound,
    SelectGallery
  },
  props: {
    galleryId: {
      type: String,
      required: true
    }
  },
  setup(props) {
    const fsRoot = ref(null)
    const $q = useQuasar()
    const router = useRouter()
    const { locale, t } = useI18n({ useScope: 'global' })
    const { galleryId } = toRefs(props)
    const mode = ref('keyboard')
    const sharedStore = useSharedStore()
    const { headerFooterHidden } = storeToRefs(sharedStore)
    const { toggleHeaderFooter } = sharedStore
    const authStore = useAuthStore()
    const { loggedIn } = storeToRefs(authStore)
    const graphics3DStore = useGraphics3DStore()
    const { selectedGallery, selectedElementId } = storeToRefs(graphics3DStore)
    const { clearSelectedGallery, getGraphics3D } = graphics3DStore
    if (selectedGallery.value.galleryId !== +galleryId.value) {
      clearSelectedGallery()
      getGraphics3D(`galleries/${galleryId.value}`)
    }
    const actionsStore = useActionStore()
    const { filterExhibitionsDraft } = storeToRefs(actionsStore)
    const merchStore = useMerchStore()
    const { getRealtimeDatabase } = merchStore
    const selectedRealGallery = ref({})
    const showCard = ref(true)
    if (filterExhibitionsDraft.value.length) {
      selectedRealGallery.value = filterExhibitionsDraft.value.find(
        (item) => item.id === +galleryId.value
      )
    } else {
      getSelectedRealGallery()
    }
    const shouldBlink = computed(
      () => $q.screen.lt.md && !$q.fullscreen.isActive && !headerFooterHidden.value
    )
    watch(loggedIn, (val) => {
      if (!val) router.replace('/')
    })
    async function getSelectedRealGallery() {
      selectedRealGallery.value = await getRealtimeDatabase(`exhibitions/${galleryId.value}`)
    }
    const toggleFs = async () => {
      if ($q.fullscreen?.isCapable) {
        if ($q.fullscreen.isActive) await $q.fullscreen.exit()
        else await $q.fullscreen.request(fsRoot.value)
        return
      }
      toggleHeaderFooter(!headerFooterHidden.value)
      document.body.classList.toggle('app-fs', headerFooterHidden.value)
    }
    const setDefaultMode = () =>
      (mode.value = window.matchMedia('(pointer: coarse)').matches ? 'touch' : 'keyboard')

    let mq
    onMounted(() => {
      toggleFs()
      setDefaultMode()
      mq = window.matchMedia('(pointer: coarse)')
      mq.addEventListener?.('change', setDefaultMode)
    })
    onUnmounted(() => {
      toggleHeaderFooter(false)
      document.body.classList.remove('app-fs')
      mq.removeEventListener?.('change', setDefaultMode)
    })
    useMeta(() => {
      const name =
        locale.value === 'en' ? selectedRealGallery.value.name : selectedRealGallery.value.nameIt
      const description =
        locale.value === 'en'
          ? selectedRealGallery.value.description
          : selectedRealGallery.value.descriptionIt

      return {
        title: name,
        meta: {
          description: {
            name: 'description',
            content: description
          },
          keywords: {
            name: 'keywords',
            content: t('meta.virtualGalleryKeywords')
          },
          robots: {
            name: 'robots',
            content: 'index, follow'
          }
        },
        link: {
          canonical: {
            rel: 'canonical',
            href: `https://aortagallery.com/3d/${galleryId.value}`
          }
        },
        script: {
          jsonLd: {
            type: 'application/ld+json',
            // prettier-ignore
            innerHTML: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "ExhibitionEvent",
              "name": name,
              "description": description,
              "eventStatus": "https://schema.org/EventScheduled",
              "eventAttendanceMode": "https://schema.org/OnlineEventAttendanceMode",
              "isAccessibleForFree": false,
              "image": selectedRealGallery.value.urlImage,
              "url": `https://aortagallery.com/3d/${galleryId.value}`,
              "location": {
                "@type": "VirtualLocation",
                "url": `https://aortagallery.com/3d/${galleryId.value}`
              },
              "organizer": {
                "@type": "Organization",
                "name": t('meta.homeTitle'),
                "url": "https://aortagallery.com",
                "logo": "https://aortagallery.com/logo.png",
                "contactPoint": {
                  "@type": "ContactPoint",
                  "telephone": "+39-331-9945585",
                  "contactType": t('jsonLd.customerService'),
                  "email": "support@aortagallery.com"
                }
              },
              "offers": [
                {
                  "@type": "Offer",
                  "name": t('subscription.monthlyAccess'),
                  "category": "subscription",
                  "url": `https://aortagallery.com/3d/${galleryId.value}`,
                  "price": "9.99",
                  "priceCurrency": "EUR",
                  "availability": "https://schema.org/InStock",
                  "priceSpecification": {
                    "@type": "UnitPriceSpecification",
                    "price": 9.99,
                    "priceCurrency": "EUR",
                    "billingDuration": 1,
                    "billingPeriod": "P1M"
                  }
                },
                {
                  "@type": "Offer",
                  "name": t('subscription.annualAccess'),
                  "category": "subscription",
                  "url": `https://aortagallery.com/3d/${galleryId.value}`,
                  "price": "99.99",
                  "priceCurrency": "EUR",
                  "availability": "https://schema.org/InStock",
                  "priceSpecification": {
                    "@type": "UnitPriceSpecification",
                    "price": 99.99,
                    "priceCurrency": "EUR",
                    "billingDuration": 1,
                    "billingPeriod": "P1Y"
                  }
                },
                {
                  "@type": "Offer",
                  "name": name,
                  "category": "ticket",
                  "url": `https://aortagallery.com/3d/${galleryId.value}`,
                  "price": "8.99",
                  "priceCurrency": "EUR",
                  "availability": "https://schema.org/InStock"
                }
              ]
            })
          }
        }
      }
    })
    return {
      fsRoot,
      mode,
      selectedElementId,
      shouldBlink,
      headerFooterHidden,
      showCard,
      toggleFs
    }
  }
}
</script>

<style scoped>
@keyframes blinkPulse {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.4;
  }
}
.blink {
  animation: blinkPulse 0.9s infinite;
}
</style>
