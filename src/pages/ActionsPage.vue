<template>
  <transition appear enter-active-class="animated fadeIn" leave-active-class="animated fadeOut">
    <q-page class="q-pa-md" style="padding-top: 100px">
      <fixed-top-title :name="$t(`links.${typeAction}`)"
        ><div class="row justify-md-start">
          <q-tabs v-model="tab" dense narrow-indicator>
            <q-tab
              style="width: 100px"
              class="text-body1"
              v-for="{ label, name } in actionsLinks"
              :key="name"
              :name="name"
              :label="$t(label)"
            />
          </q-tabs></div
      ></fixed-top-title>
      <q-tab-panels v-model="tab" v-if="!$q.loading.isActive">
        <q-tab-panel v-for="{ name } in actionsLinks" :key="name" :name="name">
          <template v-if="filteredActions.length">
            <div
              v-for="(action, index) in filteredActionsI18n"
              :key="action.id"
              ref="itemRefs"
              :id="`d${action.id}`"
            >
              <transition appear enter-active-class="animated fadeIn">
                <small-page-container class="q-pb-md">
                  <shared-card
                    :data-card="{
                      name: action.name,
                      description: action.description,
                      url: action.urlImage,
                      caption: `${action.openingDate} - ${action.closingDate}, ${action.city}`
                    }"
                    class="q-pb-lg"
                  >
                    <template #underPicture>
                      <q-card-section>
                        <div class="text-subtitle1">
                          <p
                            style="color: #1d1d1d"
                            v-text="`${action.openingDate} - ${action.closingDate}, ${action.city}`"
                          />
                        </div>
                      </q-card-section>
                    </template>
                    <template #press>
                      <div v-if="action.press?.length" class="text-h5">Press</div>
                      <ul>
                        <li v-for="{ id, name } in action.press" :key="id">
                          <router-link
                            :to="`/press/${action.id}-${id}`"
                            style="color: #1d1d1d"
                            class="text-body1"
                          >
                            {{ name }}
                          </router-link>
                        </li>
                      </ul>
                    </template>
                    <template #tickets>
                      <list-working-days-dialog
                        v-if="action.tickets && Object.keys(action.tickets).length"
                        :tickets-list="action.tickets"
                        :action-id="action.id"
                        :name="action.name"
                        :url="action.urlImage"
                        :city="action.city"
                      />
                    </template>

                    <template v-if="action.lifeTime !== 'upcoming'" #button>
                      <action-dialog
                        class="absolute-bottom"
                        :title="action.name"
                        :typeAction="typeAction"
                        :dialogData="action.works"
                      />
                    </template>
                  </shared-card>
                </small-page-container>
              </transition>
              <q-separator v-if="index < filteredActions.length - 1" class="q-my-md" />
            </div>
          </template>
          <no-results v-else />
        </q-tab-panel>
      </q-tab-panels>
    </q-page>
  </transition>
</template>

<script>
import { storeToRefs } from 'pinia'
import { useMeta, useQuasar } from 'quasar'
import { toRefs, ref, watchEffect, computed, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'
import { useSharedStore } from 'stores/shared-store.js'
import { useActionStore } from 'stores/actions-store.js'
import { useArtistsStore } from 'stores/artists-store'
import FixedTopTitle from 'components/shared/Titles/FixedTopTitle.vue'
import SmallPageContainer from 'components/shared/SmallPageContainer.vue'
import SharedCard from 'components/shared/SharedCard.vue'
import ActionDialog from 'components/dialogs/ActionDialog.vue'
import NoResults from 'components/shared/NoResults.vue'
import ListWorkingDaysDialog from 'components/tickets/ListWorkingDaysDialog.vue'

export default {
  name: 'ActionsPage',
  components: {
    FixedTopTitle,
    SmallPageContainer,
    SharedCard,
    ActionDialog,
    NoResults,
    ListWorkingDaysDialog
  },
  props: {
    typeAction: {
      type: String,
      require: true
    }
  },
  setup(props) {
    const route = useRoute()
    const $q = useQuasar()
    const { locale, t } = useI18n({ useScope: 'global' })
    const { typeAction } = toRefs(props)
    const shredStore = useSharedStore()
    const { actionsLinks } = storeToRefs(shredStore)
    const actionsStore = useActionStore()
    const { filterExhibitionsDraft, filterEventsDraft, ticketsList } = storeToRefs(actionsStore)
    const { getExhibitions, getEvents, listenForChildTicket } = actionsStore
    const artistsStore = useArtistsStore()
    const { artistsList } = storeToRefs(artistsStore)
    const { getArtists } = artistsStore
    if (!artistsList.value.length) getArtists()
    const itemRefs = ref([])
    const filteredActions = ref([])
    const tab = ref(route.query.lifeTime || $q.localStorage.getItem('tab-actions') || 'archive')
    if (Object.keys(ticketsList.value)) listenForChildTicket()
    const elem = computed(() => itemRefs.value.find((item) => item.id === `d${route.query.id}`))
    const filteredActionsI18n = computed(() => {
      if (locale.value === 'it') {
        return filteredActions.value.map((action) => ({
          ...action,
          city: action.cityIt,
          description: action.descriptionIt,
          name: action.nameIt,
          works: action.works.map((item) => ({
            ...item,
            description: item.descriptionIt,
            name: item.nameIt
          })),
          tickets: ticketsList.value[action.id]
        }))
      } else {
        return filteredActions.value.map((action) => ({
          ...action,
          tickets: ticketsList.value[action.id]
        }))
      }
    })
    const actionJsonLd = computed(() => {
      const current = filterExhibitionsDraft.value.find((item) => item.lifeTime === 'current')
      if (current) {
        return current
      }
      const upcoming = filterExhibitionsDraft.value.find((item) => item.lifeTime === 'upcoming')
      if (upcoming) {
        return upcoming
      }
      const archive = filterExhibitionsDraft.value.find((item) => item.lifeTime === 'archive')
      if (archive) {
        return archive
      }
      return null
    })
    const artistJsonLd = computed(() =>
      artistsList.value.find(
        (item) => item.name === actionJsonLd.value?.name?.match(/^([\w\s]+)\s"(.+)"$/)?.[1]
      )
    )
    const unwatch = watchEffect(() => {
      if (elem.value) {
        setTimeout(() => {
          elem.value.scrollIntoView({
            behavior: 'smooth',
            block: 'center'
          })
        }, 500)
      }
    })
    watch(tab, () => {
      $q.localStorage.set('tab-actions', tab.value)
      unwatch()
    })
    watchEffect(() => {
      if (typeAction.value === 'exhibitions') {
        if (!filterExhibitionsDraft.value.length) getExhibitions()
        filteredActions.value = filterExhibitionsDraft.value.filter(
          (exhibition) => exhibition.lifeTime === tab.value
        )
        if (tab.value === 'upcoming' || tab.value === 'current') {
          filteredActions.value.reverse()
        }
      } else {
        if (!filterEventsDraft.value.length) getEvents()
        filteredActions.value = filterEventsDraft.value.filter(
          (event) => event.lifeTime === tab.value
        )
      }
    })
    const ucFirst = (str) => {
      if (!str) return str
      return str[0].toUpperCase() + str.slice(1)
    }
    useMeta(() => {
      return {
        title: `${t('meta.homeTitle')} | ${ucFirst(typeAction.value)}`,
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
            href: `https://aortagallery.com/actions/${typeAction.value}`
          }
        },
        script: {
          jsonLd: {
            type: 'application/ld+json',
            // prettier-ignore
            innerHTML: JSON.stringify({
              "@context": "https://schema.org",
                "@type": "Event",
                "name": locale.value === 'it' ? actionJsonLd.value?.nameIt?.match(/^([\w\s]+)\s"(.+)"$/)?.[2] : actionJsonLd.value?.name?.match(/^([\w\s]+)\s"(.+)"$/)?.[2],
                "description": locale.value === 'it' ? actionJsonLd.value?.descriptionIt : actionJsonLd.value?.description,
                "startDate": actionJsonLd.value?.openingDate?.replace(/\//g, "-"),
                "endDate": actionJsonLd.value?.closingDate?.replace(/\//g, "-"),
                "eventAttendanceMode": "https://schema.org/OnlineEventAttendanceMode",
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
                "image": actionJsonLd.value?.urlImage,
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
                  "priceCurrency": "EUR",
                  "availability": "https://schema.org/InStock"
                },
                "performer": {
                  "@type": "Person",
                  "name": actionJsonLd.value?.name?.match(/^([\w\s]+)\s"(.+)"$/)?.[1],
                  "url": `https://aortagallery.com/artists/${artistJsonLd.value?.artistId}`,
                  "image": artistJsonLd.value?.urlPortrait,
                  "description": locale.value === 'it' ? artistJsonLd.value?.descriptionIt : artistJsonLd.value?.description
                }
            })
          }
        }
      }
    })
    return {
      tab,
      actionsLinks,
      filteredActions,
      filteredActionsI18n,
      itemRefs
    }
  }
}
</script>

<style scoped></style>
