<template>
  <transition appear enter-active-class="animated fadeIn" leave-active-class="animated fadeOut">
    <q-page class="q-pa-md" style="padding-top: 65px">
      <fixed-top-title :name="$t('cart.cart')" />
      <div class="row justify-center">
        <div style="max-width: 1400px">
          <div>
            <div v-if="!cartCounter" class="text-center text-h5">{{ $t('cart.cartEmpty') }}</div>
            <div v-if="!loggedIn" class="text-center text-body1 q-my-md">
              {{ $t('cart.haveAccount') }}
            </div>
            <div class="text-center">
              <q-btn
                no-caps
                outline
                rounded
                color="primary"
                style="width: 200px"
                :class="{ 'full-width': $q.screen.xs }"
                :label="$t('cart.tartShopping')"
                to="/sale"
              />
              <q-btn
                v-if="!loggedIn"
                no-caps
                outline
                rounded
                color="primary"
                style="width: 200px"
                :class="{ 'full-width q-mt-xs': $q.screen.xs, 'q-ml-md': !$q.screen.xs }"
                :label="$t('auth.singIn')"
                @click="singIn"
              />
            </div>
          </div>
        </div>
      </div>
      <q-btn label="+" @click="changeCartCounter(1)"/>
      <pre>cartCounter - {{cartCounter}}</pre>
    </q-page>
  </transition>
</template>

<script>
import { storeToRefs } from 'pinia'
import { useAuthStore } from 'stores/auth-store'
import { useStripeStore } from 'stores/stripe-store'
import FixedTopTitle from 'components/shared/Titles/FixedTopTitle.vue'
export default {
  name: 'BasketPage',
  components: { FixedTopTitle },
  setup() {
    const authStore = useAuthStore()
    const { loggedIn, loginDialog } = storeToRefs(authStore)
    const { showLoginDialog } = authStore
    const stripeStore = useStripeStore()
    const { cartCounter } = storeToRefs(stripeStore)
    console.log(cartCounter.value)
    const { changeCartCounter } = stripeStore
    const singIn = () => {
      if (!loginDialog.value && !loggedIn.value) {
        showLoginDialog(true)
      }
    }
    return {
      loggedIn,
      cartCounter,
      changeCartCounter,
      singIn
    }
  }
}
</script>
<style scoped></style>
