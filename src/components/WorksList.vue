<template>
  <div class="q-ma-lg" v-for="work in worksList" :key="work.urlImageWork" style="width: 300px">
    <router-link
      v-if="work.urlImageWork.includes('video')"
      :to="`/work/${work.id}`"
      style="text-decoration: none; color: #1d1d1d"
    >
      <div style="position: relative">
        <q-video
          :style="$q.screen.xs ? 'max-height: 300px' : 'height: 300px'"
          :src="work.urlImageWork"
        />
        <div
          style="position: absolute; top: 5px; height: 100%; width: 100%; opacity: 0.1"
          class="bg-grey-2"
        />
      </div>
      <div class="text-body1 q-mt-md">
        <div>{{ work.artistName }}</div>
        <b>{{ work.name }}</b>
        <p>{{ work.materials }}</p>
        <p>{{ `€ ${work.price}` }}</p>
      </div>
    </router-link>
    <router-link v-else :to="`/work/${work.id}`" style="text-decoration: none; color: #1d1d1d">
      <q-img
        :src="work.urlImageWork"
        fit="contain"
        :style="$q.screen.xs ? 'max-height: 300px' : 'height: 300px'"
      />
      <div class="text-body1 q-mt-md">
        <div>{{ work.artistName }}</div>
        <b>{{ work.name }}</b>
        <p>{{ work.materials }}</p>
      </div>
    </router-link>
    <div class="row justify-between">
      <div class="text-subtitle1">{{ `€ ${work.price}` }}</div>
      <q-btn
        no-caps
        outline
        rounded
        style="width: 150px"
        :class="{ 'full-width q-mt-xs': $q.screen.xs, 'q-ml-md': !$q.screen.xs }"
        :label="cart[work.id] ? $t('cart.seeCart') : $t('cart.addCart')"
        @click="cart[work.id] ? $router.push('/basket') : addToCart(work)"
      />
    </div>
  </div>
</template>

<script>
import { storeToRefs } from 'pinia'
import { useQuasar } from 'quasar'
import { useI18n } from 'vue-i18n'
import { useStripeStore } from 'stores/stripe-store'

export default {
  name: 'WorksList',
  props: {
    worksList: {
      type: Array,
      required: true
    }
  },
  setup() {
    const $q = useQuasar()
    const { t } = useI18n()
    const stripeStore = useStripeStore()
    const { cart } = storeToRefs(stripeStore)
    const { addProductToCart } = stripeStore
    const addToCart = (work) => {
      addProductToCart({ ...work, quantity: 1 })
      $q.notify({
        message: t('cart.addedCart'),
        color: 'grey',
        badgeColor: 'grey',
        badgeClass: 'shadow-3 glossy my-badge-class'
      })
    }
    return {
      cart,
      addToCart
    }
  }
}
</script>

<style lang="sass" />
