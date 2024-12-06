<template>
  <transition appear enter-active-class="animated fadeIn" leave-active-class="animated fadeOut">
    <div class="fullscreen bg-grey text-white text-center q-pa-md flex flex-center">
      <div>
        <div class="text-h1" :class="{ 'text-h3': $q.screen.xs }" style="color: black">
          {{ $t('common.thank') }}
        </div>
        <!--        <div v-if="work" class="text-h4" style="opacity: 0.4">-->
        <!--          {{ $t('common.acquired') }}{{ work.artistName }} - {{ work.name }}.-->
        <!--        </div>-->
        <div v-if="$i18n.locale === 'en'">
          <div class="text-h3" :class="{ 'text-h5': $q.screen.xs }">
            An email with your order number has been sent to you.
          </div>
          <div class="text-body1" style="opacity: 0.5">
            If you do not see the email, please check your spam folder.
          </div>
        </div>
        <div v-else>
          <div class="text-h3" :class="{ 'text-h5': $q.screen.xs }">
            Ti è stata inviata un'e-mail con il numero dell'ordine.
          </div>
          <div class="text-body1" style="opacity: 0.5">
            Se non vedi l'e-mail, controlla lo spam.
          </div>
        </div>
        <div class="text-h3" :class="{ 'text-h5': $q.screen.xs }">
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
// import { computed, toRefs } from 'vue'
// import { useArtistsStore } from 'stores/artists-store.js'
// import { storeToRefs } from 'pinia'
// import { findWork } from 'src/composables/findWork.js'

export default {
  name: 'ThankYouPage',
  setup() {
    useMeta(() => {
      return {
        title: 'Aorta Social Art Gallery',
        titleTemplate: (title) => `${title} | Thank You`
      }
    })
  }
  // props: {
  //   workId: {
  //     type: String,
  //     required: true
  //   }
  // },
  // setup(props) {
  //   const { workId } = toRefs(props)
  //   const artistsStore = useArtistsStore()
  //   const { filterArtistsDraft, allWorks } = storeToRefs(artistsStore)
  //   const { getArtists } = artistsStore
  //   if (!filterArtistsDraft.value.length) getArtists()
  //   const work = computed(() => findWork(allWorks, workId))

  //   return {
  //     work
  //   }
  // }
}
</script>

<style scoped></style>
