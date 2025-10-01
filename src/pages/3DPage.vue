<template>
  <q-page>
    <gallery3-d />
    <how-to class="absolute-top-right q-mt-xl q-mr-xl" />
    <gallery-labels />
    <gallery3-d-video-sound />
    <select-gallery />
  </q-page>
</template>

<script>
import { ref, toRefs, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useMeta } from 'quasar'
import { useAuthStore } from 'stores/auth-store'
import { useGraphics3DStore } from 'stores/graphics3D-store'
import { useActionStore } from 'stores/actions-store'
import { useMerchStore } from 'stores/merch-store'
import Gallery3D from 'components/graphics3d/Gallery3D.vue'
import HowTo from 'components/graphics3d/HowTo.vue'
import GalleryLabels from 'components/graphics3d/GalleryLabels.vue'
import Gallery3DVideoSound from 'components/graphics3d/Gallery3DVideoSound.vue'
import SelectGallery from 'components/graphics3d/SelectGallery.vue'

export default {
  name: '3DPage',
  components: {
    HowTo,
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
    const { galleryId } = toRefs(props)
    const router = useRouter()
    const { locale, t } = useI18n({ useScope: 'global' })
    const authStore = useAuthStore()
    const { loggedIn } = storeToRefs(authStore)
    const graphics3DStore = useGraphics3DStore()
    const { selectedGallery } = storeToRefs(graphics3DStore)
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
    if (filterExhibitionsDraft.value.length) {
      selectedRealGallery.value = filterExhibitionsDraft.value.find(
        (item) => item.id === +galleryId.value
      )
    } else {
      getSelectedRealGallery()
    }
    watch(loggedIn, (val) => {
      if (!val) router.replace('/')
    })
    async function getSelectedRealGallery() {
      selectedRealGallery.value = await getRealtimeDatabase(`exhibitions/${galleryId.value}`)
    }
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
  }
}
</script>

<style scoped />
