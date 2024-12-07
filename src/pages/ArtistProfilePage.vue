<template>
  <transition appear enter-active-class="animated fadeIn" leave-active-class="animated fadeOut">
    <q-page class="q-pa-md" style="padding-top: 65px">
      <fixed-top-title :name="`${artistData.firstName} ${artistData.lastName}`" />
      <div class="q-gutter-md row wrap justify-around q-mb-md">
        <q-card style="height: 250px" v-for="work in artistData.works" :key="work.urlImageWork">
          <template v-if="work.urlImageWork.includes('video')">
            <router-link :to="`/work/${work.id}`">
              <div style="position: relative">
                <q-video style="height: 25vh" :src="work.urlImageWork" />
                <div
                  style="position: absolute; top: 5px; height: 100%; width: 100%; opacity: 0.1"
                  class="bg-grey-2"
                ></div>
              </div>
            </router-link>
          </template>
          <template v-else>
            <router-link :to="`/work/${work.id}`">
              <img
                :src="work.urlImageWork"
                style="height: 250px; width: 250px; object-fit: contain"
                alt="artwork"
              />
            </router-link>
          </template>
        </q-card>
      </div>
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
      <q-separator v-if="typeof artistData.press === 'object'" />
      <small-page-container v-if="typeof artistData.press === 'object'">
        <q-toolbar class="text-primary">
          <q-toolbar-title class="text-h5">{{ $t('artist.press') }}</q-toolbar-title>
        </q-toolbar>
        <ul>
          <li v-for="{ name, link } in artistData.press" :key="name">
            <component
              :is="link ? 'a' : 'span'"
              :href="link"
              class="text-justify text-body1"
              style="white-space: pre-line"
              target="_blank"
            >
              {{ name }}
            </component>
          </li>
        </ul>
      </small-page-container>
    </q-page>
  </transition>
</template>

<script>
import { toRefs, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useMeta } from 'quasar'
import { useI18n } from 'vue-i18n'
import { useArtistsStore } from 'stores/artists-store.js'
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
    const router = useRouter()
    const { locale } = useI18n({ useScope: 'global' })
    const { artistId } = toRefs(props)
    const artistsStore = useArtistsStore()
    const { artistsList } = storeToRefs(artistsStore)
    const { getArtists } = artistsStore
    if (!artistsList.value.length) getArtists()
    const artistData = computed(() => {
      if (artistsList.value.length) {
        let localData = artistsList.value.find((item) => item.artistId === artistId.value)
        if (locale.value === 'it') {
          return {
            ...localData,
            description: localData.descriptionIt,
            education: localData.educationIt,
            exhibitions: localData.exhibitionsIt,
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
    watch(
      artistsList,
      (val) => {
        if (!val.find((item) => item.artistId === artistId.value)) router.push('/artists')
      },
      { deep: true }
    )
    useMeta(() => {
      return {
        title: 'Aorta Social Art Gallery',
        titleTemplate: (title) => `${title} | ${artistData.value.name}`,
        link: {
          canonical: {
            rel: 'canonical',
            href: `https://aortagallery.com/artists/${artistId.value}`
          }
        },
        meta: {
          description: {
            name: 'description',
            content: artistData.value.description?.split('.')[0]
          },
          keywords: {
            name: 'keywords',
            content: 'Buy paintings, sculptures, contemporary art, souvenirs in Pisa Italy'
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

<style lang="sass" scoped />
