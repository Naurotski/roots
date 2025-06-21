import { ref, computed, onMounted, onUnmounted } from 'vue'

export const timeTicketFilter = (originalRef) => {
  const today = ref(new Date().toISOString().split('T')[0])
  const nowHM = ref(getCurrentTimeHM())
  function getCurrentTimeHM() {
    const now = new Date()
    return now.toTimeString().slice(0, 5) // HH:MM
  }
  let intervalId
  onMounted(() => {
    intervalId = setInterval(() => {
      today.value = new Date().toISOString().split('T')[0]
      nowHM.value = getCurrentTimeHM()
    }, 10000) // каждые 10 сек
  })
  onUnmounted(() => {
    clearInterval(intervalId)
  })
  const filteredListTickets = computed(() => {
    const result = {}
    for (const [dateKey, times] of Object.entries(originalRef.value)) {
      if (dateKey < today.value) continue
      const filteredTimes = Object.fromEntries(
        Object.entries(times).filter(([timeKey]) => {
          if (dateKey > today.value) return true
          const startTime = timeKey.split('-')[0]
          return startTime >= nowHM.value
        })
      )
      if (Object.keys(filteredTimes).length > 0) {
        result[dateKey] = filteredTimes
      }
    }
    return result
  })

  return {
    filteredListTickets
  }
}
