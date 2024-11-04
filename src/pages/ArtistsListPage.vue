<template>
  <transition appear enter-active-class="animated fadeIn" leave-active-class="animated fadeOut">
    <q-page class="q-pa-md" style="padding-top: 65px">
      <fixed-top-title :name="$t('links.artists')" />
      <div class="q-gutter-md row wrap justify-around q-my-md">
        <q-card
          v-for="{
            artistId,
            firstName,
            lastName,
            urlPortrait,
            urlWorkShowcase
          } in filterArtistsDraft"
          :key="artistId"
        >
          <router-link :to="`/artists/${artistId}`">
            <!--удалить размер при правильной фотографии-->
            <q-img :src="urlWorkShowcase || urlPortrait" style="height: 300px; width: 300px">
              <div class="absolute-bottom text-body1 text-center">
                {{ firstName }} {{ lastName }}
              </div></q-img
            >
          </router-link>
        </q-card>
      </div>
    </q-page>
  </transition>
</template>

<script>
import { useArtistsStore } from 'stores/artists-store.js'
import { storeToRefs } from 'pinia'
import FixedTopTitle from 'components/shared/Titles/FixedTopTitle.vue'
import { useMeta } from 'quasar'

export default {
  name: 'ArtistsPage',
  components: {
    FixedTopTitle
  },
  setup() {
    const artistsStore = useArtistsStore()
    const { filterArtistsDraft } = storeToRefs(artistsStore)
    const { getArtists } = artistsStore
    if (!filterArtistsDraft.value.length) getArtists()
    useMeta(() => {
      return {
        title: 'Aorta Social Art Gallery',
        titleTemplate: (title) => `${title} | Artists`,
        meta: {
          description: {
            name: 'description',
            content:
              'Aorta Social Art Gallery is a young and aspiring online gallery of contemporary art. Roots Gallery sees its mission in promoting art that can help the viewer to learn about, examine, live and comprehend sensory experience.'
          },
          ogTitle: {
            property: 'og:title'
          }
        }
      }
    })
    return {
      filterArtistsDraft
    }
  }
}
</script>

<style></style>
