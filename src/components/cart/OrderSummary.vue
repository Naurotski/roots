<template>
  <div class="col-12 col-md-3 q-pt-md" :class="{ 'q-pl-md': $q.screen.gt.sm }">
    <div class="bg-grey-2 full-width q-pa-md">
      <div class="text-h5 q-mb-md">{{ $t('cart.orderSummary') }}</div>
      <div class="row justify-between q-mb-sm">
        <span class="text-body1"
          >{{ $t('cart.subtotal') }} {{ `(${cartCounter} ${$t('cart.items')})` }}</span
        >
        <span class="text-body1" v-text="`€${subtotal}`" />
      </div>
      <div v-if="!deliveryDetails.country">
        {{ $t('cart.thisPriceIsNotFinal') }}
      </div>
      <div v-else>
        <div class="row justify-between">
          <span v-if="selectedShippingRate" class="text-body1">{{ $t('cart.shipping') }}</span>
          <span v-if="selectedShippingRate" class="text-body1"
            >€{{ selectedShippingRate.rate }}</span
          >
        </div>
        <div class="text-body1 q-mt-md">
          {{ $t('cart.deliveringTo') }} {{ deliveryDetails.firstName }}
          {{ deliveryDetails.lastName }}
        </div>
        <div class="text-body2">{{ deliveryAddress }}</div>
        <div class="text-body2">Phone number:{{ deliveryDetails.phone }}</div>
      </div>
      <delivery-details-dialog v-model="deliveryDetails" @savaDelivery="saveSippingDetails" />
      <div v-if="shippingRates.length && !shippingRates[0].errorMessage" class="q-my-sm">
        <q-radio
          v-for="rate in shippingRates"
          :key="rate.id"
          v-model="selectedShippingRate"
          :val="rate"
          checked-icon="task_alt"
          unchecked-icon="panorama_fish_eye"
          :label="rate.name"
        />
      </div>
      <div v-if="shippingRates?.[0]?.errorMessage" class="q-mt-sm text-body2" style="color: red">
        {{ shippingRates[0].errorMessage }}
      </div>
      <q-separator class="q-my-md" />
      <div v-if="selectedShippingRate" class="row justify-between">
        <span class="text-h6 text-bold">{{ $t('cart.total') }}</span>
        <span class="text-h5 text-bold"
          >€{{ (subtotal + +selectedShippingRate?.rate).toFixed(2) }}</span
        >
      </div>

      <div class="text-center q-mt-md">
        <q-btn
          no-caps
          outline
          rounded
          :label="`${$t('cart.proceedCheckout')} (${cartCounter} ${$t('cart.items')})`"
          :disable="!selectedShippingRate"
          @click="createOrder"
        />
      </div>
    </div>
    <login-required-dialog
      v-if="deliveryDetails.email"
      v-model="requiredDialog"
      :auth-provider="authProvider"
      :email="deliveryDetails.email"
    />
  </div>
</template>

<script>
import { computed, toRefs, watch, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useI18n } from 'vue-i18n'
import { useAuthStore } from 'stores/auth-store'
import { useUserStore } from 'stores/user-store'
import { useStripeStore } from 'stores/stripe-store'
import { useMerchStore } from 'stores/merch-store'
import DeliveryDetailsDialog from 'components/dialogs/DeliveryDetailsDialog.vue'
import LoginRequiredDialog from 'components/auth/LoginRequiredDialog.vue'

export default {
  name: 'OrderSummary',
  components: { LoginRequiredDialog, DeliveryDetailsDialog },
  props: {
    modelValue: {
      type: Object,
      default: () => null
    },
    cart: {
      type: Object,
      required: true
    },
    cartCounter: {
      type: Number,
      required: true
    }
  },
  emits: ['update:modelValue', 'orderCreated'],
  setup(props, { emit }) {
    const { locale } = useI18n({ useScope: 'global' })
    const { modelValue, cart } = toRefs(props)
    const authStore = useAuthStore()
    const { loggedIn } = toRefs(authStore)
    const { checkUserExistence } = authStore
    const userStore = useUserStore()
    const { userData } = storeToRefs(userStore)
    const { updateUser } = userStore
    const stripeStore = useStripeStore()
    const { shippingDetails } = toRefs(stripeStore)
    const { changeShippingDetails } = stripeStore
    const merchStore = useMerchStore()
    const { shippingRates } = storeToRefs(merchStore)
    const { updateShippingRates, printFul } = merchStore
    const deliveryDetails = ref({})
    const selectedShippingRate = computed({
      get() {
        return modelValue.value
      },
      set(val) {
        emit('update:modelValue', val)
      }
    })
    const recipient = ref({})
    const requiredDialog = ref(false)
    const authProvider = ref([])

    const deliveryAddress = computed(() => {
      if (deliveryDetails.value.state) {
        return `${deliveryDetails.value.address} ${deliveryDetails.value.city} ${deliveryDetails.value.postalCode} ${deliveryDetails.value.state.name} ${deliveryDetails.value.country?.countryName}`
      } else if (deliveryDetails.value.country?.countryName === 'Italy') {
        return `${deliveryDetails.value.address} ${deliveryDetails.value.city} ${deliveryDetails.value.postalCode} ${deliveryDetails.value.country?.countryName} taxId: ${deliveryDetails.value.taxId}`
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
        if (Object.keys(shippingDetails.value).length) {
          deliveryDetails.value = { ...shippingDetails.value }
        }
        if (!loggedIn.value && !Object.keys(shippingDetails.value).length) {
          deliveryDetails.value = {}
          changeShippingDetails({})
        } else {
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
          changeShippingDetails(deliveryDetails.value)
        }
      },
      { immediate: true, deep: true }
    )
    const getSippingRates = () => {
      if (deliveryDetails.value.country && Object.keys(cart.value).length) {
        recipient.value = {
          address1: deliveryDetails.value.address,
          city: deliveryDetails.value.city,
          country_code: deliveryDetails.value.country.cca2,
          state_code: deliveryDetails.value.state?.code,
          zip: deliveryDetails.value.postalCode,
          phone: deliveryDetails.value.phone
        }
        const details = {
          recipient: recipient.value,
          items: Object.values(cart.value).map((item) => ({
            variant_id: item.variants[0].variant_id,
            quantity: item.quantityCart
          })),
          currency: 'EUR',
          locale: locale.value === 'it' ? 'it_IT' : 'en_US'
        }
        printFul('/shipping/rates', details)
          .then(() => emit('update:modelValue', shippingRates.value[0]))
          .catch(() => emit('update:modelValue', null))
      } else {
        updateShippingRates([])
      }
    }

    watch([cart, locale], () => getSippingRates(), { immediate: true, deep: true })

    const saveSippingDetails = async () => {
      changeShippingDetails(deliveryDetails.value)
      getSippingRates()
    }
    const createOrder = async () => {
      if (!loggedIn.value) {
        authProvider.value = await checkUserExistence(deliveryDetails.value.email)
        requiredDialog.value = true
      } else {
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
        await printFul('/orders', {
          recipient: {
            ...recipient.value,
            name: `${deliveryDetails.value.firstName} ${deliveryDetails.value.lastName}`
          },
          items: Object.values(cart.value).map((item) => ({
            sync_variant_id: item.variants[0].variantId,
            quantity: item.quantityCart
          })),
          currency: 'EUR',
          shipping: selectedShippingRate.value.id
        }).then((orderId) => emit('orderCreated', orderId))
      }
    }
    return {
      loggedIn,
      deliveryDetails,
      deliveryAddress,
      subtotal,
      shippingRates,
      selectedShippingRate,
      requiredDialog,
      authProvider,
      saveSippingDetails,
      createOrder,
      shippingDetails
    }
  }
}
</script>

<style scoped></style>
