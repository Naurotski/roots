<template>
  <transition appear enter-active-class="animated fadeIn" leave-active-class="animated fadeOut">
    <q-page class="q-pa-md" style="padding-top: 100px">
      <fixed-top-title :name="$t(`links.sale`)"
        ><div class="row justify-md-start">
          <q-tabs v-model="tab" dense narrow-indicator>
            <q-tab
              style="width: 100px"
              class="text-body1"
              v-for="{ label, name } in saleLinks"
              :key="name"
              :name="name"
              :label="$t(label)"
            />
          </q-tabs></div
      ></fixed-top-title>
      <q-tab-panels v-model="tab">
        <q-tab-panel v-for="{ name } in saleLinks" :key="name" :name="name">
          <transition appear enter-active-class="animated fadeIn">
            <small-page-container class="q-pb-md">
              <div class="q-gutter-lg row justify-around q-my-md">
                <div v-for="work in allWorks" :key="work.urlImageWork">
                  <router-link v-if="work.urlImageWork.includes('video')" :to="`/work/${work.id}`">
                    <div style="position: relative">
                      <q-video style="height: 25vh" :src="work.urlImageWork" />
                      <div
                        style="
                          position: absolute;
                          top: 5px;
                          height: 100%;
                          width: 100%;
                          opacity: 0.1;
                        "
                        class="bg-grey-2"
                      />
                    </div>
                  </router-link>
                  <router-link v-else :to="`/work/${work.id}`">
                    <img
                      :src="work.urlImageWork"
                      style="height: 25vh; width: 100%"
                      :alt="work.name"
                    />
                  </router-link>
                </div>
              </div>
              <!--              <pre>{{ $t(`links.${tab}`) }}</pre>-->
              <!--              <pre>allWorks - {{ filterWorksRubrics }}</pre>-->
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
import { useQuasar } from 'quasar'
export default {
  name: 'SalePage',
  components: {
    FixedTopTitle,
    SmallPageContainer
  },
  setup() {
    const $q = useQuasar()
    const sharedStore = useSharedStore()
    const { saleLinks } = storeToRefs(sharedStore)
    const artistsStore = useArtistsStore()
    const { filterArtistsDraft, allWorks } = storeToRefs(artistsStore)
    const { getArtists } = artistsStore
    const tab = ref($q.localStorage.getItem('tab') || 'painting')
    watch(tab, () => {
      $q.localStorage.set('tab', tab.value)
    })
    if (!filterArtistsDraft.value.length) getArtists()
    const filterWorksRubrics = computed(() =>
      allWorks.value.filter((work) => work.rubric === tab.value && work.price)
    )
    return {
      saleLinks,
      tab,
      filterWorksRubrics,
      allWorks
    }
  }
}
</script>

<style scoped></style>
