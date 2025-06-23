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
              @popup-show="activeTicketType = ticket.type"
              @blur="activeTicketType = null"
            >
              <template v-slot:prepend>
                <span class="text-body2 text-bold">{{ $t('cart.qty') }}</span>
              </template>
            </q-select></q-item-section
          >
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
      <q-input
        ref="email"
        v-model="userEmail"
        type="email"
        lazy-rules
        label="Email"
        dense
        outlined
        rounded
        stack-label
        autocomplete="email"
        :rules="[(val) => isValidEmailAddress(val) || 'Please enter a valid email address.']"
      />
      <q-btn
        no-caps
        outline
        rounded
        class="full-width"
        type="submit"
        :label="$t('common.buy')"
        :disable="!subtotal"
        @click="buyTickets"
      />
    </q-form>
  </q-card-section>
</template>
<script>
import { computed, onMounted, ref, toRefs, watch } from 'vue'
import { useStripeStore } from 'stores/stripe-store'
import { isValidEmailAddress } from 'src/composables/isValidEmailAddress'

export default {
  name: 'TimedTickets',
  props: {
    dateKey: String,
    timeTickets: Object,
    timeKey: String,
    actionId: String
  },
  emits: ['deleteSelectedTime'],
  setup(props) {
    const { timeTickets, dateKey, timeKey, actionId } = toRefs(props)
    const stripeStore = useStripeStore()
    const { payStripeTickets } = stripeStore
    const selectedTickets = ref({})
    const activeTicketType = ref(null)
    const ticketForm = ref(null)
    const userEmail = ref('')
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
      () => timeTickets.value.quantity,
      (newVal) => {
        if (newVal < ticketCounter.value) {
          let overflow = ticketCounter.value - newVal
          for (const key of Object.keys(selectedTickets.value)) {
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
    const buyTickets = async () => {
      const valid = await ticketForm.value.validate()
      if (!valid) {
        return
      }
      Object.keys(selectedTickets.value).forEach((key) => {
        if (selectedTickets.value[key] === 0) delete selectedTickets.value[key]
      })
      const paymentDetails = {
        actionId: actionId.value,
        date: dateKey.value,
        time: timeKey.value,
        selectedTickets: selectedTickets.value,
        userEmail: userEmail.value
      }
      console.log('buyTickets', paymentDetails)
      await payStripeTickets(paymentDetails)
    }

    return {
      selectedTickets,
      activeTicketType,
      userEmail,
      ticketCounter,
      subtotal,
      options,
      ticketForm,
      isValidEmailAddress,
      buyTickets
    }
  }
}
</script>

<style scoped></style>
