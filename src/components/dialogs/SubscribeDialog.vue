<template>
  <slot :openDialog="() => (dialogActivator = true)">
    <q-btn
      no-caps
      outline
      rounded
      class="full-width"
      :class="{ 'text-negative': !filteredListGalleriesNonDraft[action.id].payment }"
      :label="$t('graphics3D.virtualGallery')"
      @click="handlerClick"
    />
  </slot>
  <q-dialog
    v-model="dialogActivator"
    persistent
    :maximized="$q.screen.xs"
    :transition-show="$q.screen.xs ? 'slide-up' : 'fade'"
    :transition-hide="$q.screen.xs ? 'slide-down' : 'fade'"
  >
    <q-card
      style="border-radius: 25px"
      :style="action.id ? 'max-width: 1300px' : 'max-width: 1000px'"
    >
      <div class="q-mx-md bg-white" style="position: sticky; top: 0; z-index: 10">
        <q-toolbar>
          <q-toolbar-title class="text-body1" style="white-space: normal !important">
            {{ $t('subscription.enterAorta') }}
          </q-toolbar-title>
          <q-btn flat round icon="close" @click="dialogActivator = false" />
        </q-toolbar>
        <div v-if="$i18n.locale === 'en'">
          <div class="text-body2">
            Immerse yourself in a world where art surrounds you from every side. Our projects are
            not just exhibitions, but immersive stories that change the way you see the world and
            these immersive stories stay with you forever. You’re inside the gallery, even if you’re
            thousands of kilometers away. New exhibitions appear every month, so don’t miss what
            will become absolutely legendary tomorrow. The virtual gallery works only.
          </div>
        </div>
        <div v-else>
          <div class="text-body2">
            Immergiti in un mondo in cui l’arte ti circonda da ogni lato. I nostri progetti non sono
            semplici mostre, ma storie immersive che cambiano il tuo modo di vedere il mondo — e
            queste storie restano con te per sempre. Sei dentro la galleria, anche se ti trovi a
            migliaia di chilometri di distanza. Ogni mese nuove mostre prendono vita: non perdere
            ciò che domani diventerà leggendario. La galleria virtuale funziona solo su PC.
          </div>
        </div>
        <q-separator class="q-mt-md" color="negative" />
      </div>
      <q-card-section>
        <div class="row q-gutter-xl justify-center">
          <buy-access-card v-if="action.id" :action="action" />
          <div
            v-for="(subscription, key) in subscriptionsData"
            :key="subscription.price"
            class="col-11 q-pa-md column"
            :class="[
              { 'text-grey': statusActive && key === 'month' },
              action.id ? 'col-sm-3' : 'col-sm-5'
            ]"
            :style="
              key === 'month' && statusActive
                ? 'border: 2px solid #CCCCCC; border-radius: 25px'
                : 'border: 2px solid #000000; border-radius: 25px'
            "
          >
            <div class="text-center">
              <div class="text-h6">{{ $t(subscription.name) }}</div>
              <q-separator color="negative" class="q-mx-lg q-my-md" />
              <div class="text-h5">{{ subscription.price }}</div>
              <div class="text-subtitle2">/ {{ $t(subscription.interval) }}</div>
            </div>

            <div class="col-grow flex items-center q-my-md">
              <div class="q-my-sm q-mr-md text-justify">
                <div v-for="item in subscription.list" :key="item" class="row">
                  <q-icon name="check" class="col-1 items-start" />
                  <div class="col-11">{{ $t(item) }}</div>
                </div>
              </div>
            </div>
            <div class="flex flex-center" style="font-size: 0.65rem">
              <q-checkbox
                size="2rem"
                name="acceptTerms"
                v-model="acceptMap[key]"
                class="col-auto"
                :disable="key === 'month' && statusActive"
              />
              <div class="col">
                {{ $t('common.acceptHhe') }}
                <router-link to="/termsSubscription" class="text-primary">{{
                  $t('subscription.subscriptionTerms')
                }}</router-link>
                {{ $t('common.andThe') }}
                <router-link to="/privacy" class="text-primary">{{
                  $t('auth.privacyPolicy')
                }}</router-link
                >.
              </div>
            </div>
            <div class="flex flex-center" style="font-size: 0.65rem">
              <q-checkbox
                size="2rem"
                v-model="waiveMap[key]"
                name="waiveWithdrawal"
                class="col-auto"
                :disable="key === 'month' && statusActive"
              />
              <div class="col">
                {{ $t('subscription.refusalToRefundMoney') }}
              </div>
            </div>
            <q-btn
              no-caps
              outline
              rounded
              :label="statusActive ? $t(subscription.btnLabel[0]) : $t(subscription.btnLabel[1])"
              class="full-width q-mt-md"
              :disable="key === 'month' && statusActive"
              @click="submitForm({ interval: key, retrieveUpcomingChek: true })"
            />
          </div>
        </div>
      </q-card-section>
    </q-card>
  </q-dialog>
  <confirm-subscription-change-dialog
    v-model="activatorChangeDialog"
    :subscription-change-data="subscriptionChangeData"
    @subscription-change="submitForm({ interval: 'year', updateChek: true })"
  />
</template>

<script>
import { computed, ref, toRefs, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useRouter, useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useQuasar } from 'quasar'
import { useAuthStore } from 'stores/auth-store'
import { useStripeStore } from 'stores/stripe-store'
import { useUserStore } from 'stores/user-store'
import { useGraphics3DStore } from 'stores/graphics3D-store'
import { prices } from 'src/pk_live'
import { formatPaymentMethod } from 'src/composables/formatPaymentMethod'
import ConfirmSubscriptionChangeDialog from 'components/dialogs/ConfirmSubscriptionChangeDialog.vue'
import BuyAccessCard from 'components/cart/BuyAccessCard.vue'

export default {
  name: 'SubscribeDialog',
  components: {
    ConfirmSubscriptionChangeDialog,
    BuyAccessCard
  },
  props: {
    action: {
      type: Object,
      default: () => ({})
    }
  },
  setup(props) {
    const $q = useQuasar()
    const { locale, t } = useI18n({ useScope: 'global' })
    const route = useRoute()
    const router = useRouter()
    const { action } = toRefs(props)
    const authStore = useAuthStore()
    const { loggedIn } = storeToRefs(authStore)
    const { showLoginDialog } = authStore
    const stripeStore = useStripeStore()
    const { payStripe, subscriptionUpdate } = stripeStore
    const userStore = useUserStore()
    const { userData, listSubscriptions, listPayments } = storeToRefs(userStore)
    const { subscriptionsData } = userStore
    const graphics3DStore = useGraphics3DStore()
    const { filteredListGalleriesNonDraft } = storeToRefs(graphics3DStore)
    const dialogActivator = ref(false)
    const activatorChangeDialog = ref(false)
    const subscriptionChangeData = ref({})
    const acceptMap = ref({})
    const waiveMap = ref({})
    const subscription = computed(() => listSubscriptions.value['Virtual Gallery'])
    const statusActive = computed(
      () => !!(subscription.value?.interval === 'month' && subscription.value?.status === 'active')
    )

    watch(
      () => Object.keys(subscriptionsData),
      (keys) => {
        keys.forEach((key) => {
          if (!(key in acceptMap.value)) acceptMap.value[key] = false
          if (!(key in waiveMap.value)) waiveMap.value[key] = false
        })
      },
      { immediate: true }
    )
    const handlerClick = () => {
      if (!loggedIn.value) {
        showLoginDialog(true)
        return
      }
      if (filteredListGalleriesNonDraft.value[action.value.id].payment) {
        router.push(`/3d/${action.value.id}`)
      } else {
        dialogActivator.value = true
      }
    }

    const submitForm = async ({ interval, updateChek = false, retrieveUpcomingChek = false }) => {
      if (!acceptMap.value[interval] && !waiveMap.value[interval]) {
        $q.notify({
          type: 'warning',
          message: t('subscription.pleaseConfirm'),
          timeout: 2500
        })
        return
      }
      if (interval === 'year' && statusActive.value) {
        const subscriptionData = {
          customerId: subscription.value.customer,
          subscriptionId: subscription.value.id,
          itemId: subscription.value.itemId,
          price: prices[interval],
          updateChek,
          retrieveUpcomingChek
        }
        if (retrieveUpcomingChek) {
          const preview = await subscriptionUpdate(subscriptionData)
          const lines = preview.lines.data || []
          const paymentMethod =
            preview.default_payment_method ||
            preview.subscription?.default_payment_method ||
            preview.customer?.invoice_settings?.default_payment_method ||
            null
          subscriptionChangeData.value = {
            newPlan: lines.filter((l) => l.amount > 0)[0].amount || 0,
            oldPlan: lines.filter((l) => l.amount < 0)[0].amount || 0,
            total: preview.amount_due || 0,
            paymentMethod: formatPaymentMethod(paymentMethod)
          }
          activatorChangeDialog.value = true
          console.log(subscriptionChangeData.value)
        } else {
          await subscriptionUpdate(subscriptionData)
          activatorChangeDialog.value = false
          dialogActivator.value = false
        }
      } else {
        await payStripe({
          success_url: action.value.id ? `/3d/${action.value.id}` : null,
          cancel_url: route.path,
          mode: 'subscription',
          line_items: [
            {
              price: prices[interval],
              quantity: 1
            }
          ],
          metadata: {
            productName: 'Virtual Gallery',
            interval,
            userId: userData.value.userId,
            name: `${userData.value.firstName || userData.value.displayName} ${
              userData.value.lastName || ''
            }`,
            email: userData.value.email,
            locale: locale.value,
            imageUrl: subscriptionsData[interval].imageUrl
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
    }
    return {
      filteredListGalleriesNonDraft,
      subscriptionsData,
      subscription,
      statusActive,
      dialogActivator,
      activatorChangeDialog,
      subscriptionChangeData,
      acceptMap,
      waiveMap,
      listPayments,
      handlerClick,
      submitForm
    }
  }
}
</script>

<style scoped></style>
