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
    <div class="text-body1 q-mt-md text-justify">
      <div class="text-bold">{{ item.name }}</div>
      <description-for-card
        :item-description="item.description"
        :number="$q.screen.xs ? 150 : 250"
      />
    </div>

    <div class="row justify-between q-mt-md">
      <div class="text-h5">{{ `€ ${item.price}` }}</div>
      <button-per-merch-list :merch="item" @event-handling="addToCart" />
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
import ButtonPerMerchList from 'components/merch/ButtonPerMerchList.vue'
export default {
  name: 'MerchList',
  components: {
    DescriptionForCard,
    ButtonPerMerchList
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
          urlSecondImages: null,
          id: merch.variants ? `${merch.id}_${merch.variants[0].variantId}` : merch.id
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
          key: merch.variants ? `${merch.id}_${merch.variants[0].variantId}` : merch.id,
          value: {
            ...merch,
            quantityCart: 1,
            urlImageWork: merch.urlImage,
            urlSecondImagesWork: merch.urlSecondImages || [],
            urlImage: null,
            urlSecondImages: undefined,
            id: merch.variants ? `${merch.id}_${merch.variants[0].variantId}` : merch.id
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
