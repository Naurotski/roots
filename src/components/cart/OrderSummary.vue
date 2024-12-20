<template>
  <div class="col-12 col-md-3 q-pt-md" :class="{ 'q-pl-md': $q.screen.gt.sm }">
    <div class="bg-grey-2 full-width q-pa-md">
      <div class="text-h5 q-mb-md">{{ $t('cart.orderSummary') }}</div>
      <div class="row justify-between">
        <span class="text-body1"
          >{{ $t('cart.subtotal') }} {{ `(${cartCounter} ${$t('cart.items')})` }}</span
        >
        <span class="text-body1" v-text="`€${subtotal}`" />
      </div>
      <div v-if="!deliveryDetails.address">
        {{ $t('cart.thisPriceIsNotFinal') }}
      </div>
      <div v-else>
        <div class="row justify-between">
          <span class="text-body1">{{ $t('cart.shipping') }}</span>
          <span class="text-body1">€5</span>
        </div>
        <div class="text-body1 q-mt-md">
          {{ $t('cart.DeliveringTo') }} {{ deliveryDetails.firstName }}
          {{ deliveryDetails.lastName }}
        </div>
        <div class="text-body2">{{ deliveryAddress }}</div>
        <div class="text-body2">Phone number:{{ deliveryDetails.phone }}</div>
      </div>
      <delivery-details-dialog v-model="deliveryDetails" @savaDelivery="getSippingCost" />
      <q-separator class="q-my-md" />
      <div class="row justify-between">
        <span class="text-h6 text-bold">Total</span>
        <span class="text-h5 text-bold">€12</span>
      </div>

      <!--      <div class="text-center">-->
      <!--        <q-btn-->
      <!--          :size="$q.screen.xs ? 'sm' : 'md'"-->
      <!--          no-caps-->
      <!--          outline-->
      <!--          rounded-->
      <!--          :label="`${$t('cart.proceedCheckout')} (${cartCounter} ${$t('cart.items')})`"-->
      <!--          @click="showDialog"-->
      <!--        />-->
      <!--      </div>-->
    </div>
  </div>
  <pre>deliveryDetails - {{ deliveryDetails }}</pre>
</template>

<script>
import { computed, toRefs, watch, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useAuthStore } from 'stores/auth-store'
import { useUserStore } from 'stores/user-store'
import { useStripeStore } from 'stores/stripe-store'
import DeliveryDetailsDialog from 'components/dialogs/DeliveryDetailsDialog.vue'

export default {
  name: 'OrderSummary',
  components: { DeliveryDetailsDialog },
  props: {
    cart: {
      type: Object,
      required: true
    },
    cartCounter: {
      type: Number,
      required: true
    }
  },
  setup(props) {
    const { cart } = toRefs(props)
    const authStore = useAuthStore()
    const { loggedIn } = toRefs(authStore)
    const userStore = useUserStore()
    const { userData } = storeToRefs(userStore)
    const { updateUser } = userStore
    const stripeStore = useStripeStore()
    const { shippingDetails } = toRefs(stripeStore)
    const { changeShippingDetails } = stripeStore
    const deliveryDetails = ref({})
    const deliveryAddress = computed(() => {
      if (deliveryDetails.value.state) {
        return `${deliveryDetails.value.address} ${deliveryDetails.value.city} ${deliveryDetails.value.postalCode} ${deliveryDetails.value.state.name} ${deliveryDetails.value.country?.countryName}`
      } else if (deliveryDetails.value.country?.countryName === 'Italy') {
        return `${deliveryDetails.value.address} ${deliveryDetails.value.city} ${deliveryDetails.value.postalCode} ${deliveryDetails.value.country?.countryName} taxId: ${deliveryDetails.value.taxId}}`
      } else {
        return `${deliveryDetails.value.address} ${deliveryDetails.value.city} ${deliveryDetails.value.postalCode} ${deliveryDetails.value.country?.countryName} `
      }
    })
    const subtotal = computed(() =>
      Object.values(cart.value).reduce(
        (result, item) =>
          result + +item.quantityCart * (item.variants ? item.variants[0].price : item.price),
        0
      )
    )
    watch(
      userData,
      (val) => {
        console.log('watch - userData -----', val)
        console.log('watch - shippingDetails.value -----', shippingDetails.value)
        console.log('watch - deliveryDetails.value -----', deliveryDetails.value)
        if (Object.keys(shippingDetails.value).length) {
          deliveryDetails.value = { ...shippingDetails.value }
        }
        if (!loggedIn.value) {
          console.log('watch - !loggedIn.value -----')
          deliveryDetails.value = {}
          changeShippingDetails({})
        } else {
          console.log('watch - userData2222 -----', val)
          console.log('watch - shippingDetails.value2222 -----', shippingDetails.value)
          console.log('watch - deliveryDetails.value222 -----', deliveryDetails.value)
          deliveryDetails.value.firstName ||= val.firstName || val.displayName || ''
          deliveryDetails.value.lastName ||= val.lastName || ''
          deliveryDetails.value.email ||= val.email || ''
          deliveryDetails.value.address ||= val.address || ''
          deliveryDetails.value.city ||= val.city || ''
          deliveryDetails.value.country ||= val.country || null
          deliveryDetails.value.state ||= val.state || null
          deliveryDetails.value.postalCode ||= val.postalCode || ''
          deliveryDetails.value.phone ||= val.phone || ''
          deliveryDetails.value.taxId ||= val.taxId || null
        }
      },
      { immediate: true, deep: true }
    )

    const getSippingCost = async () => {
      console.log('getSippingCost--', deliveryDetails.value)
      const diffObj = Object.keys(deliveryDetails.value).reduce((result, key) => {
        if (!(key in userData.value)) result[key] = deliveryDetails.value[key]
        return result
      }, {})
      if (Object.keys(diffObj).length) {
        await updateUser({
          path: `users/${userData.value.userId}/userData`,
          payload: diffObj
        })
      }
      changeShippingDetails(deliveryDetails.value)
    }
    return {
      loggedIn,
      deliveryDetails,
      deliveryAddress,
      subtotal,
      getSippingCost
    }
  }
}
</script>

<style scoped></style>
