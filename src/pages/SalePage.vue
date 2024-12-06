<template>
  <transition appear enter-active-class="animated fadeIn" leave-active-class="animated fadeOut">
    <q-page class="q-pa-md" style="padding-top: 100px">
      <title-tabs :name-title="$t(`links.sale`)" :links="saleLinks" v-model="tab" />
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
import TitleTabs from 'components/shared/Titles/TitleTabs.vue'
import SmallPageContainer from 'components/shared/SmallPageContainer.vue'
import WorksList from 'components/WorksList.vue'

export default {
  name: 'SalePage',
  components: { TitleTabs, SmallPageContainer, WorksList },
  setup() {
    const { locale } = useI18n({ useScope: 'global' })
    const $q = useQuasar()
    const sharedStore = useSharedStore()
    const { saleLinks } = storeToRefs(sharedStore)
    const { toggleLeftDrawer } = sharedStore
    const artistsStore = useArtistsStore()
    const { artistsList, allWorks } = storeToRefs(artistsStore)
    const { getArtists } = artistsStore
    const tab = ref($q.localStorage.getItem('tab') || 'painting')
    watch(tab, () => {
      $q.localStorage.set('tab', tab.value)
    })
    if (!artistsList.value.length) getArtists()
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
            content: 'Buy paintings, sculptures, contemporary art, souvenirs in Pisa Italy'
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
