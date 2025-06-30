<template>
  <q-card-section>
    <q-btn
      class="q-mb-md"
      outline
      rounded
      size="md"
      icon="mdi-arrow-left-bold"
      @click="$emit('deleteSelectedTime')"
    />
    <q-form ref="ticketForm" @submit.prevent="buyTickets">
      <div class="text-body1 text-italic">
        {{ $t('tickets.available') }} - {{ timeTickets.quantity }}
        {{ $t('tickets.tickets') }}
      </div>
      <q-list dense separator>
        <q-separator />
        <q-item v-for="ticket in timeTickets.prices" :key="ticket.amount">
          <q-item-section class="col-7"
            >{{ $t(`tickets.${ticket.type}`) }} - {{ ticket.amount }}€</q-item-section
          >
          <q-item-section class="col">
            <q-select
              v-model="selectedTickets[ticket.type]"
              class="q-ml-xs"
              :options="options"
              options-dense
              lazy-rules
              dense
              virtual
              :rules="ticket.type === 'children' ? [childRule] : []"
              @popup-show="activeTicketType = ticket.type"
              @blur="activeTicketType = null"
            >
              <template v-slot:prepend>
                <span class="text-body2 text-bold">{{ $t('cart.qty') }}</span>
              </template>
            </q-select>
          </q-item-section>
          <q-item-section class="col text-right"
            >€{{ selectedTickets[ticket.type] * ticket.amount }}
          </q-item-section>
        </q-item>
        <q-item>
          <q-item-section class="col text-right text-bold">
            {{ $t('cart.subtotal') }} ({{ ticketCounter }} {{ $t('cart.items') }})
          </q-item-section>
          <q-item-section class="col-3 text-right text-bold"> €{{ subtotal }} </q-item-section>
        </q-item>
      </q-list>
      <div class="q-mt-md q-ml-md">{{ $t('tickets.emailForTicket') }}</div>
      <div :class="{ row: !$q.screen.xs }">
        <q-input
          v-model="userEmail"
          class="col"
          type="email"
          lazy-rules
          label="Email"
          dense
          clearable
          outlined
          rounded
          stack-label
          autocomplete="email"
          :rules="[(val) => isValidEmailAddress(val) || 'Please enter a valid email address.']"
        />
        <q-input
          v-model="userName"
          class="col"
          lazy-rules
          :label="$t('dialoguePayment.firstName')"
          dense
          clearable
          outlined
          rounded
          stack-label
          autocomplete="given-name"
          :rules="[
            (val) => (val && val.length > 0) || 'Please type something',
            (v) => v.length <= 30 || 'Not more than 30 characters'
          ]"
        />
      </div>
      <q-btn
        no-caps
        outline
        rounded
        class="full-width"
        type="submit"
        :label="$t('common.buy')"
        :disable="!subtotal"
      />
    </q-form>
  </q-card-section>
</template>
<script>
import { computed, onMounted, ref, toRefs, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useStripeStore } from 'stores/stripe-store'
import { isValidEmailAddress } from 'src/composables/isValidEmailAddress'

export default {
  name: 'TimedTickets',
  props: {
    dateKey: String,
    timeTickets: Object,
    timeKey: String,
    action: Object
  },
  emits: ['deleteSelectedTime'],
  setup(props, { emit }) {
    const { timeTickets, dateKey, timeKey, action } = toRefs(props)
    const route = useRoute()
    const { t, locale } = useI18n({ useScope: 'global' })
    const stripeStore = useStripeStore()
    const { payStripeTickets } = stripeStore
    const selectedTickets = ref({})
    const activeTicketType = ref(null)
    const ticketForm = ref(null)
    const userEmail = ref('')
    const userName = ref('')
    onMounted(() => {
      timeTickets.value.prices.forEach((ticket) => {
        selectedTickets.value[ticket.type] = 0
      })
    })
    const ticketCounter = computed(() =>
      Object.values(selectedTickets.value).reduce((sum, current) => sum + current, 0)
    )
    const subtotal = computed(() =>
      timeTickets.value.prices.reduce(
        (sum, current) => sum + current.amount * selectedTickets.value[current.type],
        0
      )
    )
    const options = computed(() => {
      const selected = { ...selectedTickets.value }
      delete selected[activeTicketType.value]
      return [
        0,
        ...Array.from(
          {
            length:
              timeTickets.value.quantity -
              Object.values(selected).reduce((sum, current) => sum + current, 0)
          },
          (_, index) => index + 1
        )
      ]
    })
    watch(
      () => timeTickets.value?.quantity,
      (newVal) => {
        if (!newVal) {
          emit('deleteSelectedTime')
          return
        }
        if (newVal < ticketCounter.value) {
          let overflow = ticketCounter.value - newVal
          for (const key of Object.keys(selectedTickets.value).reverse()) {
            if (selectedTickets.value[key] >= overflow) {
              selectedTickets.value[key] -= overflow
              break
            } else {
              overflow -= selectedTickets.value[key]
              selectedTickets.value[key] = 0
            }
          }
        }
      }
    )
    const childRule = (val) => {
      if (val && (!selectedTickets.value.adults || selectedTickets.value.adults === 0)) {
        return t('tickets.childrenNeedAdult')
      }
      return true
    }
    const buyTickets = async () => {
      const valid = await ticketForm.value.validate()
      if (!valid) {
        return
      }
      const line_items = []
      Object.keys(selectedTickets.value).forEach((key) => {
        if (selectedTickets.value[key] !== 0) {
          line_items.push({
            quantity: selectedTickets.value[key],
            price_data: {
              currency: 'eur',
              unit_amount: timeTickets.value.prices.find((item) => item.type === key).amount * 100,
              product_data: {
                name: t(`tickets.${key}`),
                description: `${action.value.name}, ${action.value.city}, ${dateKey.value
                  .split('-')
                  .reverse()
                  .join('/')}, ${
                  timeKey.value.split('-')[0] === timeKey.value.split('-')[1]
                    ? timeKey.value.split('-')[0]
                    : timeKey
                }`,
                images: [action.value.urlImage]
              }
            }
          })
        }
      })
      const paymentDetails = {
        cancel_url: route.path,
        line_items,
        userEmail: userEmail.value,
        userName: userName.value,
        metadata: {
          tickets: true,
          actionId: action.value.id,
          date: dateKey.value,
          time: timeKey.value,
          image: action.value.urlImage,
          description: `${action.value.name}, ${action.value.city}, ${dateKey.value
            .split('-')
            .reverse()
            .join('/')}, ${timeKey.value}`,
          local: locale.value
        }
      }
      console.log('buyTickets', paymentDetails)
      await payStripeTickets(paymentDetails)
    }

    return {
      selectedTickets,
      activeTicketType,
      userEmail,
      userName,
      ticketCounter,
      subtotal,
      options,
      ticketForm,
      isValidEmailAddress,
      childRule,
      buyTickets
    }
  }
}
</script>

<style scoped></style>
