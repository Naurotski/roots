<template>
  <q-page class="q-pa-md" style="margin-top: 60px">
    <fixed-top-title :name="artistData.name" />
    <div class="q-gutter-sm row justify-around q-my-md">
      <div v-for="work in artistData.works" :key="work.urlImageWork">
        <full-width-dialog :work="work" :artistName="artistData.name">
          <template #button="{ onUseActivator }">
            <div style="position: relative" v-if="work.urlImageWork.includes('video')">
              <q-video style="height: 25vh" :src="work.urlImageWork" @click="onUseActivator" />
              <div
                style="position: absolute; top: 5px; height: 100%; width: 100%; opacity: 0.1"
                @click="onUseActivator"
                class="bg-grey-2 cursor-pointer"
              ></div>
            </div>

            <img
              v-else
              class="cursor-pointer"
              :src="work.urlImageWork"
              style="height: 25vh"
              :alt="artistData.name"
              @click="onUseActivator"
            />
          </template>
        </full-width-dialog>
      </div>
    </div>
    <q-separator />
    <small-page-container>
      <shared-card
        :data-card="{
          name: 'About',
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
        <q-toolbar-title class="text-h5">Education</q-toolbar-title>
      </q-toolbar>
      <p class="text-justify text-subtitle1" style="white-space: pre-line">
        {{ artistData.education }}
      </p>
    </small-page-container>
    <q-separator />
    <small-page-container v-if="artistData.exhibitions">
      <q-toolbar>
        <q-toolbar-title class="text-h5">Exhibitions</q-toolbar-title>
      </q-toolbar>
      <p class="text-justify text-subtitle1" style="white-space: pre-line">
        {{ artistData.exhibitions }}
      </p>
    </small-page-container>
    <q-separator />
    <small-page-container v-if="artistData.press">
      <q-toolbar class="text-primary">
        <q-toolbar-title class="text-h5"> Press </q-toolbar-title>
      </q-toolbar>
      <p class="text-justify text-subtitle1" style="white-space: pre-line">
        {{ artistData.press }}
      </p>
    </small-page-container>
  </q-page>
</template>

<script>
import { toRefs, computed } from 'vue'
import { useArtistsStore } from 'stores/artists-store.js'
import { storeToRefs } from 'pinia'
import FixedTopTitle from 'components/shared/Titles/FixedTopTitle.vue'
import SmallPageContainer from 'components/shared/SmallPageContainer.vue'
import FullWidthDialog from 'components/dialogs/FullWidthDialog.vue'
import SharedCard from 'components/shared/SharedCard.vue'

export default {
  name: 'ArtistProfilePage',
  components: {
    FixedTopTitle,
    SmallPageContainer,
    FullWidthDialog,
    SharedCard
  },
  props: {
    artistId: {
      type: String,
      require: true
    }
  },
  setup(props) {
    const { artistId } = toRefs(props)
    const artistsStore = useArtistsStore()
    const { filterArtistsDraft } = storeToRefs(artistsStore)
    const { getArtists } = artistsStore
    if (!filterArtistsDraft.value.length) getArtists()
    const artistData = computed(() => {
      if (filterArtistsDraft.value.length) {
        return filterArtistsDraft.value.find((item) => {
          return item.artistId === artistId.value
        })
      } else {
        return []
      }
    })
    return {
      artistData
    }
  }
}
</script>

<style lang="sass" scoped></style>
