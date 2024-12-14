<template>
  <div class="q-ma-lg" v-for="item in list" :key="item.id" style="width: 300px">
    <router-link
      :to="`/merch/${item.rubric}/${item.id}`"
      style="text-decoration: none; color: #1d1d1d"
    >
      <q-img
        :src="item.urlImage"
        fit="contain"
        :style="$q.screen.xs ? 'max-height: 300px' : 'height: 300px'"
      />
    </router-link>
    <div class="text-body1 q-mt-md">
      <div class="text-bold">{{ item.name }}</div>
      <description-for-card :item-description="item.description" />
    </div>

    <div class="row justify-between q-mt-md">
      <div class="text-subtitle1">{{ `€ ${item.price}` }}</div>
      <q-btn
        no-caps
        outline
        rounded
        style="width: 150px"
        :class="{ 'full-width q-mt-xs': $q.screen.xs, 'q-ml-md': !$q.screen.xs }"
        :label="
          cart[item.id] && cart[item.id].quantityCart >= item.quantity
            ? $t('cart.seeCart')
            : $t('cart.addCart')
        "
        @click="
          cart[item.id] && cart[item.id].quantityCart >= item.quantity
            ? $router.push('/basket')
            : addToCart(item)
        "
      />
    </div>
  </div>
</template>

<script>
import { storeToRefs } from 'pinia'
import { useQuasar } from 'quasar'
import { useI18n } from 'vue-i18n'
import { useAuthStore } from 'stores/auth-store'
import { useStripeStore } from 'stores/stripe-store'
import DescriptionForCard from 'components/shared/DescriptionForCard.vue'
export default {
  name: 'MerchList',
  components: {
    DescriptionForCard
  },
  props: {
    list: {
      type: Array,
      required: true
    }
  },
  setup() {
    const $q = useQuasar()
    const { t } = useI18n()
    const authStore = useAuthStore()
    const { loggedIn } = storeToRefs(authStore)
    const stripeStore = useStripeStore()
    const { cart } = storeToRefs(stripeStore)
    const { addProductToCart, updateCart } = stripeStore
    const addToCart = (merch) => {
      if (loggedIn.value) {
        addProductToCart({
          ...merch,
          quantityCart: 1,
          urlImageWork: merch.urlImage,
          urlSecondImagesWork: merch.urlSecondImages || [],
          urlImage: null,
          urlSecondImages: null
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
            quantityCart: 1,
            urlImageWork: merch.urlImage,
            urlSecondImagesWork: merch.urlSecondImages || [],
            urlImage: null,
            urlSecondImages: undefined
          }
        })
      }
    }
    return {
      cart,
      addToCart
    }
  }
}
</script>

<style scoped></style>
