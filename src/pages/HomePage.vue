<template>
  <transition appear enter-active-class="animated fadeIn" leave-active-class="animated fadeOut">
    <q-page>
      <q-carousel
        animated
        v-model="slide"
        height="85vh"
        style="width: 100%"
        autoplay
        swipeable
        infinite
        transition-duration="3000"
      >
        <q-carousel-slide
          v-for="({ imageUrl }, index) in carouselHomePage"
          :name="index"
          :img-src="imageUrl"
          :key="imageUrl"
        >
          <div
            :class="$q.screen.xs ? 'absolute-center' : 'absolute-bottom'"
            class="custom-caption full-width"
          >
            <!--            <div class="text-h2">{{ artistName }}</div>-->
            <div class="text-h4">
              {{ locale === 'it' ? selectedExhibitionsData.nameIt : selectedExhibitionsData.name }}
            </div>
            <div
              class="text-h6"
              v-text="
                `${selectedExhibitionsData.openingDate
                  .split('/')
                  .reverse()
                  .join('/')} - ${selectedExhibitionsData.closingDate
                  .split('/')
                  .reverse()
                  .join('/')}`
              "
              :class="{ 'text-body1': $q.screen.xs }"
            />
          </div>
        </q-carousel-slide>
        <template v-slot:control>
          <q-carousel-control
            :position="$q.screen.xs ? 'top' : 'bottom-right'"
            :offset="[30, $q.screen.xs ? 10 : 30]"
            class="column"
          >
            <q-btn
              class="q-mb-sm"
              size="xl"
              :text-color="$q.screen.xs ? 'black text-weight-bold' : 'white text-weight-bold'"
              outline
              rounded
              :dense="$q.screen.xs"
              :to="`actions/exhibitions?lifeTime=${lifeTimeExhibition}&id=${selectedExhibitionsData.id}`"
              :label="$t('common.exhibition')"
              no-caps
              icon-right="mdi-arrow-right-bold"
            />
            <list-working-days-dialog
              v-if="ticketsList[selectedExhibitionsData.id] && lifeTimeExhibition === 'current'"
              :action="filteredActionI18n"
            >
              <q-btn
                class="full-width"
                size="xl"
                :text-color="$q.screen.xs ? 'black text-weight-bold' : 'white text-weight-bold'"
                outline
                rounded
                :dense="$q.screen.xs"
                :label="$t('tickets.buyTickets')"
                no-caps
              />
            </list-working-days-dialog>
          </q-carousel-control>
        </template>
      </q-carousel>
      <title-line v-if="worksList.length" class="q-mt-lg">
        {{ $t('common.shopArt').toUpperCase() }}
      </title-line>
      <transition appear enter-active-class="animated fadeIn">
        <small-page-container class="justify-around">
          <works-list :works-list="worksList" />
        </small-page-container>
      </transition>
      <title-line v-if="filterMerchList.length" class="q-mt-lg">
        {{ $t('links.shop').toUpperCase() }}
      </title-line>
      <transition appear enter-active-class="animated fadeIn">
        <small-page-container class="justify-around">
          <merch-list :list="filterMerchList" />
        </small-page-container>
      </transition>
    </q-page>
  </transition>
</template>

<script>
import { computed, defineComponent, ref, watch } from 'vue'
import { date, useMeta } from 'quasar'
import { storeToRefs } from 'pinia'
import { useI18n } from 'vue-i18n'
import { useSharedStore } from 'stores/shared-store.js'
import { useMerchStore } from 'stores/merch-store'
import { useActionStore } from 'stores/actions-store'

import SmallPageContainer from 'components/shared/SmallPageContainer.vue'
import WorksList from 'components/WorksList.vue'
import TitleLine from 'components/TitleLine.vue'
import MerchList from 'components/merch/MerchList.vue'
import ListWorkingDaysDialog from 'components/tickets/ListWorkingDaysDialog.vue'

export default defineComponent({
  name: 'HomePage',
  components: {
    ListWorkingDaysDialog,
    MerchList,
    SmallPageContainer,
    WorksList,
    TitleLine
  },
  setup() {
    const slide = ref(0)
    const { locale, t } = useI18n({ useScope: 'global' })
    const sharedStore = useSharedStore()
    const { carouselHomePage, selectedExhibitionsData, worksForSale } = storeToRefs(sharedStore)
    const { getHomePageData } = sharedStore
    if (!carouselHomePage.value.length) getHomePageData()
    const actionStore = useActionStore()
    const { ticketsList } = storeToRefs(actionStore)
    const { listenForChildTicket } = actionStore
    const merchStore = useMerchStore()
    const { merchHomePageList } = storeToRefs(merchStore)
    const lifeTimeExhibition = computed(() =>
      date.formatDate(selectedExhibitionsData.value.openingDate, 'x') > Date.now()
        ? 'upcoming'
        : new Date(
            new Date(selectedExhibitionsData.value.closingDate).setDate(
              new Date(selectedExhibitionsData.value.closingDate).getDate() + 1
            )
          ) < Date.now()
        ? 'archive'
        : 'current'
    )
    const worksList = computed(() => {
      if (worksForSale.value.length) {
        let localArray = worksForSale.value.filter((work) => work.price || work.nftPrice)
        if (locale.value === 'it') {
          return localArray.map((item) => ({
            ...item,
            description: item.descriptionIt,
            materials: item.materialsIt,
            name: item.nameIt
          }))
        } else {
          return localArray
        }
      } else {
        return []
      }
    })
    const filterMerchList = computed(() =>
      merchHomePageList.value.map((item) => {
        if (locale.value === 'it') {
          return { ...item, name: item.nameIt, description: item.descriptionIt }
        } else {
          return { ...item }
        }
      })
    )
    const filteredActionI18n = computed(() => {
      if (locale.value === 'it') {
        return {
          ...selectedExhibitionsData.value,
          city: selectedExhibitionsData.value.cityIt,
          name: selectedExhibitionsData.value.nameIt,
          openingDate: selectedExhibitionsData.value.openingDate.split('/').reverse().join('/'),
          closingDate: selectedExhibitionsData.value.closingDate.split('/').reverse().join('/')
        }
      } else {
        return {
          ...selectedExhibitionsData.value,
          openingDate: selectedExhibitionsData.value.openingDate.split('/').reverse().join('/'),
          closingDate: selectedExhibitionsData.value.closingDate.split('/').reverse().join('/')
        }
      }
    })
    watch(
      () => selectedExhibitionsData.value.id,
      (newValue) => {
        if (newValue && !ticketsList.value[newValue]) listenForChildTicket(newValue)
      },
      { immediate: true, deep: true }
    )

    useMeta(() => {
      return {
        title: t('meta.homeTitle'),
        meta: {
          description: {
            name: 'description',
            content: t('meta.homeDescription')
          },
          keywords: {
            name: 'keywords',
            content: t('meta.homeKeywords')
          },
          robots: {
            name: 'robots',
            content: 'index, follow'
          }
        },
        link: {
          canonical: {
            rel: 'canonical',
            href: 'https://aortagallery.com/home'
          }
        },
        script: {
          jsonLd: {
            type: 'application/ld+json',
            // prettier-ignore
            innerHTML: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "ArtGallery",
              "name": t('meta.homeTitle'),
              "url": "https://aortagallery.com/home",
              "logo": "https://aortagallery.com/logo.png",
              "image": "https://aortagallery.com/image.png",
              "description": t('meta.homeDescription'),
              "telephone": "+39-392-5568834",
              "address": {
                "@type": "PostalAddress",
                "postalCode": "56125",
                "addressLocality": "Pisa",
                "addressCountry": "IT",
                "streetAddress": "Corso Italia 146"
              },
              "geo": {
                "@type": "GeoCoordinates",
                "latitude": 43.7117760654017,
                "longitude": 10.399556980989269
              },
              "openingHoursSpecification": [
                {
                  "@type": "OpeningHoursSpecification",
                  "dayOfWeek": [
                    t('jsonLd.monday'),
                    t('jsonLd.tuesday'),
                    t('jsonLd.wednesday'),
                    t('jsonLd.thursday'),
                    t('jsonLd.friday'),
                    t('jsonLd.saturday'),
                    t('jsonLd.sunday')
                  ],
                  "opens": "12:00",
                  "closes": "20:00"
                }
              ],
              "sameAs": [
                "https://www.facebook.com/profile.php?id=100088816940231",
                "https://www.instagram.com/aorta.socialartgallery/"
              ],
              "event": {
                "@type": "Event",
                "name": locale.value === 'it' ? selectedExhibitionsData.value.nameIt?.match(/^([\w\s]+)\s"(.+)"$/)?.[2] : selectedExhibitionsData.value.name?.match(/^([\w\s]+)\s"(.+)"$/)?.[2],
                "description": "The “Transition” project invites the viewer into a space where the visible and invisible worlds converge, where the past intertwines with the present, and memory comes alive through the sounds of birds and the glow of amber.",
                "startDate": selectedExhibitionsData.value.openingDate?.replace(/\//g, "-"),
                "endDate": selectedExhibitionsData.value.closingDate?.replace(/\//g, "-"),
                "location": {
                  "@type": "Place",
                  "name": t('meta.homeTitle'),
                  "address": {
                    "@type": "PostalAddress",
                    "postalCode": "56125",
                    "addressLocality": "Pisa",
                    "addressCountry": "Italy",
                    "streetAddress": "Corso Italia 146"
                  }
                },
                "image": carouselHomePage.value[0]?.imageUrl,
                "organizer": {
                  "@type": "Organization",
                  "name": t('meta.homeTitle'),
                  "url": "https://aortagallery.com",
                  "logo": "https://aortagallery.com/logo.png",
                  "contactPoint": {
                    "@type": "ContactPoint",
                    "telephone": "+39-392-5568834",
                    "contactType": t('jsonLd.customerService'),
                    "email": "support@aortagallery.com"
                  }
                },
                "offers": {
                  "@type": "Offer",
                  "price": "5.00",
                  "priceCurrency": "EUR"
                },
                "performer": {
                  "@type": "Person",
                  "name": selectedExhibitionsData.value.name?.match(/^([\w\s]+)\s"(.+)"$/)?.[1],
                  "url": "https://aortagallery.com/artists/OlgaZaverzhenets",
                  "image": "https://firebasestorage.googleapis.com/v0/b/roots-a7a88.appspot.com/o/artists%2FOlgaZaverzhenets%2Fportrait?alt=media&token=2f7a3b7f-5d61-487e-840d-eed3a091ca9c",
                  "description": "Olga Zaverzhenets is an artist working with the medium of photography. She was born in Belarus in 1982. Olga has been involved in Photography since 2006. She has a particular preference for medium format photography. She works with classic and alternative techniques of hand printing."
                }
              }
            })
          }
        }
      }
    })
    return {
      locale,
      slide,
      carouselHomePage,
      lifeTimeExhibition,
      selectedExhibitionsData,
      worksList,
      filterMerchList,
      ticketsList,
      filteredActionI18n
    }
  }
})
</script>
<style lang="sass" scoped>
.custom-caption
  text-align: center
  padding: 60px
  color: white
  background-color: rgba(0, 0, 0, .3)
</style>
