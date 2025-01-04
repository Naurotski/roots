<template>
  <div
    class="q-my-md"
    style="border-top: 1px solid #000000; border-bottom: 1px solid #000000"
    v-for="order in orders"
    :key="order.id"
  >
    <div class="bg-grey-2 row justify-around text-body1">
      <div>
        <div v-text="$t('merch.orderPlaced')" />
        <div v-text="order.date" />
      </div>
      <div>
        <div v-text="$t('cart.total')" />
        <div>€{{ order.amount_total / 100 }}</div>
      </div>
      <div>
        <div v-text="$t('cart.deliveringTo')" />
        <div>
          <q-btn-dropdown
            auto-close
            no-caps
            stretch
            flat
            :label="`${order.shippingDetails.firstName} ${order.shippingDetails.lastName}`"
            ><q-card-section style="position: relative !important">
              <div>{{ order.shippingDetails.address }}</div>
              <div>{{ order.shippingDetails.city }}, {{ order.shippingDetails.postalCode }}</div>
              {{ order.shippingDetails.country }}</q-card-section
            >
          </q-btn-dropdown>
        </div>
      </div>
      <div>{{ $t('merch.order') }}: {{ order.id }}</div>
    </div>
    <order-card-item class="row q-my-xs" v-for="item in order.items" :key="item.id" :item="item" />
  </div>
  <pre>statusOrderPrintFul = {{ statusOrderPrintFul }}</pre>
</template>

<script>
import { useMerchStore } from 'stores/merch-store'
import OrderCardItem from 'components/user/OrderCardItem.vue'

export default {
  name: 'OrderCard',
  components: { OrderCardItem },
  props: {
    orders: {
      type: Array,
      required: true
    }
  },
  setup() {
    const merchStore = useMerchStore()
    const { statusOrderPrintFul } = merchStore
    return {
      statusOrderPrintFul
    }
  }
}
</script>

<style scoped></style>
