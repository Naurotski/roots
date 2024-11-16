<template>
  <div class="row justify-center q-mt-md bg-grey-2">
    <div class="col-3">
      <q-img
        :src="dataCard.urlImageWork"
        :alt="dataCard.name"
        fit="contain"
        :style="$q.screen.xs ? 'max-height: 300px' : 'height: 150px'"
      />
    </div>
    <div class="col-sm-7 col-9 q-pl-xs">
      <div :class="{ 'text-subtitle1': $q.screen.xs }" class="text-h6 text-bold">
        {{ dataCard.name }}
      </div>
      <div :class="{ 'text-body2': $q.screen.xs }" class="text-justify text-body1">
        {{ dataCard.materials }}
      </div>
      <q-btn
        no-caps
        outline
        rounded
        :label="$t('common.delete')"
        @click="deleteProductToCart(dataCard.cartIndex)"
      />
    </div>
    <div
      class="col-sm-2 col-12 flex text-h6 text-bold"
      :class="[{ column: !$q.screen.xs }, $q.screen.xs ? 'justify-end' : 'flex-center']"
    >
      <q-select v-model="quantity" :options="options" options-dense lazy-rules dense>
        <template v-slot:prepend>
          <span class="text-body2 text-bold">{{ $t('cart.qty') }}</span>
        </template>
      </q-select>
      <div :class="$q.screen.xs ? 'q-ml-md' : 'q-mt-md'">€{{ dataCard.price }}</div>
    </div>
  </div>
</template>

<script>
import { computed, ref, toRefs } from 'vue'
import { useI18n } from 'vue-i18n'
import { useStripeStore } from 'stores/stripe-store'

export default {
  name: 'ProductCard',
  props: {
    dataCard: {
      type: Object,
      require: true
    }
  },
  setup(props) {
    const { dataCard } = toRefs(props)
    const { t } = useI18n()
    const stripeStore = useStripeStore()
    const { changeQuantityProduct, deleteProductToCart } = stripeStore
    const show = ref(false)
    const options = [`0 (${t('common.delete')})`, 1, 2, 3, 4, 5, 6]
    const quantity = computed({
      get() {
        return dataCard.value.quantity
      },
      set(val) {
        if (val === `0 (${t('common.delete')})`) {
          deleteProductToCart(dataCard.value.cartIndex)
        } else {
          changeQuantityProduct({ quantity: val, index: dataCard.value.cartIndex })
        }
      }
    })
    return {
      show,
      options,
      quantity,
      deleteProductToCart
    }
  }
}
</script>

<style scoped>
.custom-dropdown {
  max-height: 100px !important;
  overflow-y: auto; /* Добавление прокрутки, если элементов больше */
}
</style>
