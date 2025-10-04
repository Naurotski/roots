<template>
  <q-page class="q-pa-md" style="padding-top: 65px">
    <small-page-container class="q-pb-md">
      <fixed-top-title :name="$t('links.virtual')" />
      <template v-if="filteredActionsI18n && filteredActionsI18n.length">
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
                  <ul class="q-mb-xl">
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
                <template #button>
                  <div>
                    <subscribe-dialog
                      v-if="$q.screen.gt.md"
                      :action="action"
                      :label="$t('common.enter')"
                    />
                  </div>
                </template>
              </shared-card>
            </small-page-container>
          </transition>
          <q-separator v-if="index < filteredActionsI18n.length - 1" class="q-my-md" />
        </div>
      </template>
      <pre>filteredActionsI18n - {{ filteredActionsI18n }}</pre>
    </small-page-container>
  </q-page>
</template>

<script>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { storeToRefs } from 'pinia'
import { useMeta } from 'quasar'
import { useActionStore } from 'stores/actions-store'
import { useGraphics3DStore } from 'stores/graphics3D-store'
import SmallPageContainer from 'components/shared/SmallPageContainer.vue'
import FixedTopTitle from 'components/shared/Titles/FixedTopTitle.vue'
import SubscribeDialog from 'components/dialogs/SubscribeDialog.vue'
import SharedCard from 'components/shared/SharedCard.vue'

export default {
  name: 'VirtualListPage',
  components: {
    SharedCard,
    SubscribeDialog,
    FixedTopTitle,
    SmallPageContainer
  },
  setup() {
    const { locale, t } = useI18n({ useScope: 'global' })
    const actionsStore = useActionStore()
    const { filterExhibitionsDraft } = storeToRefs(actionsStore)
    const { getExhibitions } = actionsStore
    if (!filterExhibitionsDraft.value.length) getExhibitions()
    const graphics3DStore = useGraphics3DStore()
    const { listGalleries, filteredListGalleriesNonDraft } = storeToRefs(graphics3DStore)
    const { listenForChildEvents } = graphics3DStore
    if (!Object.keys(listGalleries.value).length) listenForChildEvents('listGalleries')
    const filteredActionsI18n = computed(() => {
      const filteredArray = filterExhibitionsDraft.value.filter((item) =>
        Object.keys(filteredListGalleriesNonDraft.value).includes(item.id.toString())
      )
      if (locale.value === 'it') {
        return filteredArray.map((action) => ({
          ...action,
          city: action.cityIt,
          description: action.descriptionIt,
          name: action.nameIt,
          works: action.works.map((item) => ({
            ...item,
            description: item.descriptionIt,
            name: item.nameIt
          }))
        }))
      } else {
        return filteredArray
      }
    })

    const jsonLd = computed(() => ({
      '@context': 'https://schema.org',
      '@type': 'ItemList',
      name: t('links.virtual'),
      itemListOrder: 'https://schema.org/ItemListOrderAscending',
      numberOfItems: filteredActionsI18n.value.length,
      itemListElement: filteredActionsI18n.value.map((a, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        url: `https://aortagallery.com/3d/${a.id}`,
        item: {
          '@type': 'ExhibitionEvent',
          name: locale.value === 'en' ? a.name : a.nameIt,
          description: locale.value === 'en' ? a.description : a.descriptionIt,
          startDate: a.openingDate,
          eventAttendanceMode: 'https://schema.org/OnlineEventAttendanceMode',
          image: a.urlImage,
          url: `https://aortagallery.com/3d/${a.id}`,
          location: {
            '@type': 'VirtualLocation',
            url: `https://aortagallery.com/3d/${a.id}`
          },
          organizer: {
            '@type': 'Organization',
            name: t('meta.homeTitle'),
            url: 'https://aortagallery.com'
          }
        }
      }))
    }))
    useMeta(() => ({
      title: `${t('meta.homeTitle')} | ${t('links.virtual')}`,
      meta: {
        description: {
          name: 'description',
          content: t('meta.virtualListDescription')
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
          href: `https://aortagallery.com/virtual`
        }
      },
      script: {
        jsonLd: {
          type: 'application/ld+json',
          innerHTML: JSON.stringify(jsonLd.value)
        }
      }
    }))
    return {
      filteredListGalleriesNonDraft,
      filteredActionsI18n
    }
  }
}
</script>

<style scoped></style>
