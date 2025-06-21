<template>
  <q-card
    class="q-pa-xs text-center cursor-pointer transition-all"
    :class="hover ? 'shadow-1' : 'shadow-4'"
    style="white-space: nowrap"
    @mouseover="hover = true"
    @mouseleave="hover = false"
    @click="dialog = true"
  >
    {{ timeKey.split('-')[0] === timeKey.split('-')[1] ? timeKey.split('-')[0] : timeKey }}
  </q-card>
  <q-dialog
    v-model="dialog"
    backdrop-filter="blur(4px)"
    :maximized="$q.screen.xs"
    :transition-show="$q.screen.xs ? 'slide-up' : 'fade'"
    :transition-hide="$q.screen.xs ? 'slide-down' : 'fade'"
  >
    <q-card style="width: 700px; position: relative">
      <q-btn
        icon="close"
        class="lt-sm z-max absolute"
        flat
        round
        dense
        v-close-popup
        style="top: 10px; right: 10px"
      />
      <div class="row">
        <q-card-section class="col-12 col-sm-4 col-md-4 col-lg-4 col-xl-4 flex flex-center">
          <q-img
            :src="url"
            :alt="name"
            fit="contain"
            :style="$q.screen.xs ? 'max-height: 150px' : 'height: 150px'"
          />
        </q-card-section>
        <div class="col-12 col-sm-8 col-md-8 col-lg-8 col-xl-8">
          <q-card-section>
            <div class="row items-start justify-between no-wrap">
              <div :class="{ 'text-subtitle1': $q.screen.xs }" class="text-h6 text-bold">
                {{ name }}
              </div>

              <q-btn icon="close" class="gt-xs" flat round dense v-close-popup />
            </div>
            <div class="text-body1">
              {{
                new Date(dateKey).toLocaleDateString($i18n.locale === 'it' ? 'it-IT' : 'en-US', {
                  weekday: 'short'
                })
              }}
              {{ dateKey.split('-').reverse().join('/') }}
            </div>
            <div class="text-body1">
              {{
                timeKey.split('-')[0] === timeKey.split('-')[1] ? timeKey.split('-')[0] : timeKey
              }}
            </div>
            <div class="text-body1">{{ city }}</div>
            <div class="text-body1 q-mt-lg-lg text-italic">
              {{ $t('tickets.available') }} - {{ timeTickets.quantity }} {{ $t('tickets.tickets') }}
            </div>
            <div class="q-mt-sm">
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
                  <q-item-section class="col-3 text-right text-bold">
                    €{{ subtotal }}
                  </q-item-section>
                </q-item>
              </q-list>
            </div>
          </q-card-section>
        </div>
      </div>
      <q-card-actions align="right">
        <q-btn
          no-caps
          outline
          rounded
          class="q-mr-md"
          :class="{ 'full-width': $q.screen.xs }"
          :label="$t('common.buy')"
          :disable="!subtotal"
          @click="buyTickets"
        />
      </q-card-actions>
      <!--      <pre>timeTickets - {{ timeTickets }}</pre>-->
      <!--      <pre>activeTicketType - {{ activeTicketType }}</pre>-->
      <!--      <pre>selectedTickets - {{ selectedTickets }}</pre>-->
    </q-card>
  </q-dialog>
</template>
<script>
import { computed, onMounted, ref, toRefs, watch } from 'vue'

export default {
  name: 'TimedTicketsDialog',
  props: {
    dateKey: String,
    timeTickets: Object,
    timeKey: String,
    actionId: String,
    name: String,
    url: String,
    city: String
  },
  setup(props) {
    const { timeTickets } = toRefs(props)
    const dialog = ref(false)
    const hover = ref(false)
    const selectedTickets = ref({})
    const activeTicketType = ref(null)
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
    const buyTickets = () => {
      console.log('buyTickets', selectedTickets.value)
      dialog.value = false
    }

    return {
      dialog,
      hover,
      selectedTickets,
      activeTicketType,
      ticketCounter,
      subtotal,
      options,
      buyTickets
    }
  }
}
</script>

<style scoped></style>
