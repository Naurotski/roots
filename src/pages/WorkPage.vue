<template>
  <transition appear enter-active-class="animated fadeIn" leave-active-class="animated fadeOut">
    <q-page v-if="work" class="q-pb-md" style="padding-top: 65px">
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
      <small-page-container>
        <div class="col-12 col-sm-7">
          <q-card-section>
            <carousel-component :url-images="allUrlImagesWork" />
          </q-card-section>
        </div>
        <div class="col-12 col-sm-5 q-pt-sm-md">
          <q-card-section class="q-pt-none">
            <div class="text-h5" v-text="work.name" />
          </q-card-section>
          <q-card-section>
            <p
              style="white-space: pre-line"
              class="text-justify text-body1"
              v-text="work.materials"
            />
            <div style="white-space: pre-line" class="text-justify text-body1">
              <description-for-card
                :item-description="work.description"
                :number="$q.screen.xs ? 250 : 700"
              />
            </div>
            <p
              v-if="work.price"
              style="white-space: pre-line"
              class="text-justify text-body1"
              v-text="`€ ${work.price}`"
            />
            <payment-dialog v-if="work.price" :works="[work]" />
          </q-card-section>
        </div>
        <q-btn
          class="q-ml-md"
          outline
          rounded
          size="md"
          icon="mdi-arrow-left-bold"
          @click="$router.go(-1)"
        />
      </small-page-container>
    </q-page>
  </transition>
  <pre>work - {{work}}</pre>
</template>

<script>
import { computed, toRefs } from 'vue'
import { useMeta, useQuasar } from 'quasar'
import { storeToRefs } from 'pinia'
import { useI18n } from 'vue-i18n'
import { useAuthStore } from 'stores/auth-store'
import { useArtistsStore } from 'stores/artists-store.js'
import { useStripeStore } from 'stores/stripe-store'
import FixedTopTitle from 'components/shared/Titles/FixedTopTitle.vue'
import SmallPageContainer from 'components/shared/SmallPageContainer.vue'
import CarouselComponent from 'components/shared/CarouselComponent.vue'
import PaymentDialog from 'components/dialogs/PaymentDialog.vue'
import { findWork } from 'src/composables/findWork.js'
import DescriptionForCard from 'components/shared/DescriptionForCard.vue'

export default {
  name: 'WorkPage',
  components: {
    DescriptionForCard,
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
    const { locale, t } = useI18n({ useScope: 'global' })
    const { workId } = toRefs(props)
    const authStore = useAuthStore()
    const { loggedIn } = storeToRefs(authStore)
    const artistsStore = useArtistsStore()
    const { artistsList, allWorks } = storeToRefs(artistsStore)
    const { getArtists } = artistsStore
    const stripeStore = useStripeStore()
    const { cart } = storeToRefs(stripeStore)
    const { addProductToCart, updateCart } = stripeStore
    if (!artistsList.value.length) getArtists()
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
      if (loggedIn.value) {
        addProductToCart({ ...work, quantityCart: 1 }).then(() =>
          $q.notify({
            message: t('cart.addedCart'),
            color: 'grey',
            badgeColor: 'grey',
            badgeClass: 'shadow-3 glossy my-badge-class'
          })
        )
      } else {
        updateCart({ key: work.id, value: { ...work, quantityCart: 1 } })
      }
    }
    useMeta(() => {
      return {
        title: `${t('meta.homeTitle')}| ${
          locale.value === 'it' ? work.value?.nameIt : work.value?.name
        }`,
        meta: {
          description: {
            name: 'description',
            content: locale.value === 'it' ? work.value?.materialsIt : work.value?.materials
          },
          keywords: {
            name: 'keywords',
            content: t('meta.forSaleKeywords')
          },
          robots: {
            name: 'robots',
            content: 'index, follow'
          }
        },
        link: {
          canonical: {
            rel: 'canonical',
            href: `https://aortagallery.com/work/${workId.value}`
          }
        },
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
