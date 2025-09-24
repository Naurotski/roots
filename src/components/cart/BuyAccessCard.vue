<template>
  <div
    class="col-11 col-sm-3 q-pa-md column"
    style="border: 2px solid #000000; border-radius: 25px"
  >
    <div class="text-center">
      <div class="text-h6">{{ $t('subscription.exhibitionPass') }}</div>
      <q-separator color="negative" class="q-mx-lg q-my-md" />
      <div class="text-h5">€ {{ price }}</div>
      <div class="text-subtitle2">{{ locale === 'en' ? $t(action.name) : $t(action.nameIt) }}</div>
    </div>

    <div class="col-grow flex items-center q-my-md">
      <div class="q-my-sm q-mr-md text-justify">
        <div v-for="item in list" :key="item" class="row">
          <q-icon name="check" class="col-1 items-start" />
          <div class="col-11">{{ $t(item) }}</div>
        </div>
      </div>
    </div>
    <div class="flex flex-center" style="font-size: 0.65rem">
      <q-checkbox size="2rem" name="acceptTerms" v-model="acceptMap" class="col-auto" />
      <div class="col">
        {{ $t('common.acceptHhe') }}
        <router-link to="/termsSubscription" class="text-primary">{{
          $t('subscription.subscriptionTerms')
        }}</router-link>
        {{ $t('common.andThe') }}
        <router-link to="/privacy" class="text-primary">{{ $t('auth.privacyPolicy') }}</router-link
        >.
      </div>
    </div>
    <div class="flex flex-center" style="font-size: 0.65rem">
      <q-checkbox size="2rem" v-model="waiveMap" name="waiveWithdrawal" class="col-auto" />
      <div class="col">
        {{ $t('subscription.refusalToRefundMoney') }}
      </div>
    </div>
    <q-btn
      no-caps
      outline
      rounded
      label="Buy Now"
      class="full-width q-mt-md"
      @click="buyAccess()"
    />
  </div>
</template>

<script>
import { computed, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useQuasar } from 'quasar'
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'
import { useUserStore } from 'stores/user-store'
import { useStripeStore } from 'stores/stripe-store'

export default {
  name: 'BuyAccessCard',
  props: {
    action: {
      type: Object,
      required: true
    }
  },
  setup(props) {
    const list = [
      'subscription.accessList.accessScope',
      'subscription.accessList.immersive',
      'subscription.accessList.information'
    ]
    const $q = useQuasar()
    const { locale, t } = useI18n({ useScope: 'global' })
    const route = useRoute()
    const { action } = storeToRefs(props)
    const userStore = useUserStore()
    const { userData } = storeToRefs(userStore)
    const stripeStore = useStripeStore()
    const { payStripe } = stripeStore
    const acceptMap = ref(false)
    const waiveMap = ref(false)
    const price = ref(8.99)
    const description = computed(() => {
      if (locale.value === 'it') {
        return !action.value.descriptionIt
          ? 'Nessuna descrizione'
          : action.value.descriptionIt.length < 200
          ? action.value.descriptionIt
          : `${action.value.descriptionIt?.substring(0, 300)}...`
      } else {
        return !action.value.description
          ? 'No description'
          : action.value.description.length < 200
          ? action.value.description
          : `${action.value.description?.substring(0, 300)}...`
      }
    })
    const buyAccess = async () => {
      console.log('buyAccess')
      if (!acceptMap.value || !waiveMap.value) {
        $q.notify({
          type: 'warning',
          message: t('subscription.pleaseConfirm'), //??????
          timeout: 2500
        })
        return
      }
      await payStripe({
        success_url: `/3d/${action.value.id}`,
        cancel_url: route.path,
        mode: 'payment',
        line_items: [
          {
            quantity: 1,
            price_data: {
              currency: 'eur',
              unit_amount: price.value * 100,
              product_data: {
                name: locale.value === 'it' ? action.value.nameIt : action.value.name,
                description: description.value,
                images: [action.value.urlImage],
                metadata: {
                  id: action.value.id
                }
              }
            }
          }
        ],
        metadata: {
          userId: userData.value.userId,
          userName: `${userData.value.firstName || userData.value.displayName} ${
            userData.value.lastName || ''
          }`,
          email: userData.value.email,
          locale: locale.value,
          virtual: true
        },
        userData: {
          userId: userData.value.userId,
          email: userData.value.email,
          firstName: userData.value.firstName || userData.value.displayName,
          lastName: userData.value.lastName || '',
          phone: userData.value.phone || '',
          city: userData.value.city || '',
          country: userData.value.country || '',
          address: userData.value.address || '',
          postalCode: userData.value.postalCode || '',
          taxId: userData.value.taxId || ''
        }
      })
    }
    return {
      list,
      price,
      acceptMap,
      waiveMap,
      buyAccess
    }
  }
}
</script>

<style scoped></style>
