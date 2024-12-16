<template>
  <q-btn
    no-caps
    outline
    rounded
    style="width: 150px"
    :class="{ 'full-width q-mt-xs': $q.screen.xs, 'q-ml-md': !$q.screen.xs }"
    :label="
      cartKey && cart[cartKey].quantityCart >= merch.quantity
        ? $t('cart.seeCart')
        : !merch.variants || merch.variants.length === 1
        ? $t('cart.addCart')
        : $t('merch.seeOptions')
    "
    @click="
      cartKey && cart[cartKey].quantityCart >= merch.quantity
        ? $router.push('/basket')
        : !merch.variants || merch.variants.length === 1
        ? $emit('eventHandling', merch)
        : $router.push(`/merch/${merch.rubric}/${merch.id}`)
    "
  />
</template>

<script>
import { computed, toRefs } from 'vue'
import { storeToRefs } from 'pinia'
import { useStripeStore } from 'stores/stripe-store'

export default {
  name: 'ButtonPerMerchList',
  props: {
    merch: {
      type: Object,
      required: true
    }
  },
  emits: ['eventHandling'],
  setup(props) {
    const { merch } = toRefs(props)
    const stripeStore = useStripeStore()
    const { cart } = storeToRefs(stripeStore)
    const cartKey = computed(() =>
      Object.keys(cart.value).find((item) => item.split('_')[0] === merch.value.id)
    )
    return {
      cartKey,
      cart
    }
  }
}
</script>
<style scoped></style>
