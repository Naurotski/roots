<template>
  <transition appear enter-active-class="animated fadeIn" leave-active-class="animated fadeOut">
    <q-page v-if="merch" class="q-pa-md" style="padding-top: 65px">
      <small-page-container class="q-pt-md">
        <div class="col-12 col-sm-8">
          <q-card-section>
            <carousel-component v-if="allUrlImages.length" :url-images="allUrlImages" />
          </q-card-section>
        </div>
        <div class="col-12 col-sm-4 q-pt-sm-md">
          <q-card-section class="q-pt-none">
            <div class="text-h5" v-text="merch.name" />
          </q-card-section>
          <q-card-section>
            <p
              style="white-space: pre-line"
              class="text-justify text-body1"
              v-text="merch.description"
            />
            <p
              v-if="merch.price"
              style="white-space: pre-line"
              class="text-justify text-body1"
              v-text="`€ ${merch.price}`"
            />
            <payment-dialog v-if="merch.price" :work="merch" />
            <q-btn
              no-caps
              outline
              rounded
              style="width: 150px"
              :class="{ 'full-width q-mt-xs': $q.screen.xs, 'q-ml-md': !$q.screen.xs }"
              :label="presenceProductInCart ? $t('cart.seeCart') : $t('cart.addCart')"
              @click="addToCart(merch)"
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
import { storeToRefs } from 'pinia'
import { useQuasar } from 'quasar'
import { useI18n } from 'vue-i18n'
import { useAuthStore } from 'stores/auth-store'
import { useStripeStore } from 'stores/stripe-store'
import { useMerchStore } from 'stores/merch-store'
import SmallPageContainer from 'components/shared/SmallPageContainer.vue'
import CarouselComponent from 'components/shared/CarouselComponent.vue'
import PaymentDialog from 'components/dialogs/PaymentDialog.vue'

export default {
  name: 'MerchPage',
  components: { CarouselComponent, SmallPageContainer, PaymentDialog },
  props: {
    rubric: {
      type: String,
      require: true
    },
    id: {
      type: String,
      require: true
    }
  },
  setup(props) {
    const { rubric, id } = toRefs(props)
    const $q = useQuasar()
    const { t } = useI18n()
    const authStore = useAuthStore()
    const { loggedIn } = storeToRefs(authStore)
    const stripeStore = useStripeStore()
    const { cart } = storeToRefs(stripeStore)
    const { addProductToCart, updateCart } = stripeStore
    const merchStore = useMerchStore()
    const { merchList } = storeToRefs(merchStore)
    const { listenForChildMerch } = merchStore
    if (!merchList.value[rubric.value]) listenForChildMerch(rubric.value)
    const merch = computed(() => {
      return merchList.value[rubric.value]?.[id.value]
    })
    const allUrlImages = computed(() => {
      if (merch.value) {
        if (merch.value.urlSecondImages) {
          return [merch.value.urlImage, ...merch.value.urlSecondImages.map((item) => item.url)]
        } else {
          return [merch.value.urlImage]
        }
      } else {
        return []
      }
    })
    const presenceProductInCart = computed(() => cart.value[merch.value])
    const addToCart = (merch) => {
      if (loggedIn.value) {
        addProductToCart({
          ...merch,
          quantity: 1,
          urlImageWork: merch.urlImage,
          urlSecondImagesWork: merch.urlSecondImages || []
        }).then(() =>
          $q.notify({
            message: t('cart.addedCart'),
            color: 'grey',
            badgeColor: 'grey',
            badgeClass: 'shadow-3 glossy my-badge-class'
          })
        )
      } else {
        updateCart({
          key: merch.id,
          value: {
            ...merch,
            quantity: 1,
            urlImageWork: merch.urlImage,
            urlSecondImagesWork: merch.urlSecondImages || []
          }
        })
      }
    }
    return {
      merch,
      allUrlImages,
      presenceProductInCart,
      addToCart
    }
  }
}
</script>

<style scoped></style>
