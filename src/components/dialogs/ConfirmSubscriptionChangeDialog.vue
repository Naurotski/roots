<template>
  <q-dialog
    v-model="activator"
    persistent
    :maximized="$q.screen.xs"
    :transition-show="$q.screen.xs ? 'slide-up' : 'fade'"
    :transition-hide="$q.screen.xs ? 'slide-down' : 'fade'"
  >
    <q-card style="max-width: 900px; border-radius: 25px" class="column no-wrap">
      <q-toolbar class="q-pt-md">
        <q-toolbar-title class="text-h5" style="white-space: normal !important">
          {{ $t('subscription.confirmChange') }}
        </q-toolbar-title>
        <q-btn flat round icon="close" @click="activator = false" />
      </q-toolbar>
      <q-separator color="negative" class="q-ma-lg" />

      <q-card-section class="col column justify-center">
        <div class="row justify-between text-subtitle1">
          <div>{{ $t('subscription.costNewPlan') }}</div>
          <div>€ {{ subscriptionChangeData.newPlan / 100 }}</div>
        </div>
        <div class="row justify-between text-subtitle1">
          <div>{{ $t('subscription.creditUnused') }}</div>
          <div>€ {{ subscriptionChangeData.oldPlan / 100 }}</div>
        </div>
        <q-separator />
        <div class="row justify-between text-subtitle1">
          <div>{{ $t('cart.total') }}</div>
          <div>€ {{ subscriptionChangeData.total / 100 }}</div>
        </div>
        <div class="row justify-between q-mt-sm">
          <div>{{ $t('subscription.paymentMethod') }}</div>
          <div class="row">
            <q-icon
              :name="subscriptionChangeData.paymentMethod.icon"
              :color="subscriptionChangeData.paymentMethod.color"
              class="q-mr-xs"
              size="xs"
            />
            <div>{{ subscriptionChangeData.paymentMethod.label }}</div>
          </div>
        </div>
      </q-card-section>
      <q-card-actions>
        <q-btn
          no-caps
          outline
          rounded
          :disable="subscriptionChangeData.paymentMethod.noMethod"
          :label="$t('subscription.payNow')"
          class="q-my-sm full-width"
          @click="() => $emit('subscriptionChange')"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>
<script>
import { computed, toRefs } from 'vue'

export default {
  name: 'ConfirmSubscriptionChangeDialog',
  props: {
    modelValue: {
      type: Boolean,
      required: true
    },
    subscriptionChangeData: {
      type: Object,
      required: true
    }
  },
  emits: ['update:modelValue', 'subscriptionChange'],
  setup(props, { emit }) {
    const { modelValue } = toRefs(props)
    const activator = computed({
      get() {
        return modelValue.value
      },
      set(val) {
        emit('update:modelValue', val)
      }
    })
    return {
      activator
    }
  }
}
</script>

<style scoped></style>
