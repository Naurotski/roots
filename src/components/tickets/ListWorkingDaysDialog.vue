<template>
  <q-btn
    no-caps
    outline
    rounded
    class="full-width"
    :label="$t('tickets.buyTickets')"
    style="width: 150px"
    @click="dialog = true"
  />
  <q-dialog
    v-model="dialog"
    backdrop-filter="blur(4px)"
    :maximized="$q.screen.xs"
    :transition-show="$q.screen.xs ? 'slide-up' : 'fade'"
    :transition-hide="$q.screen.xs ? 'slide-down' : 'fade'"
  >
    <q-card style="width: 900px; max-width: 100vw" :class="{ 'card-default': !$q.screen.xs }">
      <q-card-section
        class="q-pa-none"
        style="position: sticky; top: 0; z-index: 1; background: white"
      >
        <q-toolbar>
          <div class="text-h5 text-bold" :class="{ 'text-subtitle1': $q.screen.xs }">
            {{ $t('tickets.selectDate') }}
          </div>
          <q-space />
          <q-btn flat round icon="close" dense v-close-popup />
        </q-toolbar>
        <div class="row">
          <q-img
            :src="action.urlImage"
            :alt="action.name"
            fit="contain"
            class="col q-mb-xs z-max"
            style="max-height: 100px"
          />
          <div class="col" :class="{ 'text-center': $q.screen.xs }">
            <div>
              <div :class="{ 'text-subtitle1': $q.screen.xs }" class="text-h6 text-bold">
                {{ action.name }}
              </div>
              <div class="text-body1">{{ action.city }}</div>
            </div>
            <transition
              appear
              enter-active-class="animated fadeIn faster"
              leave-active-class="animated fadeOut faster"
              mode="out-in"
            >
              <div v-if="!selectedTime" class="text-body1" key="1">
                {{ action.openingDate }}-{{ action.closingDate }}
              </div>
              <div v-else key="2">
                <div class="text-body1">
                  {{
                    new Date(selectedTime.dateKey).toLocaleDateString(
                      $i18n.locale === 'it' ? 'it-IT' : 'en-US',
                      {
                        weekday: 'short'
                      }
                    )
                  }}
                  {{ selectedTime.dateKey.split('-').reverse().join('/') }}
                </div>
                <div class="text-body1">
                  {{
                    selectedTime.timeKey.split('-')[0] === selectedTime.timeKey.split('-')[1]
                      ? selectedTime.timeKey.split('-')[0]
                      : selectedTime.timeKey
                  }}
                </div>
              </div>
            </transition>
          </div>
        </div>
      </q-card-section>
      <transition name="slide-left-right" mode="out-in">
        <q-card-section
          v-if="!selectedTime"
          key="list"
          class="example-row-equal-width flex flex-center"
          style="height: 70%"
        >
          <div class="full-width q-pb-xs">
            <div v-for="(date, dateKey) in currentListTickets" :key="dateKey" class="row">
              <div class="" :class="['flex flex-center', $q.screen.xs ? 'col-5' : 'col-3 ']">
                {{
                  new Date(dateKey).toLocaleDateString($i18n.locale === 'it' ? 'it-IT' : 'en-US', {
                    weekday: 'short'
                  })
                }}
                {{ dateKey.split('-').reverse().join('/') }}
              </div>
              <div :class="['col', $q.screen.xs ? 'column' : 'row']" class="q-gutter-x-xs">
                <q-card
                  v-for="(timeTickets, timeKey) in date"
                  :key="timeKey"
                  class="col q-pa-xs text-center cursor-pointer transition-all no-wrap"
                  :class="[
                    { 'q-mb-xs': $q.screen.xs },
                    hover === `${timeKey}-${dateKey}` ? 'shadow-1' : 'shadow-4'
                  ]"
                  style="background: white; border: none"
                  @mouseover="hover = `${timeKey}-${dateKey}`"
                  @mouseleave="hover = ''"
                  @click="selectedTime = { dateKey, timeKey, timeTickets }"
                >
                  {{
                    timeKey.split('-')[0] === timeKey.split('-')[1]
                      ? timeKey.split('-')[0]
                      : timeKey
                  }}
                </q-card>
              </div>
            </div>
          </div>
        </q-card-section>
        <div v-else style="height: 70%" class="flex flex-center">
          <timed-tickets
            class="full-width"
            key="detail"
            :date-key="selectedTime.dateKey"
            :time-tickets="selectedTime.timeTickets"
            :time-key="selectedTime.timeKey"
            :action-id="action.id"
            @delete-selected-time="() => (selectedTime = null)"
          />
        </div>
      </transition>
    </q-card>
  </q-dialog>
</template>
<script>
import { ref, toRefs } from 'vue'
import TimedTickets from 'components/tickets/TimedTickets.vue'
import { timeTicketFilter } from 'src/composables/timeTicketFilter'
export default {
  name: 'ListWorkingDaysDialog',
  components: {
    TimedTickets
  },
  props: {
    action: {
      type: Object,
      required: true
    }
  },
  setup(props) {
    const { action } = toRefs(props)
    const dialog = ref(false)
    const hover = ref(false)
    const selectedTime = ref(null)
    const { currentListTickets } = timeTicketFilter(action.value.tickets)
    return {
      dialog,
      hover,
      selectedTime,
      currentListTickets
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

.slide-left-right-enter-active,
.slide-left-right-leave-active
  transition: all 300ms ease
  position: absolute
  width: 100%

.slide-left-right-enter-from
  transform: translateX(100%)
  opacity: 0

.slide-left-right-enter-to
  transform: translateX(0)
  opacity: 1

.slide-left-right-leave-from
  transform: translateX(0)
  opacity: 1

.slide-left-right-leave-to
  transform: translateX(-100%)
  opacity: 0

.card-default
  height: 650px

.animated.faster
  animation-duration: 0.3s
</style>
