<template>
  <transition appear enter-active-class="animated fadeIn" leave-active-class="animated fadeOut">
    <q-page class="q-pa-md" style="padding-top: 65px">
      <fixed-top-title :name="$t('links.artists')" />
      <small-page-container class="q-gutter-md justify-around q-my-md">
        <q-card
          v-for="{ artistId, firstName, lastName, urlPortrait, urlWorkShowcase } in artistsList"
          :key="artistId"
        >
          <router-link :to="`/artists/${artistId}`">
            <q-img
              :src="urlWorkShowcase || urlPortrait"
              style="height: 300px; width: 300px"
              alt="artwork"
            >
              <div class="absolute-bottom text-body1 text-center">
                {{ firstName }} {{ lastName }}
              </div></q-img
            >
          </router-link>
        </q-card>
      </small-page-container>
    </q-page>
  </transition>
</template>

<script>
import { useMeta } from 'quasar'
import { storeToRefs } from 'pinia'
import { useI18n } from 'vue-i18n'
import { useArtistsStore } from 'stores/artists-store.js'
import FixedTopTitle from 'components/shared/Titles/FixedTopTitle.vue'
import SmallPageContainer from 'components/shared/SmallPageContainer.vue'

export default {
  name: 'ArtistsPage',
  components: {
    FixedTopTitle,
    SmallPageContainer
  },
  setup() {
    const { t } = useI18n()
    const artistsStore = useArtistsStore()
    const { artistsList } = storeToRefs(artistsStore)
    const { getArtists } = artistsStore
    if (!artistsList.value.length) getArtists()
    useMeta(() => {
      return {
        title: t('meta.homeTitle'),
        titleTemplate: (title) => `${title} | ${t('links.artists')}`,
        meta: {
          description: {
            name: 'description',
            content: t('meta.artistsDescription')
          },
          keywords: {
            name: 'keywords',
            content: t('meta.artistsKeywords')
          },
          robots: {
            name: 'robots',
            content: 'index, follow'
          }
        },
        link: {
          canonical: {
            rel: 'canonical',
            href: 'https://aortagallery.com/artists'
          }
        }
      }
    })
    return {
      artistsList
    }
  }
}
</script>

<style></style>
