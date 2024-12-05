<template>
  <div class="row justify-center q-mt-md bg-grey-2">
    <router-link
      style="text-decoration: none"
      class="col-3 flex flex-center"
      :to="
        String(dataCard.id).includes('-')
          ? `/merch/${dataCard.rubric}/${dataCard.id}`
          : `/work/${dataCard.id}`
      "
    >
      <div v-if="dataCard.urlImageWork?.includes('video')">
        <div class="gt-xs" style="position: relative">
          <q-video
            :style="$q.screen.xs ? 'max-height: 150px' : 'height: 150px'"
            :src="dataCard.urlImageWork"
          />
          <div
            style="position: absolute; top: 5px; height: 100%; width: 100%; opacity: 0.1"
            class="bg-grey-2"
          />
        </div>
        <div>
          <q-icon class="lt-sm q-mt-md" name="fa-solid fa-photo-film" size="70px" color="dark" />
        </div>
      </div>
      <q-img
        v-else
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
        {{ dataCard.materials || dataCard.description }}
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
      <div :class="$q.screen.xs ? 'q-ml-md q-mr-sm' : 'q-mt-md'">€{{ dataCard.price }}</div>
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
import { useArtistsStore } from 'stores/artists-store'

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
    const authStore = useAuthStore()
    const { loggedIn } = storeToRefs(authStore)
    const stripeStore = useStripeStore()
    const { addProductToCart, updateCart } = stripeStore
    const merchStore = useMerchStore()
    const { merchList } = storeToRefs(merchStore)
    const { listenForChildMerch, checkExistenceMerch } = merchStore
    if (!merchList.value[dataCard.value.rubric]) listenForChildMerch(dataCard.value.rubric)
    const artistsStore = useArtistsStore()
    const { allWorks } = storeToRefs(artistsStore)
    const { getArtists } = artistsStore
    if (!allWorks.value.length) getArtists()
    setTimeout(() => {
      if (
        String(dataCard.value.id).includes('-') &&
        !merchList.value[dataCard.value.rubric]?.[dataCard.value.id]
      ) {
        checkExistenceMerch(`merch/${dataCard.value.rubric}/${dataCard.value.id}`).then(
          (result) => {
            if (!result) deleteProduct()
          }
        )
      }
    }, 1000)
    const options = computed(() => {
      if (!String(dataCard.value.id).includes('-')) {
        return [`0 (${t('common.delete')})`, 1]
      } else {
        return [
          `0 (${t('common.delete')})`,
          ...Array.from(
            { length: merchList.value[dataCard.value.rubric]?.[dataCard.value.id]?.quantity },
            (_, index) => index + 1
          )
        ]
      }
    })
    const quantityCart = computed({
      get() {
        return dataCard.value.quantityCart
      },
      set(val) {
        updateQuantityCart(val)
      }
    })
    watch(
      () => merchList.value[dataCard.value.rubric]?.[dataCard.value.id],
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
    watch(
      allWorks,
      (val) => {
        let localWork = val.find((item) => item.id === dataCard.value.id)
        if (!String(dataCard.value.id).includes('-') && val.length && !localWork?.price) {
          deleteProduct()
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
      deleteProduct
    }
  }
}
</script>

<style scoped />
