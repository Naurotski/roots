<template>
  <transition appear enter-active-class="animated fadeIn" leave-active-class="animated fadeOut">
    <q-page v-if="work" class="q-pa-md" style="padding-top: 65px">
      <fixed-top-title :name="work.artistName">
        <template #link>
          <router-link
            :to="`/artists/${work.artistId}`"
            style="text-decoration: none; color: #1d1d1d"
          >
            {{ work.firstName }} {{ work.lastName }}
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
            <q-btn
              no-caps
              outline
              rounded
              style="width: 150px"
              :class="{ 'full-width q-mt-xs': $q.screen.xs, 'q-ml-md': !$q.screen.xs }"
              :label="presenceProductInCart ? $t('cart.seeCart') : $t('cart.addCart')"
              @click="presenceProductInCart ? $router.push('/basket') : addToCart(work)"
            />
          </q-card-section>
        </div>
        <q-btn outline size="md" icon="mdi-arrow-left-bold" @click="$router.go(-1)" />
        <!--                <router-link :to="`/thankYou/${workId}`">Work</router-link>-->
      </small-page-container>
    </q-page>
  </transition>
</template>

<script>
import { computed, toRefs } from 'vue'
import { useMeta, useQuasar } from 'quasar'
import { useRoute } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useI18n } from 'vue-i18n'
import { useArtistsStore } from 'stores/artists-store.js'
import { useStripeStore } from 'stores/stripe-store'
import FixedTopTitle from 'components/shared/Titles/FixedTopTitle.vue'
import SmallPageContainer from 'components/shared/SmallPageContainer.vue'
import CarouselComponent from 'components/shared/CarouselComponent.vue'
import PaymentDialog from 'components/dialogs/PaymentDialog.vue'
import { findWork } from 'src/composables/findWork.js'

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
    const $q = useQuasar()
    const { t } = useI18n()
    const route = useRoute()
    const { workId } = toRefs(props)
    const artistsStore = useArtistsStore()
    const { filterArtistsDraft, allWorks } = storeToRefs(artistsStore)
    const { getArtists } = artistsStore
    const stripeStore = useStripeStore()
    const { cart } = storeToRefs(stripeStore)
    const { addProductToCart } = stripeStore
    if (!filterArtistsDraft.value.length) getArtists()
    const work = computed(() => findWork(allWorks, workId))
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
    const presenceProductInCart = computed(() => cart.value[workId.value])
    const addToCart = (work) => {
      console.log(work)
      addProductToCart({ ...work, quantity: 1 })
      $q.notify({
        message: t('cart.addedCart'),
        color: 'grey',
        badgeColor: 'white',
        badgeTextColor: 'dark',
        badgeClass: 'shadow-3 glossy my-badge-class'
      })
    }
    useMeta(() => {
      return {
        title: `Aorta Social Art Gallery | ${work.value?.name}`,
        link: {
          canonical: {
            rel: 'canonical',
            href: `https://aortagallery.com${route.fullPath}`
          }
        },
        meta: {
          description: {
            name: 'description',
            content: work.value?.description
          },
          keywords: {
            name: 'keywords',
            content: 'Buy paintings, sculptures, contemporary art in Pisa Italy'
          },
          ogTitle: {
            property: 'og:title'
          }
        }
      }
    })
    return {
      work,
      allUrlImagesWork,
      presenceProductInCart,
      addToCart
    }
  }
}
</script>

<style scoped></style>
