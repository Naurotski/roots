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
    console.log(filterExhibitionsDraft.value)
    console.log(filterExhibitionsDraft.value.length)
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
      console.log(selectedRealGallery.value)
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
        // script: {
        //   jsonLd: {
        //     type: 'application/ld+json',
        //     // prettier-ignore
        //     innerHTML: JSON.stringify({
        //       "@context": "https://schema.org",
        //       "@type": "ExhibitionEvent",
        //       "name": name,
        //       "description": description,
        //       "eventStatus": "https://schema.org/EventScheduled",
        //       "eventAttendanceMode": "https://schema.org/OnlineEventAttendanceMode",
        //       "isAccessibleForFree": false,
        //       "image": heroImage,
        //       "url": virtualUrl,
        //       "location": {
        //         "@type": "VirtualLocation",
        //         "url": virtualUrl
        //       },
        //       "organizer": {
        //         "@type": "Organization",
        //         "name": t('meta.homeTitle'),
        //         "url": "https://aortagallery.com",
        //         "logo": "https://aortagallery.com/logo.png",
        //         "contactPoint": {
        //           "@type": "ContactPoint",
        //           "telephone": "+39-392-5568834",
        //           "contactType": t('jsonLd.customerService'),
        //           "email": "support@aortagallery.com"
        //         }
        //       },
        //       // При желании добавь реальные даты запуска/актуальности
        //       "startDate": virtualJsonLd.value?.startDate || new Date().toISOString().slice(0,10),
        //       "endDate": virtualJsonLd.value?.endDate,
        //       "offers": [
        //         {
        //           "@type": "Offer",
        //           "name": locale.value === 'it' ? "Abbonamento Mensile" : "Monthly Subscription",
        //           "category": "subscription",
        //           "url": `${virtualUrl}?plan=monthly`,
        //           "price": "9.99",
        //           "priceCurrency": "EUR",
        //           "availability": "https://schema.org/InStock",
        //           "priceSpecification": {
        //             "@type": "UnitPriceSpecification",
        //             "price": 9.99,
        //             "priceCurrency": "EUR",
        //             "billingDuration": 1,
        //             "billingPeriod": "P1M"
        //           }
        //         },
        //         {
        //           "@type": "Offer",
        //           "name": locale.value === 'it' ? "Abbonamento Annuale" : "Yearly Subscription",
        //           "category": "subscription",
        //           "url": `${virtualUrl}?plan=yearly`,
        //           "price": "99.99",
        //           "priceCurrency": "EUR",
        //           "availability": "https://schema.org/InStock",
        //           "priceSpecification": {
        //             "@type": "UnitPriceSpecification",
        //             "price": 99.99,
        //             "priceCurrency": "EUR",
        //             "billingDuration": 1,
        //             "billingPeriod": "P1Y"
        //           }
        //         },
        //         {
        //           "@type": "Offer",
        //           "name": locale.value === 'it' ? "Ingresso Singolo" : "One-time Visit",
        //           "category": "ticket",
        //           "url": `${virtualUrl}?ticket=day-pass`,
        //           "price": "8.99",
        //           "priceCurrency": "EUR",
        //           "availability": "https://schema.org/InStock"
        //         }
        //       ]
        //     })
        //   }
        // }
      }
    })
  }
}
</script>

<style scoped></style>
