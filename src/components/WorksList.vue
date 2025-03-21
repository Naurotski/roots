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
        alt="artwork"
      />
      <div class="text-body1 q-mt-md">
        <div>{{ work.artistName }}</div>
        <b>{{ work.name }}</b>
        <p>{{ work.materials }}</p>
      </div>
    </router-link>
    <div class="row justify-between">
      <div class="text-subtitle1">{{ `€ ${work.price}` }}</div>
      <payment-dialog :works="[work]" />
    </div>
  </div>
</template>

<script>
import { storeToRefs } from 'pinia'
import { useQuasar } from 'quasar'
import { useI18n } from 'vue-i18n'
import { useAuthStore } from 'stores/auth-store'
import { useStripeStore } from 'stores/stripe-store'
import PaymentDialog from 'components/dialogs/PaymentDialog.vue'

export default {
  name: 'WorksList',
  components: {
    PaymentDialog
  },
  props: {
    worksList: {
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
    return {
      cart,
      addToCart
    }
  }
}
</script>

<style lang="sass" />
