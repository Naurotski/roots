<template>
  <transition appear enter-active-class="animated fadeIn" leave-active-class="animated fadeOut">
    <q-page class="q-pa-md" style="padding-top: 65px">
      <fixed-top-title name="Artists" />
      <div class="q-gutter-md row wrap justify-around q-my-md">
        <q-card v-for="{ artistId, name, urlPortrait } in filterArtistsDraft" :key="artistId">
          <router-link :to="`/artists/${artistId}`">
            <!--удалить размер при правильной фотографии-->
            <q-img :src="urlPortrait" style="height: 300px; width: 300px">
              <div class="absolute-bottom text-body1 text-center">
                {{ name }}
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

    return {
      filterArtistsDraft
    }
  }
}
</script>

<style></style>
