<template>
  <div class="row justify-center q-mt-md bg-grey-2">
    <router-link
      style="text-decoration: none"
      class="col-3 flex flex-center"
      :to="`/merch/${dataCard.rubric}/${dataCard.id.split('_')[0]}`"
    >
      <q-img
        :src="dataCard.urlImageWork"
        :alt="dataCard.name"
        fit="contain"
        :style="$q.screen.xs ? 'max-height: 150px' : 'height: 150px'"
      />
    </router-link>
    <div class="col-sm-7 col-9 q-pl-xs column items-start justify-between">
      <div :class="{ 'text-subtitle1': $q.screen.xs }" class="text-h6 text-bold">
        {{ dataCard.name }}
      </div>
      <div :class="{ 'text-body2': $q.screen.xs }" class="text-justify text-body1">
        <description-for-card
          :item-description="dataCard.description"
          :number="$q.screen.xs ? 100 : 250"
        />
      </div>

      <div v-if="dataCard.variants" class="row q-my-xs">
        <div class="text-bold text-body2" v-text="$t('merch.colour')" />
        <div
          class="border-black q-ml-xs border"
          style="width: 20px; height: 20px"
          :style="{ backgroundColor: colorMappingPrintFul[dataCard.variants[0].color] }"
        />
      </div>
      <div v-if="dataCard.variants">
        <span class="text-bold text-body2">{{ $t('merch.size') }}: </span
        ><span>{{ dataCard.variants[0].size }}</span>
      </div>

      <div class="gt-xs">
        <q-btn no-caps flat :label="$t('common.delete')" @click="deleteProduct"></q-btn>
        <hr style="margin-top: -1px" />
      </div>
    </div>
    <div
      class="col-sm-2 col-12 flex text-h6 text-bold"
      :class="[{ column: !$q.screen.xs }, $q.screen.xs ? 'justify-end' : 'flex-center']"
    >
      <div class="q-mr-md lt-sm" style="border-bottom: 1px solid #b0b0b0">
        <q-btn
          flat
          no-caps
          :label="$t('common.delete')"
          style="padding-left: -3px"
          @click="deleteProduct"
        />
      </div>
      <q-select v-model="quantityCart" :options="options" options-dense lazy-rules dense virtual>
        <template v-slot:prepend>
          <span class="text-body2 text-bold">{{ $t('cart.qty') }}</span>
        </template>
      </q-select>
      <div :class="$q.screen.xs ? 'q-ml-md q-mr-sm' : 'q-mt-md'">
        €{{ dataCard.variants?.[0].price || dataCard.price }}
      </div>
    </div>
  </div>
</template>

<script>
import { computed, toRefs, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { storeToRefs } from 'pinia'
import { useAuthStore } from 'stores/auth-store'
import { useStripeStore } from 'stores/stripe-store'
import { useMerchStore } from 'stores/merch-store'
import DescriptionForCard from 'components/shared/DescriptionForCard.vue'

export default {
  name: 'ProductCard',
  components: {
    DescriptionForCard
  },
  props: {
    dataCard: {
      type: Object,
      require: true
    }
  },
  setup(props) {
    const { dataCard } = toRefs(props)
    const { t } = useI18n()
    const authStore = useAuthStore()
    const { loggedIn } = storeToRefs(authStore)
    const stripeStore = useStripeStore()
    const { addProductToCart, updateCart } = stripeStore
    const merchStore = useMerchStore()
    const { merchList, colorMappingPrintFul } = storeToRefs(merchStore)
    const { listenForChildMerch, checkExistenceMerch } = merchStore
    if (!merchList.value[dataCard.value.rubric]) listenForChildMerch(dataCard.value.rubric)

    setTimeout(() => {
      if (!merchList.value[dataCard.value.rubric]?.[dataCard.value.id.split('_')[0]]) {
        checkExistenceMerch(
          `merch/${dataCard.value.rubric}/${dataCard.value.id.split('_')[0]}`
        ).then((result) => {
          if (!result) deleteProduct()
        })
      }
    }, 1000)
    const options = computed(() => [
      `0 (${t('common.delete')})`,
      ...Array.from(
        {
          length:
            merchList.value[dataCard.value.rubric]?.[dataCard.value.id.split('_')[0]]?.quantity
        },
        (_, index) => index + 1
      )
    ])
    const quantityCart = computed({
      get() {
        return dataCard.value.quantityCart
      },
      set(val) {
        updateQuantityCart(val)
      }
    })
    watch(
      () => merchList.value[dataCard.value.rubric]?.[dataCard.value.id.split('_')[0]],
      (val) => {
        if (val) {
          if (val.notForSale) {
            deleteProduct()
          } else if (val.quantity < dataCard.value.quantityCart) {
            updateQuantityCart(val.quantity)
          }
        }
      },
      { immediate: true, deep: true }
    )

    function updateQuantityCart(val) {
      if (val === `0 (${t('common.delete')})` || val <= 0) {
        deleteProduct()
      } else {
        if (loggedIn.value) {
          addProductToCart({ ...dataCard.value, quantityCart: val, change: true })
        } else {
          updateCart({
            key: dataCard.value.id,
            value: { ...dataCard.value, quantityCart: val, change: true }
          })
        }
      }
    }

    function deleteProduct() {
      if (loggedIn.value) {
        addProductToCart({ ...dataCard.value, delete: true })
      } else {
        updateCart({ key: dataCard.value.id, value: 'delete' })
      }
    }
    return {
      options,
      quantityCart,
      colorMappingPrintFul,
      deleteProduct
    }
  }
}
</script>

<style scoped />
