<template>
  <div class="q-ma-lg" v-for="item in list" :key="item.id" style="width: 300px">
    <router-link
      v-if="item.urlImage.includes('video')"
      :to="`/merch/${item.rubric}/${item.id}`"
      style="text-decoration: none; color: #1d1d1d"
    >
      <div style="position: relative">
        <q-video
          :style="$q.screen.xs ? 'max-height: 300px' : 'height: 300px'"
          :src="item.urlImage"
        />
        <div
          style="position: absolute; top: 5px; height: 100%; width: 100%; opacity: 0.1"
          class="bg-grey-2"
        />
      </div>
      <div class="text-body1 q-mt-md">
        <b>{{ item.name }}</b>
        <p>{{ item.description }}</p>
        <p>{{ `€ ${item.price}` }}</p>
      </div>
    </router-link>
    <router-link
      v-else
      :to="`/merch/${item.rubric}/${item.id}`"
      style="text-decoration: none; color: #1d1d1d"
    >
      <q-img
        :src="item.urlImage"
        fit="contain"
        :style="$q.screen.xs ? 'max-height: 300px' : 'height: 300px'"
      />
      <div class="text-body1 q-mt-md">
        <b>{{ item.name }}</b>
        <p>{{ item.description }}</p>
      </div>
    </router-link>
    <div class="row justify-between">
      <div class="text-subtitle1">{{ `€ ${item.price}` }}</div>
      <q-btn
        no-caps
        outline
        rounded
        style="width: 150px"
        :class="{ 'full-width q-mt-xs': $q.screen.xs, 'q-ml-md': !$q.screen.xs }"
        :label="cart[item.id] ? $t('cart.seeCart') : $t('cart.addCart')"
        @click="cart[item.id] ? $router.push('/basket') : addToCart(item)"
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
export default {
  name: 'MerchList',
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
      cart,
      addToCart
    }
  }
}
</script>

<style scoped></style>
