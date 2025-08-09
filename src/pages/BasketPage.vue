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
              @click="
                () =>
                  selectedShippingRate
                    ? orderSummary.createOrder()
                    : toggleDeliveryDetailsDialogActivator()
              "
            />
          </div>
        </template>
      </fixed-top-title>

      <div v-if="!cartCounter">
        <div class="text-center text-h5 q-mb-md">{{ $t('cart.cartEmpty') }}</div>
        <div v-if="!loggedIn" class="text-center text-body1 q-mb-md">
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
      <div v-else class="row">
        <div class="col-12 col-md-9">
          <product-card v-for="work in filteredActionsI18n" :key="work.id" :data-card="work" />
          <q-separator class="q-mt-md" />
          <div class="row justify-end">
            <div class="col-10 col-sm-3 text-bold text-subtitle1 text-center">
              {{ $t('cart.subtotal') }} ({{ cartCounter }} {{ $t('cart.items') }})
            </div>
            <div class="col-2 text-bold text-h6 text-center">€{{ subtotal }}</div>
          </div>
        </div>
        <order-summary
          ref="orderSummary"
          v-model="selectedShippingRate"
          :cart="cart"
          :cart-counter="cartCounter"
          @order-created="payOrder"
        />
      </div>
    </q-page>
  </transition>
</template>

<script>
import { computed, ref } from 'vue'
import { useMeta } from 'quasar'
import { useRoute } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useI18n } from 'vue-i18n'
import { useAuthStore } from 'stores/auth-store'
import { useStripeStore } from 'stores/stripe-store'
import { useUserStore } from 'stores/user-store'
import { useSharedStore } from 'stores/shared-store'
import FixedTopTitle from 'components/shared/Titles/FixedTopTitle.vue'
import ProductCard from 'components/cart/ProductCard.vue'
import OrderSummary from 'components/cart/OrderSummary.vue'
import { createLineItems } from 'src/composables/create_line_items'

export default {
  name: 'BasketPage',
  components: {
    FixedTopTitle,
    ProductCard,
    OrderSummary
  },
  setup() {
    const route = useRoute()
    const { locale } = useI18n({ useScope: 'global' })
    const authStore = useAuthStore()
    const { loggedIn, loginDialog } = storeToRefs(authStore)
    const { showLoginDialog } = authStore
    const stripeStore = useStripeStore()
    const { cart, cartCounter, shippingDetails } = storeToRefs(stripeStore)
    const { payStripe } = stripeStore
    const userStore = useUserStore()
    const { userData } = storeToRefs(userStore)
    const sharedStore = useSharedStore()
    const { toggleDeliveryDetailsDialogActivator } = sharedStore
    const orderSummary = ref()
    const selectedShippingRate = ref(null)
    const filteredActionsI18n = computed(() => {
      if (locale.value === 'it') {
        return Object.values(cart.value).map((item) => ({
          ...item,
          description: item.descriptionIt,
          materials: item.materialsIt,
          name: item.nameIt
        }))
      } else {
        return Object.values(cart.value)
      }
    })
    const subtotal = computed(() =>
      Object.values(cart.value).reduce(
        (result, item) =>
          result + +item.quantityCart * (item.variants ? item.variants[0].price : item.price),
        0
      )
    )
    const line_items = computed(() => {
      if (selectedShippingRate.value) {
        return (
          createLineItems([
            ...Object.values(cart.value),
            {
              id: 'shipping',
              quantity: 1,
              rate: selectedShippingRate.value.rate,
              name: 'Shipping',
              nameIt: 'Spedizione',
              description: selectedShippingRate.value.name,
              descriptionIt: selectedShippingRate.value.name
            }
          ]) || []
        )
      } else {
        return []
      }
    })
    const singIn = () => {
      if (!loginDialog.value && !loggedIn.value) {
        showLoginDialog(true)
      }
    }
    const payOrder = async (printFulOrderId) => {
      await payStripe({
        cancel_url: route.path,
        line_items: line_items.value,
        mode: 'payment',
        metadata: {
          ...shippingDetails.value,
          country: shippingDetails.value.country.countryName,
          shippingEmail: shippingDetails.value.email,
          printFulOrderId
        },
        userData: {
          userId: userData.value.userId,
          email: userData.value.email,
          firstName: userData.value.firstName,
          lastName: userData.value.lastName,
          phone: userData.value.phone,
          city: userData.value.city,
          country: userData.value.country,
          address: userData.value.address,
          postalCode: userData.value.postalCode,
          taxId: userData.value.taxId || null
        }
      })
    }
    useMeta(() => {
      return {
        title: 'Aorta Social Art Gallery',
        titleTemplate: (title) => `${title} | Cart`,
        meta: {
          robots: {
            name: 'robots',
            content: 'noindex, nofollow'
          }
        },
        link: {
          canonical: {
            rel: 'canonical',
            href: 'https://aortagallery.com/basket'
          }
        }
      }
    })
    return {
      loggedIn,
      cart,
      cartCounter,
      selectedShippingRate,
      filteredActionsI18n,
      subtotal,
      orderSummary,
      singIn,
      payOrder,
      toggleDeliveryDetailsDialogActivator,
      line_items,
      shippingDetails
    }
  }
}
</script>
<style scoped></style>
