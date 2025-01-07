<template>
  <div class="q-my-md" style="border-top: 1px solid #000000; border-bottom: 1px solid #000000">
    <div>
      <q-expansion-item class="bg-grey-2" expand-separator>
        <template v-slot:header>
          <q-item-section v-if="statusOrder && !order.statusOrder" avatar>
            <q-btn
              no-caps
              outline
              rounded
              size="sm"
              icon="fa-solid fa-repeat"
              @click.stop="getStatusOrder"
            />
          </q-item-section>
          <q-item-section v-if="statusOrder">
            <q-item-label>{{ $t('merch.status') }}</q-item-label>
            <q-item-label caption class="text-justify"
              >{{ $t(statusOrder) }}
              <div class="inline-block" v-if="order.shipment">
                <span v-if="order.reason"> - {{ order.reason }}</span>
                <span v-else>{{ order.shipment.ship_date }}</span>
              </div></q-item-label
            >
          </q-item-section>
          <q-item-section v-else>
            {{ $t('merch.personalDeliveryConditions') }}
          </q-item-section>
        </template>
        <div class="bg-grey-2 text-body1" :class="{ 'row justify-around': !$q.screen.xs }">
          <div :class="{ 'row justify-between': $q.screen.xs }">
            <div v-text="$t('merch.orderPlaced')" />
            <div class="text-bold" v-text="order.date" />
          </div>
          <div :class="{ 'row justify-between': $q.screen.xs }">
            <div v-text="$t('merch.order')" />
            <div class="text-bold" :class="{ 'text-body2': $q.screen.xs }">{{ order.id }}</div>
          </div>
          <div :class="{ 'row justify-between': $q.screen.xs }">
            <div v-text="$t('cart.total')" />
            <div class="text-bold">€{{ order.amount_total / 100 }}</div>
          </div>
          <div :class="{ 'row justify-between': $q.screen.xs }">
            <div v-text="$t('cart.deliveringTo')" />
            <div class="text-body2 text-bold">
              <div>{{ order.shippingDetails.firstName }} {{ order.shippingDetails.lastName }}</div>
              <div>{{ order.shippingDetails.address }}</div>
              <div>{{ order.shippingDetails.city }}, {{ order.shippingDetails.postalCode }}</div>
              {{ order.shippingDetails.country }}
            </div>
          </div>
          <div v-if="order.shipment">
            <div class="row justify-between">
              <div>{{ $t('merch.carrier') }}</div>
              <div class="text-bold">{{ order.shipment.carrier }}</div>
            </div>
            <div class="row justify-between">
              <div>Tracking number:</div>
              <div class="text-bold" :class="{ 'text-body2': $q.screen.xs }">
                {{ order.shipment.tracking_number }}
              </div>
            </div>
            <div class="row justify-between">
              <div>Tracking url:</div>
              <a
                :href="order.shipment.tracking_url"
                target="_blank"
                class="text-bold"
                :class="{ 'text-body2': $q.screen.xs }"
                style="color: black"
                >{{ order.shipment.tracking_url }}</a
              >
            </div>
          </div>
        </div>
      </q-expansion-item>
    </div>

    <order-card-item class="row q-my-xs" v-for="item in order.items" :key="item.id" :item="item" />
  </div>
</template>

<script>
import { toRefs, ref, watch } from 'vue'
import { useMerchStore } from 'stores/merch-store'
import OrderCardItem from 'components/user/OrderCardItem.vue'

export default {
  name: 'OrderCard',
  components: { OrderCardItem },
  props: {
    order: {
      type: Object,
      required: true
    }
  },
  setup(props) {
    const { order } = toRefs(props)
    const merchStore = useMerchStore()
    const { listStatusOrderPrintFul, printFul } = merchStore
    const statusOrder = ref('')
    watch(
      () => order.value.statusOrder,
      (val) => {
        if (val) getStatusOrder()
      }
    )
    const getStatusOrder = () => {
      console.log('getStatusOrder ---', order.value.statusOrder)
      console.log('getStatusOrder ---', order.value.printFulOrderId)
      if (order.value.printFulOrderId) {
        if (order.value.statusOrder) {
          statusOrder.value = listStatusOrderPrintFul[order.value.statusOrder]
        } else {
          printFul(`/orders/${order.value.printFulOrderId}`).then(
            (result) => (statusOrder.value = listStatusOrderPrintFul[result?.status])
          )
        }
      }
    }
    getStatusOrder()
    return {
      statusOrder,
      getStatusOrder
    }
  }
}
</script>

<style scoped></style>
