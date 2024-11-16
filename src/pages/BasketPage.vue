<template>
  <transition appear enter-active-class="animated fadeIn" leave-active-class="animated fadeOut">
    <q-page class="q-pa-xs" style="padding-top: 65px; max-width: 1400px; margin: 0 auto">
      <fixed-top-title :name="$t('cart.cart')">
        <template #link>
          <div v-if="cartCounter" class="row justify-between">
            {{ $t('cart.cart') }}
            <q-btn
              :size="$q.screen.xs ? 'sm' : 'md'"
              no-caps
              outline
              rounded
              :label="`${$t('cart.proceedCheckout')} (${cartCounter} ${$t('cart.items')})`"
            />
          </div>
        </template>
      </fixed-top-title>

      <div v-if="!cartCounter">
        <div class="text-center text-h5">{{ $t('cart.cartEmpty') }}</div>
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
            to="/shop"
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
      <div v-else>
        <product-card v-for="work in filteredActionsI18n" :key="work.id" :data-card="work" />
        <q-separator class="q-mt-md" />
        <div class="row justify-end">
          <div class="col-10 col-sm-3 text-bold text-subtitle1 text-center">
            {{ $t('cart.subtotal') }} ({{ cartCounter }} {{ $t('cart.items') }})
          </div>
          <div class="col-2 text-bold text-h6 text-center">€{{ subtotal }}</div>
        </div>
      </div>

      <!--      <pre>filteredActionsI18n -{{ filteredActionsI18n }}</pre>-->
    </q-page>
  </transition>
</template>

<script>
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useI18n } from 'vue-i18n'
import { useAuthStore } from 'stores/auth-store'
import { useStripeStore } from 'stores/stripe-store'
import FixedTopTitle from 'components/shared/Titles/FixedTopTitle.vue'
import ProductCard from 'components/cart/ProductCard.vue'

export default {
  name: 'BasketPage',
  components: {
    FixedTopTitle,
    ProductCard
  },
  setup() {
    const { locale } = useI18n({ useScope: 'global' })
    const authStore = useAuthStore()
    const { loggedIn, loginDialog } = storeToRefs(authStore)
    const { showLoginDialog } = authStore
    const stripeStore = useStripeStore()
    const { cart, cartCounter } = storeToRefs(stripeStore)

    const filteredActionsI18n = computed(() => {
      if (locale.value === 'it') {
        return cart.value.map((item, index) => ({
          ...item,
          description: item.descriptionIt,
          materials: item.materialsIt,
          name: item.nameIt,
          cartIndex: index
        }))
      } else {
        return cart.value.map((item, index) => ({
          ...item,
          cartIndex: index
        }))
      }
    })
    const subtotal = computed(() =>
      cart.value.reduce((result, item) => result + +item.quantity * item.price, 0)
    )
    const singIn = () => {
      if (!loginDialog.value && !loggedIn.value) {
        showLoginDialog(true)
      }
    }
    return {
      loggedIn,
      cart,
      cartCounter,
      singIn,
      filteredActionsI18n,
      subtotal
    }
  }
}
</script>
<style scoped></style>
