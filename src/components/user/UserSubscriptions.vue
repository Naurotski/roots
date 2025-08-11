<template>
  <div
    v-if="
      !Object.keys(listSubscriptions).length ||
      !Object.values(listSubscriptions).find((item) => item.status === 'active')
    "
  >
    <div class="text-center text-h5 q-mb-md">{{ $t('subscription.noSubscriptions') }}</div>
    <div class="text-center">
      <subscribe-dialog v-slot="{ openDialog }">
        <q-btn
          no-caps
          outline
          rounded
          style="width: 200px"
          :class="{ 'full-width': $q.screen.xs }"
          :label="$t('subscription.selectSub')"
          @click="openDialog()"
        />
      </subscribe-dialog>
    </div>
  </div>
  <div v-else>
    <div v-for="(subscription, name) in listSubscriptions" :key="subscription.id">
      <div class="text-h5">{{ name }}</div>
      <div class="text-subtitle1">{{ $t(subscriptionsData[subscription.interval].name) }}</div>
      <div v-if="subscription.status === 'active'" class="text-caption">
        {{ $t('subscription.automaticallyRenewed') }}
        <span class="text-weight-bold">{{
          date.formatDate(subscription.current_period_end * 1000, 'DD/MM/YYYY')
        }}</span>
      </div>
      <div v-else class="text-caption">Status - {{ subscription.status }}</div>

      <div class="q-my-lg text-justify">
        <div v-for="item in subscriptionsData[subscription.interval].list" :key="item" class="row">
          <q-icon name="check" class="col-1 items-start" />
          <div class="col-11">{{ $t(item) }}</div>
        </div>
      </div>
      <div class="q-gutter-sm">
        <subscribe-dialog
          v-if="!(subscription.interval === 'year' && subscription.status === 'active')"
          v-slot="{ openDialog }"
        >
          <q-btn
            no-caps
            outline
            rounded
            style="width: 200px"
            :class="{ 'full-width': $q.screen.xs }"
            :label="$t('subscription.renewSubscription')"
            @click="openDialog()"
          />
        </subscribe-dialog>
        <q-btn
          v-if="subscription.status === 'active'"
          no-caps
          outline
          rounded
          style="width: 200px"
          :class="{ 'full-width': $q.screen.xs }"
          :label="$t('subscription.cancelSubscription')"
          @click="cancelSubscription(subscription.current_period_end)"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { storeToRefs } from 'pinia'
import { date, useQuasar } from 'quasar'
import { useI18n } from 'vue-i18n'
import SubscribeDialog from 'components/dialogs/SubscribeDialog.vue'
import { useUserStore } from 'stores/user-store'

export default {
  name: 'UserSubscriptions',
  components: {
    SubscribeDialog
  },
  setup() {
    const $q = useQuasar()
    const { t } = useI18n()
    const userStore = useUserStore()
    const { listSubscriptions } = storeToRefs(userStore)
    const { subscriptionsData } = userStore
    const cancelSubscription = (current_period_end) => {
      $q.dialog({
        title: `<span style="color: red">${t('subscription.cancelSubscription')}</span>`,
        message: `${t('subscription.subscriptionWillBeCancelled')} ${date.formatDate(
          current_period_end * 1000,
          'DD/MM/YYYY'
        )}`,
        cancel: true,
        persistent: true,
        html: true
      }).onOk(() => {
        console.log('cancelSubscription')
      })
    }
    return {
      date,
      listSubscriptions,
      subscriptionsData,
      cancelSubscription
    }
  }
}
</script>

<style scoped></style>
