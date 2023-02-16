<template>
  <transition appear enter-active-class="animated fadeIn" leave-active-class="animated fadeOut">
    <q-page padding>
      <p class="text-h3 q-ml-xl">Artists</p>
      <div class="q-gutter-sm row wrap justify-around">
        <q-card
          class="my-card"
          v-for="{ artistId, name, urlPortrait } in filterArtistsDraft"
          :key="artistId"
        >
          <router-link :to="`/artists/${artistId}`">
            <!--удалить размер при правильной фотографии-->
            <q-img :src="urlPortrait" style="height: 400px; max-width: 400px">
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

export default {
  name: 'ArtistsPage',
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

<style lang="sass" scoped>
.my-card
  width: 100%
  max-width: 400px
</style>
