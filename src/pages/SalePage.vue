<template>
  <transition appear enter-active-class="animated fadeIn" leave-active-class="animated fadeOut">
    <q-page class="q-pa-md" style="padding-top: 100px">
      <fixed-top-title :name="$t(`links.sale`)">
        <template #button>
          <q-btn class="lt-sm q-mr-md" flat dense icon="menu" aria-label="Menu">
            <q-menu auto-close>
              <q-list style="min-width: 100px">
                <q-item
                  clickable
                  v-for="{ label, name } in saleLinks"
                  @click="tab = name"
                  :key="name"
                >
                  <q-item-section>{{ $t(label) }}</q-item-section>
                </q-item>
              </q-list>
            </q-menu>
          </q-btn>
        </template>
        <q-separator class="lt-sm" />
        <span class="q-ml-lg lt-sm text-h5">{{ $t(`links.${tab}`) }}</span>
        <div class="row justify-md-start">
          <q-tabs v-model="tab" dense narrow-indicator class="gt-xs">
            <q-tab
              class="text-body1"
              v-for="{ label, name } in saleLinks"
              :key="name"
              :name="name"
              :label="$t(label)"
            />
          </q-tabs>
        </div>
      </fixed-top-title>
      <q-tab-panels v-model="tab">
        <q-tab-panel v-for="{ name } in saleLinks" :key="name" :name="name">
          <transition appear enter-active-class="animated fadeIn">
            <small-page-container class="justify-around">
              <works-list :works-list="filterWorksRubrics" />
            </small-page-container>
          </transition>
        </q-tab-panel>
      </q-tab-panels>
    </q-page>
  </transition>
</template>

<script>
import { computed, ref, watch } from 'vue'
import { useQuasar, useMeta } from 'quasar'
import { storeToRefs } from 'pinia'
import { useI18n } from 'vue-i18n'
import { useSharedStore } from 'stores/shared-store.js'
import { useArtistsStore } from 'stores/artists-store.js'
import FixedTopTitle from 'components/shared/Titles/FixedTopTitle.vue'
import SmallPageContainer from 'components/shared/SmallPageContainer.vue'
import WorksList from 'components/WorksList.vue'

export default {
  name: 'SalePage',
  components: { FixedTopTitle, SmallPageContainer, WorksList },
  setup() {
    const { locale } = useI18n({ useScope: 'global' })
    const $q = useQuasar()
    const sharedStore = useSharedStore()
    const { saleLinks } = storeToRefs(sharedStore)
    const { toggleLeftDrawer } = sharedStore
    const artistsStore = useArtistsStore()
    const { filterArtistsDraft, allWorks } = storeToRefs(artistsStore)
    const { getArtists } = artistsStore
    const tab = ref($q.localStorage.getItem('tab') || 'painting')
    watch(tab, () => {
      $q.localStorage.set('tab', tab.value)
    })
    if (!filterArtistsDraft.value.length) getArtists()
    const filterWorksRubrics = computed(() => {
      if (allWorks.value.length) {
        let localArray = allWorks.value.filter((work) => work.rubric === tab.value && work.price)
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
    useMeta(() => {
      return {
        title: 'Aorta Social Art Gallery | For sale',
        meta: {
          description: {
            name: 'description',
            content:
              'Aorta Social Art Gallery is a young and aspiring online gallery of contemporary art. Aorta Gallery sees its mission in promoting art that can help the viewer to learn about, examine, live and comprehend sensory experience.'
          },
          keywords: {
            name: 'keywords',
            content: 'Buy paintings, sculptures, contemporary art in Pisa Italy'
          },
          ogTitle: {
            property: 'og:title'
          }
        }
      }
    })
    return {
      saleLinks,
      tab,
      filterWorksRubrics,
      allWorks,
      toggleLeftDrawer
    }
  }
}
</script>

<style scoped></style>
