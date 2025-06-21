<template>
  <q-btn
    no-caps
    outline
    rounded
    class="full-width"
    :label="$t('tickets.buyTickets')"
    style="width: 150px"
    @click="dialogList = true"
  />
  <q-dialog
    v-model="dialogList"
    backdrop-filter="blur(4px)"
    :maximized="$q.screen.xs"
    :transition-show="$q.screen.xs ? 'slide-up' : 'fade'"
    :transition-hide="$q.screen.xs ? 'slide-down' : 'fade'"
  >
    <q-card style="width: 900px; max-width: 100vw; position: relative">
      <q-toolbar class="q-pt-md">
        <q-toolbar-title class="text-h5">
          {{ $t('tickets.buyTickets') }}
        </q-toolbar-title>
        <q-btn flat round icon="close" dense v-close-popup />
      </q-toolbar>
      <q-card-section class="q-pa-xm example-row-equal-width">
        <div v-for="(date, dateKey) in filteredListTickets" :key="dateKey" class="row">
          <div class="" :class="['flex flex-center', $q.screen.xs ? 'col-5' : 'col-3 ']">
            {{
              new Date(dateKey).toLocaleDateString($i18n.locale === 'it' ? 'it-IT' : 'en-US', {
                weekday: 'short'
              })
            }}
            {{ dateKey.split('-').reverse().join('/') }}
          </div>
          <div :class="['col', $q.screen.xs ? 'column' : 'row']">
            <div
              class="col"
              :class="{ 'q-mb-xs': $q.screen.xs }"
              v-for="(timeTickets, timeKey) in date"
              :key="timeKey"
              style="background: transparent; border: none"
            >
              <timed-tickets-dialog
                :date-key="dateKey"
                :time-tickets="timeTickets"
                :time-key="timeKey"
                :action-id="actionId"
                :name="name"
                :url="url"
                :city="city"
              />
            </div>
          </div>
        </div> </q-card-section
      >e>
    </q-card>
  </q-dialog>
</template>
<script>
import { ref, toRefs } from 'vue'
import TimedTicketsDialog from 'components/tickets/TimedTicketsDialog.vue'
import { timeTicketFilter } from 'src/composables/timeTicketFilter'
export default {
  name: 'ListWorkingDaysDialog',
  components: {
    TimedTicketsDialog
  },
  props: { ticketsList: Object, actionId: String, name: String, url: String, city: String },
  setup(props) {
    const { ticketsList } = toRefs(props)
    const dialogList = ref(false)
    // const currentTicketsList
    const { filteredListTickets } = timeTicketFilter(ticketsList)
    return {
      dialogList,
      filteredListTickets
    }
  }
}
</script>

<style lang="sass">
.example-row-equal-width
  .row > div
    padding: 2px 2px
    background: rgba(#999,.15)
    border: 1px solid rgba(#999,.2)
  .row + .row
    margin-top: 0.3rem
</style>
