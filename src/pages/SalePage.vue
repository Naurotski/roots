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
              style="width: 100px"
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
              <div
                class="q-ma-lg"
                v-for="{ id, name, materials, price, urlImageWork } in filterWorksRubrics"
                :key="urlImageWork"
                style="width: 300px"
              >
                <router-link
                  v-if="urlImageWork.includes('video')"
                  :to="`/work/${id}`"
                  style="text-decoration: none; color: #1d1d1d"
                >
                  <div style="position: relative">
                    <q-video
                      :style="$q.screen.xs ? 'max-height: 300px' : 'height: 300px'"
                      :src="urlImageWork"
                    />
                    <div
                      style="position: absolute; top: 5px; height: 100%; width: 100%; opacity: 0.1"
                      class="bg-grey-2"
                    />
                  </div>
                  <div class="text-body1 q-mt-md">
                    <b>{{ name }}</b>
                    <p>{{ materials }}</p>
                    <p>{{ `€ ${price}` }}</p>
                  </div>
                </router-link>
                <router-link
                  v-else
                  :to="`/work/${id}`"
                  style="text-decoration: none; color: #1d1d1d"
                >
                  <q-img
                    :src="urlImageWork"
                    fit="contain"
                    :style="$q.screen.xs ? 'max-height: 300px' : 'height: 300px'"
                  />
                  <div class="text-body1 q-mt-md">
                    <b>{{ name }}</b>
                    <p>{{ materials }}</p>
                    <p>{{ `€ ${price}` }}</p>
                  </div>
                </router-link>
              </div>
            </small-page-container>
          </transition>
        </q-tab-panel>
      </q-tab-panels>
    </q-page>
  </transition>
</template>

<script>
import FixedTopTitle from 'components/shared/Titles/FixedTopTitle.vue'
import SmallPageContainer from 'components/shared/SmallPageContainer.vue'
import { useSharedStore } from 'stores/shared-store.js'
import { useArtistsStore } from 'stores/artists-store.js'
import { storeToRefs } from 'pinia'
import { computed, ref, watch } from 'vue'
import { useQuasar, useMeta } from 'quasar'
import { useI18n } from 'vue-i18n'

const metaData = {
  title: 'Roots | For sale',
  meta: {
    description: {
      name: 'description',
      content:
        'Roots Gallery is a young and aspiring online gallery of contemporary art. Roots Gallery sees its mission in promoting art that can help the viewer to learn about, examine, live and comprehend sensory experience.'
    },
    ogTitle: {
      property: 'og:title'
    }
  }
}

export default {
  name: 'SalePage',
  components: {
    FixedTopTitle,
    SmallPageContainer
  },
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
    useMeta(metaData)
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
