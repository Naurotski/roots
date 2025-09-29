import { ref } from 'vue'
import { Notify } from 'quasar'
import { i18n } from 'boot/i18n.js'

const PING_URLS = [
  'https://www.gstatic.com/generate_204',
  'https://firebasestorage.googleapis.com/v0/b/roots-a7a88.appspot.com/o/admin%2FemptyPlace.png?alt=media&token=c9203444-656d-494a-a8e0-2e393a78ee27'
]
const TIMEOUT_MS = 4000
const INTERVAL_MS = 30000
const SLOW_MS = 500
const VERY_SLOW_MS = 1500
const isOnline = ref(navigator.onLine)
const isReachable = ref(true) // наш пинг
const latencyMs = ref(null)
let timer = null
let offlineNtf = null
let unreachableNtf = null
let t = i18n.global.t

const showOffline = () => {
  if (offlineNtf) return
  offlineNtf = Notify.create({
    type: 'negative',
    message: t('common.offline'),
    timeout: 0,
    position: 'top'
  })
}

const showUnreachable = () => {
  if (!isOnline.value) return
  unreachableNtf = Notify.create({
    type: 'negative',
    message: t('common.internetUnreachable'),
    timeout: 0,
    position: 'top'
  })
}
const showSlow = (ms) => {
  if (!isOnline.value || !isReachable.value) return
  const type = ms >= VERY_SLOW_MS ? 'warning' : 'info'
  const msg = ms >= VERY_SLOW_MS ? t('common.verySlowInternet') : t('common.slowInternet')
  Notify.create({
    type,
    message: msg,
    // caption: `${ms} ms`,
    timeout: 2500,
    position: 'top-right'
  })
}
async function pingOnce() {
  const controller = new AbortController()
  const tim = setTimeout(() => controller.abort(), TIMEOUT_MS)
  const start = performance.now()
  try {
    for (const u of PING_URLS) {
      try {
        await fetch(u, {
          method: 'GET',
          cache: 'no-store',
          signal: controller.signal,
          mode: 'no-cors'
        })
        latencyMs.value = Math.round(performance.now() - start)
        isReachable.value = true
        if (unreachableNtf) {
          unreachableNtf()
          unreachableNtf = null
        }
        if (latencyMs.value >= SLOW_MS) showSlow(latencyMs.value)
        clearTimeout(tim)
        return true
      } catch (_) {
        /* пробуем следующий */
      }
    }
    isReachable.value = false
    showUnreachable()
  } catch (_) {
    isReachable.value = false
    showUnreachable()
  } finally {
    clearTimeout(t)
  }
  return false
}

function handleOnline() {
  if (offlineNtf) {
    offlineNtf()
    offlineNtf = null
  }
  pingOnce()
}
function handleOffline() {
  isOnline.value = false
  isReachable.value = false
  showOffline()
}

function startNetworkStatus() {
  stopNetworkStatus()
  if (!isOnline.value) showOffline()
  window.addEventListener('online', handleOnline)
  window.addEventListener('offline', handleOffline)
  pingOnce()
  timer = setInterval(() => {
    if (!document.hidden) pingOnce()
  }, INTERVAL_MS)
}
function stopNetworkStatus() {
  window.removeEventListener('online', handleOnline)
  window.removeEventListener('offline', handleOffline)
  if (timer) {
    clearInterval(timer)
    timer = null
  }
}
export { startNetworkStatus, latencyMs }
