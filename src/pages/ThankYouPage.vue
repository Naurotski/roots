<template>
  <transition appear enter-active-class="animated fadeIn" leave-active-class="animated fadeOut">
    <div class="fullscreen bg-grey text-white text-center q-pa-md flex flex-center">
      <div>
        <div style="font-size: 8vh">{{ $t('common.thank') }}</div>

        <div v-if="work" class="text-h4" style="opacity: 0.4">
          {{ $t('common.acquired') }}{{ work.artistName }} - {{ work.name }}.
        </div>
        <div class="text-h4" style="opacity: 0.4">
          {{ $t('common.delivery') }}
        </div>

        <q-btn
          class="q-mt-xl"
          color="white"
          text-color="grey"
          unelevated
          to="/"
          label="Go Home"
          no-caps
        />
      </div>
    </div>
  </transition>
</template>

<script>
import { useMeta } from 'quasar'
import { useI18n } from 'vue-i18n'
import { computed, toRefs } from 'vue'
import { useArtistsStore } from 'stores/artists-store.js'
import { storeToRefs } from 'pinia'

const metaData = {
  title: 'Roots',
  titleTemplate: (title) => `${title} | Thank You`
}

export default {
  name: 'ThankYouPage',
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
    useMeta(metaData)
    return {
      work
    }
  }
}
</script>

<style scoped></style>
