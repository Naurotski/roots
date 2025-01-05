<template>
  <div v-if="!orders.length">
    <div class="text-center text-h5 q-mb-md">{{ $t('merch.youHaveNoOrders') }}</div>
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
    </div>
  </div>
  <order-card v-else v-for="order in orders" :key="order.id" :order="order" />
  <pre>listRubrics = {{ listRubrics }}</pre>
  <pre>orders = {{ orders }}</pre>
</template>

<script>
import { computed, watch } from 'vue'
import { date } from 'quasar'
import { storeToRefs } from 'pinia'
import { useI18n } from 'vue-i18n'
import { useUserStore } from 'stores/user-store'
import OrderCard from 'components/user/OrderCard.vue'
import { useMerchStore } from 'stores/merch-store'
export default {
  name: 'UserOrders',
  components: { OrderCard },
  setup() {
    const { locale } = useI18n({ useScope: 'global' })
    const userStore = useUserStore()
    const { listOrders } = storeToRefs(userStore)
    const merchStore = useMerchStore()
    const { merchList } = storeToRefs(merchStore)
    const { listenForChildMerch } = merchStore
    const orders = computed(() => {
      return Object.values(listOrders.value)
        .sort((a, b) => {
          if (a.date < b.date) return 1
          if (a.date === b.date) return 0
          if (a.date > b.date) return -1
        })
        .map((item) => ({
          ...item,
          date: date.formatDate(item.date, 'DD/MM/YYYY'),
          items: Object.entries(item.items).map(([key, value]) => {
            return {
              ...value,
              id: key,
              name: locale.value === 'it' ? value.nameIt : value.name,
              description: locale.value === 'it' ? value.descriptionIt : value.description,
              materials: key.includes('-')
                ? null
                : locale.value === 'it'
                ? value.materialsIt
                : value.materials
            }
          })
        }))
    })
    const listRubrics = computed(() => {
      return [...new Set(orders.value.map((order) => order.items.map((el) => el.rubric)).flat())]
    })
    watch(listRubrics, (val) => {
      val.forEach((item) => {
        if (!merchList.value[item]) listenForChildMerch(item)
      })
    })

    // options.value = sortedCountries.value.filter(
    //   (item) => item.countryName.toLowerCase().indexOf(needle) > -1
    // )
    return {
      orders,
      listRubrics
    }
  }
}
</script>
<style scoped></style>
