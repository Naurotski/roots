<template>
  <transition appear enter-active-class="animated fadeIn" leave-active-class="animated fadeOut">
    <q-page v-if="work" class="q-pa-md" style="padding-top: 65px">
      <fixed-top-title :name="work.artistName">
        <template #link>
          <router-link
            :to="`/artists/${work.artistName.split(' ').join('')}`"
            style="text-decoration: none; color: #1d1d1d"
          >
            {{ work.artistName }}
          </router-link>
        </template>
      </fixed-top-title>
      <small-page-container class="q-pt-md">
        <div class="col-12 col-sm-8">
          <q-card-section>
            <carousel-component :url-images="allUrlImagesWork" />
          </q-card-section>
        </div>
        <div class="col-12 col-sm-4 q-pt-sm-md">
          <q-card-section class="q-pt-none">
            <div class="text-h5" v-text="work.name" />
          </q-card-section>
          <q-card-section>
            <p
              style="white-space: pre-line"
              class="text-justify text-body1"
              v-text="work.materials"
            />
            <p
              style="white-space: pre-line"
              class="text-justify text-body1"
              v-text="work.description"
            />
            <p
              v-if="work.price"
              style="white-space: pre-line"
              class="text-justify text-body1"
              v-text="`€ ${work.price}`"
            />
            <payment-dialog v-if="work.price" :work="work" />
          </q-card-section>
        </div>
        <q-btn flat size="xl" icon="mdi-arrow-left-bold" @click="$router.go(-1)" />
        <!--        <router-link :to="`/thankYou/${workId}`">Work</router-link>-->
      </small-page-container>
    </q-page>
  </transition>
</template>

<script>
import FixedTopTitle from 'components/shared/Titles/FixedTopTitle.vue'
import SmallPageContainer from 'components/shared/SmallPageContainer.vue'
import CarouselComponent from 'components/shared/CarouselComponent.vue'
import PaymentDialog from 'components/dialogs/PaymentDialog.vue'
import { useArtistsStore } from 'stores/artists-store.js'
import { storeToRefs } from 'pinia'
import { computed, toRefs } from 'vue'
import { useI18n } from 'vue-i18n'
import { useMeta } from 'quasar'
export default {
  name: 'WorkPage',
  components: {
    FixedTopTitle,
    SmallPageContainer,
    CarouselComponent,
    PaymentDialog
  },
  props: {
    workId: {
      type: String,
      required: true
    }
  },
  setup(props) {
    const { locale } = useI18n({ useScope: 'global' })
    const { workId } = toRefs(props)
    const artistsStore = useArtistsStore()
    const { filterArtistsDraft, allWorks } = storeToRefs(artistsStore)
    const { getArtists } = artistsStore
    if (!filterArtistsDraft.value.length) getArtists()
    const work = computed(() => {
      if (allWorks.value.length) {
        let localData = allWorks.value.find((item) => String(item.id) === workId.value)
        if (locale.value === 'it') {
          return {
            ...localData,
            description: localData.descriptionIt,
            materials: localData.materialsIt,
            name: localData.nameIt
          }
        } else {
          return { ...localData }
        }
      } else {
        return null
      }
    })
    const allUrlImagesWork = computed(() => {
      if (work.value) {
        if (work.value.urlSecondImagesWork) {
          return [work.value.urlImageWork, ...work.value.urlSecondImagesWork]
        } else {
          return [work.value.urlImageWork]
        }
      } else {
        return []
      }
    })
    useMeta(() => {
      return {
        title: `Roots | ${work.value?.name}`,
        meta: {
          description: {
            name: 'description',
            content: work.value?.description
          },
          ogTitle: {
            property: 'og:title'
          }
        }
      }
    })
    return {
      work,
      allUrlImagesWork
    }
  }
}
</script>

<style scoped></style>
