<template>
  <transition appear enter-active-class="animated fadeIn" leave-active-class="animated fadeOut">
    <q-page class="q-pa-md" style="padding-top: 65px">
      <fixed-top-title :name="artistData.name" />
      <small-page-container class="justify-around">
        <div
          class="q-ma-lg"
          v-for="work in artistData.works"
          :key="work.urlImageWork"
          style="width: 300px"
        >
          <router-link
            v-if="work.urlImageWork.includes('video')"
            :to="`/work/${work.id}`"
            style="text-decoration: none; color: #1d1d1d"
          >
            <div style="position: relative">
              <q-video
                :style="$q.screen.xs ? 'max-height: 300px' : 'height: 200px'"
                :src="work.urlImageWork"
              />
              <div
                style="position: absolute; top: 5px; height: 100%; width: 100%; opacity: 0.1"
                class="bg-grey-2"
              ></div>
            </div>
          </router-link>
          <router-link
            v-else
            :to="`/work/${work.id}`"
            style="text-decoration: none; color: #1d1d1d"
          >
            <q-img
              :src="work.urlImageWork"
              :style="$q.screen.xs ? 'max-height: 300px' : 'height: 200px'"
              fit="contain"
            />
          </router-link>
        </div>
      </small-page-container>
      <q-separator />
      <small-page-container>
        <shared-card
          :data-card="{
            name: $t('artist.about'),
            url: artistData.urlPortrait,
            description: artistData.description
          }"
        >
          <template #underPicture>
            <q-card-section>
              <div v-if="artistData.linkFacebook" class="text-subtitle1">
                <a
                  :href="artistData.linkFacebook"
                  target="_blank"
                  style="text-decoration: none; color: #1d1d1d"
                >
                  <q-icon name="mdi-facebook" size="sm" class="q-mb-xs q-mr-sm" />Facebook</a
                >
              </div>
              <div v-if="artistData.linkInstagram" class="text-subtitle1">
                <a
                  :href="artistData.linkInstagram"
                  target="_blank"
                  style="text-decoration: none; color: #1d1d1d"
                >
                  <q-icon name="mdi-instagram" size="sm" class="q-mb-xs q-mr-sm" />Instagram</a
                >
              </div>
            </q-card-section>
          </template>
        </shared-card>
      </small-page-container>
      <q-separator />
      <small-page-container v-if="artistData.education">
        <q-toolbar>
          <q-toolbar-title class="text-h5">{{ $t('artist.education') }}</q-toolbar-title>
        </q-toolbar>
        <p class="text-justify text-body1" style="white-space: pre-line">
          {{ artistData.education }}
        </p>
      </small-page-container>
      <q-separator v-if="artistData.exhibitions || artistData.press" />
      <small-page-container v-if="artistData.exhibitions">
        <q-toolbar>
          <q-toolbar-title class="text-h5">{{ $t('links.exhibitions') }}</q-toolbar-title>
        </q-toolbar>
        <p class="text-justify text-body1" style="white-space: pre-line">
          {{ artistData.exhibitions }}
        </p>
      </small-page-container>
      <q-separator v-if="artistData.press" />
      <small-page-container v-if="artistData.press">
        <q-toolbar class="text-primary">
          <q-toolbar-title class="text-h5">{{ $t('artist.press') }}</q-toolbar-title>
        </q-toolbar>
        <p class="text-justify text-body1" style="white-space: pre-line">
          {{ artistData.press }}
        </p>
      </small-page-container>
    </q-page>
  </transition>
</template>

<script>
import { toRefs, computed } from 'vue'
import { useArtistsStore } from 'stores/artists-store.js'
import { storeToRefs } from 'pinia'
import { useMeta } from 'quasar'
import { useI18n } from 'vue-i18n'
import FixedTopTitle from 'components/shared/Titles/FixedTopTitle.vue'
import SmallPageContainer from 'components/shared/SmallPageContainer.vue'
import SharedCard from 'components/shared/SharedCard.vue'

export default {
  name: 'ArtistProfilePage',
  components: {
    FixedTopTitle,
    SmallPageContainer,
    SharedCard
  },
  props: {
    artistId: {
      type: String,
      require: true
    }
  },
  setup(props) {
    const { locale } = useI18n({ useScope: 'global' })
    const { artistId } = toRefs(props)
    const artistsStore = useArtistsStore()
    const { filterArtistsDraft } = storeToRefs(artistsStore)
    const { getArtists } = artistsStore
    if (!filterArtistsDraft.value.length) getArtists()
    const artistData = computed(() => {
      if (filterArtistsDraft.value.length) {
        let localData = filterArtistsDraft.value.find((item) => item.artistId === artistId.value)
        if (locale.value === 'it') {
          return {
            ...localData,
            description: localData.descriptionIt,
            education: localData.educationIt,
            exhibitions: localData.exhibitionsIt,
            press: localData.pressIt,
            works: localData.works.map((work) => ({
              ...work,
              description: work.descriptionIt,
              materials: work.materialsIt,
              name: work.nameIt
            }))
          }
        } else {
          return { ...localData }
        }
      } else {
        return {}
      }
    })
    useMeta(() => {
      return {
        title: 'Roots',
        titleTemplate: (title) => `${title} | ${artistData.value.name}`,
        meta: {
          description: {
            name: 'description',
            content: artistData.value.description?.split('.')[0]
          },
          ogTitle: {
            property: 'og:title'
          }
        }
      }
    })
    return {
      artistData
    }
  }
}
</script>

<style lang="sass" scoped></style>
