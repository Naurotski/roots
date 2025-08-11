<template>
  <slot :openDialog="() => (dialogActivator = true)">
    <q-btn
      no-caps
      outline
      rounded
      class="full-width"
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
    <q-card style="max-width: 900px; border-radius: 25px">
      <q-toolbar class="q-pt-md">
        <q-toolbar-title class="text-h5">
          {{
            statusActive
              ? $t('subscription.upgradeYourPlan')
              : $t('subscription.selectSubscription')
          }}
        </q-toolbar-title>
        <q-btn flat round icon="close" @click="dialogActivator = false" />
      </q-toolbar>
      <q-card-section>
        <div class="text-body1">
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Assumenda at culpa distinctio
          ducimus quod rerum! Commodi error eveniet facilis fuga quibusdam unde. Ab architecto
          assumenda impedit inventore molestiae sequi, sunt?
        </div>
      </q-card-section>
      <q-separator color="negative" class="q-mx-lg" />
      <q-card-section class="q-my-xl">
        <div class="row q-gutter-xl justify-center">
          <div
            class="col-5 q-pa-md text-center column justify-between"
            :class="{ 'text-grey': statusActive }"
            :style="
              statusActive
                ? 'border: 2px solid #CCCCCC; border-radius: 25px'
                : 'border: 2px solid #000000; border-radius: 25px'
            "
          >
            <div class="text-h6">{{ $t('subscription.monthlyAccess') }}</div>
            <q-separator color="negative" class="q-mx-lg" />
            <div class="text-h5 q-mt-sm">€9.99</div>
            <div class="text-subtitle2 q-mb-md">/ {{ $t('subscription.month') }}</div>
            <ul class="q-mt-sm q-mb-sm" style="list-style: none; padding: 0">
              <li><q-icon name="check" color="primary" size="16px" class="q-mr-sm" />3D-галерея</li>
              <li><q-icon name="check" color="primary" size="16px" class="q-mr-sm" />Обновления</li>
            </ul>
            <q-btn
              no-caps
              outline
              rounded
              :label="
                statusActive ? $t('subscription.yourCurrentPlan') : $t('subscription.subscribeNow')
              "
              class="q-mt-sm full-width"
              :disable="statusActive"
              @click="subscribe({ interval: 'month' })"
            />
          </div>
          <div
            class="col-5 q-pa-md text-center column justify-between"
            style="border: 2px solid #000000; border-radius: 25px"
          >
            <div class="text-h6 text-primary">{{ $t('subscription.annualAccess') }}</div>
            <q-separator color="negative" class="q-mx-lg" />
            <div class="text-h5 text-primary q-mt-sm">€99.99</div>
            <div class="text-subtitle2 q-mb-md text-primary">/ {{ $t('subscription.year') }}</div>
            <ul class="q-mt-sm q-mb-sm" style="list-style: none; padding: 0">
              <li>
                <q-icon name="check" color="primary" size="16px" class="q-mr-sm" />Всё из месячной
              </li>
              <li>
                <q-icon name="check" color="primary" size="16px" class="q-mr-sm" />2 месяца
                бесплатно
              </li>
            </ul>
            <q-btn
              no-caps
              outline
              rounded
              :label="
                statusActive ? $t('subscription.upgradePlan') : $t('subscription.subscribeNow')
              "
              class="q-mt-sm full-width"
              @click="subscribe({ interval: 'year' })"
            />
          </div>
        </div>
      </q-card-section>
    </q-card>
  </q-dialog>
  <confirm-subscription-change-dialog
    v-model="activatorChangeDialog"
    :subscription-change-data="subscriptionChangeData"
    @subscription-change="subscribe({ interval: 'year', updateChek: true })"
  />
</template>

<script>
import { computed, ref, toRefs } from 'vue'
import { storeToRefs } from 'pinia'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from 'stores/auth-store'
import { useStripeStore } from 'stores/stripe-store'
import { useUserStore } from 'stores/user-store'
import { prices } from 'src/pk_live'
import { formatPaymentMethod } from 'src/composables/formatPaymentMethod'
import ConfirmSubscriptionChangeDialog from 'components/dialogs/ConfirmSubscriptionChangeDialog.vue'

export default {
  name: 'SubscribeDialog',
  components: {
    ConfirmSubscriptionChangeDialog
  },
  props: ['actionId'],
  setup(props) {
    const route = useRoute()
    const router = useRouter()
    const { actionId } = toRefs(props)
    const authStore = useAuthStore()
    const { loggedIn } = storeToRefs(authStore)
    const { showLoginDialog } = authStore
    const stripeStore = useStripeStore()
    const { payStripe, subscriptionUpdate } = stripeStore
    const userStore = useUserStore()
    const { userData, listSubscriptions } = storeToRefs(userStore)
    const dialogActivator = ref(false)
    const activatorChangeDialog = ref(false)
    const subscriptionChangeData = ref({})
    const subscription = computed(() => listSubscriptions.value['Virtual Gallery'])
    const statusActive = computed(
      () => subscription.value?.interval === 'month' && subscription.value?.status === 'active'
    )
    const handlerClick = () => {
      console.log('handlerClick')
      if (!loggedIn.value) {
        showLoginDialog(true)
      }
      if (subscription.value?.status === 'active') {
        router.push(`/3d/${actionId.value}`)
      } else {
        dialogActivator.value = true
      }
    }
    const subscribe = async ({ interval, updateChek = false }) => {
      console.log('subscribe - ', interval)
      if (interval === 'year' && statusActive.value) {
        const subscriptionData = {
          customerId: subscription.value.customer,
          subscriptionId: subscription.value.id,
          itemId: subscription.value.itemId,
          price: prices[interval],
          updateChek
        }
        if (!updateChek) {
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
            email: userData.value.email
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
      subscription,
      statusActive,
      dialogActivator,
      activatorChangeDialog,
      subscriptionChangeData,
      handlerClick,
      subscribe
    }
  }
}
</script>

<style scoped></style>
