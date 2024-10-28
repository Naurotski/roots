<template>
  <div v-if="!artWorks.length" class="text-center">
    <div class="text-h4">{{ $t('settings.noPurchases') }}.</div>
    <q-btn
      class="q-mt-md"
      flat
      icon-right="mdi-arrow-right-bold"
      :label="$t('links.sale')"
      to="/sale"
    />
  </div>
  <div v-else class="row justify-around">
    <div
      class="q-ma-lg"
      v-for="{ name, artistName, urlImageWork, date } in artWorks"
      :key="urlImageWork"
      style="width: 300px"
    >
      <div v-if="urlImageWork.includes('video')">
        <div style="position: relative">
          <q-video
            :style="$q.screen.xs ? 'max-height: 300px' : 'height: 300px'"
            :src="urlImageWork"
          />
          <div
            style="position: absolute; top: 5px; height: 100%; width: 100%; opacity: 0.1"
            class="bg-grey-2"
          />
        </div>
        <div class="text-body1 q-mt-md">
          <div>{{ artistName }}</div>
          <b>{{ name }}</b>
          <p>{{ $t('settings.datePurchase') }} - {{ date }}</p>
        </div>
      </div>
      <div v-else>
        <q-img
          :src="urlImageWork"
          fit="contain"
          :style="$q.screen.xs ? 'max-height: 300px' : 'height: 300px'"
        />
        <div class="text-body1 q-mt-md">
          <div>{{ artistName }}</div>
          <b>{{ name }}</b>
          <p>{{ $t('settings.datePurchase') }} - {{ date }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { computed } from 'vue'
import { date } from 'quasar'
import { storeToRefs } from 'pinia'
import { useI18n } from 'vue-i18n'
import { useUserStore } from 'stores/user-store'

export default {
  name: 'UserOrders',
  setup() {
    const { locale } = useI18n({ useScope: 'global' })
    const userStore = useUserStore()
    const { userData } = storeToRefs(userStore)
    const artWorks = computed(() => {
      if (userData.value.orders?.artWorks) {
        return Object.values(userData.value.orders.artWorks)
          .sort((a, b) => {
            if (a.date < b.date) return 1
            if (a.date === b.date) return 0
            if (a.date > b.date) return -1
          })
          .map((item) => ({
            ...item,
            name: locale.value === 'it' ? item.workNameIt : item.workName,
            date: date.formatDate(item.date, 'DD/MM/YYYY')
          }))
      } else {
        return []
      }
    })
    return {
      artWorks
    }
  }
}
</script>
<style scoped></style>
