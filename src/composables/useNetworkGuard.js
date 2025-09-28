import { ref, onMounted, onUnmounted } from 'vue'

const PING_URLS = [
  'https://firebasestorage.googleapis.com/v0/b/roots-a7a88.appspot.com/o/admin%2FemptyPlace.png?alt=media&token=c9203444-656d-494a-a8e0-2e393a78ee27',
  'https://www.gstatic.com/generate_204'
]
const TIMEOUT_MS = 4000
const INTERVAL_MS = 15000

export function useNetworkGuard() {
  const isOnline = ref(navigator.onLine) // системный флаг
  const isReachable = ref(true) // наш пинг
  const latencyMs = ref(null)
  let timer = null

  async function pingOnce() {
    console.log('pingOnce -------')
    const controller = new AbortController()
    const t = setTimeout(() => controller.abort(), TIMEOUT_MS)
    const start = performance.now()
    try {
      // идём по списку, достаточно одного успешного ответа
      for (const u of PING_URLS) {
        try {
          await fetch(u, {
            method: 'GET',
            cache: 'no-store',
            signal: controller.signal,
            mode: 'no-cors'
          })
          // mode:no-cors вернёт opaque, но факт ответа нам важнее
          latencyMs.value = Math.round(performance.now() - start)
          isReachable.value = true
          clearTimeout(t)
          console.log('pingOnce - latencyMs.value-------', latencyMs.value)
          return true
        } catch (_) {
          /* пробуем следующий */
        }
      }
      isReachable.value = false
    } catch (_) {
      isReachable.value = false
    } finally {
      clearTimeout(t)
    }
    return false
  }

  function startWatch() {
    stopWatch()
    // первая проверка сразу
    pingOnce()
    timer = setInterval(() => {
      if (document.hidden) return // не жрём сеть в фоне
      pingOnce()
    }, INTERVAL_MS)
  }
  function stopWatch() {
    if (timer) {
      clearInterval(timer)
      timer = null
    }
  }

  function handleOnline() {
    isOnline.value = true
    pingOnce()
  }
  function handleOffline() {
    isOnline.value = false
    isReachable.value = false
  }

  onMounted(() => {
    console.log('useNetworkGuard - onMounted')
    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)
    startWatch()
  })
  onUnmounted(() => {
    console.log('useNetworkGuard - onUnmounted')
    window.removeEventListener('online', handleOnline)
    window.removeEventListener('offline', handleOffline)
    stopWatch()
  })

  return { isOnline, isReachable, latencyMs, pingOnce, startWatch, stopWatch }
}
