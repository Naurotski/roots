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
    <q-card style="max-width: 1000px; border-radius: 25px">
      <q-toolbar class="q-pt-md">
        <q-toolbar-title class="text-body1">
          {{
            statusActive
              ? $t('subscription.upgradeYourPlan')
              : $t('subscription.selectSubscription')
          }}
        </q-toolbar-title>
        <q-btn flat round icon="close" @click="dialogActivator = false" />
      </q-toolbar>
      <q-card-section>
        <div v-if="$i18n.locale === 'en'">
          <div class="text-h5">Enter AORTA — the gallery that’s always with you.</div>
          <div class="text-body2">
            Immerse yourself in a world where art surrounds you from every side. Our projects are
            not just exhibitions, but immersive stories that change the way you see the world and
            these immersive stories stay with you forever. You’re inside the gallery, even if you’re
            thousands of kilometers away. New exhibitions appear every month, so don’t miss what
            will become absolutely legendary tomorrow.
          </div>
        </div>
        <div v-else>
          <div class="text-h5">Entra in AORTA — la galleria che è sempre con te.</div>
          <div class="text-body2">
            Immergiti in un mondo in cui l’arte ti circonda da ogni lato. I nostri progetti non sono
            semplici mostre, ma storie immersive che cambiano il tuo modo di vedere il mondo — e
            queste storie restano con te per sempre. Sei dentro la galleria, anche se ti trovi a
            migliaia di chilometri di distanza. Ogni mese nuove mostre prendono vita: non perdere
            ciò che domani diventerà leggendario.
          </div>
        </div>
      </q-card-section>
      <q-separator color="negative" class="q-mx-lg" />
      <q-card-section>
        <div class="row q-gutter-xl justify-center">
          <div
            v-for="(subscription, key) in subscriptions"
            :key="subscription.price"
            class="col-5 q-pa-md column"
            :class="{ 'text-grey': statusActive && key === 'month' }"
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
            <q-btn
              no-caps
              outline
              rounded
              :label="statusActive ? $t(subscription.btnLabel[0]) : $t(subscription.btnLabel[1])"
              class="full-width"
              :disable="key === 'month' && statusActive"
              @click="subscribe({ interval: key })"
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
    const { subscriptions, payStripe, subscriptionUpdate } = stripeStore
    const userStore = useUserStore()
    const { userData, listSubscriptions } = storeToRefs(userStore)
    const dialogActivator = ref(false)
    const activatorChangeDialog = ref(false)
    const subscriptionChangeData = ref({})
    const subscription = computed(() => listSubscriptions.value['Virtual Gallery'])
    const statusActive = computed(
      () => !!(subscription.value?.interval === 'month' && subscription.value?.status === 'active')
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
      subscriptions,
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
