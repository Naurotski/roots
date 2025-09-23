import { LoadingManager } from 'three'
import { Loading } from 'quasar'
import { ref, computed } from 'vue'

export const manager = new LoadingManager()

// публичные состояния
export const loadingLabel = ref('Loading…')
export const loadingPercent = ref(0)

// внутренние счётчики
const inflightCount = ref(0) // сколько активных загрузок через manager (itemStart/itemEnd)
const overlayHolds = ref(0) // ручные удержания оверлея (holdOverlay/releaseOverlay)

// совместимость и удобство
export const isLoading = computed(() => inflightCount.value > 0)
export const activeLoading = computed(() => (inflightCount.value + overlayHolds.value > 0 ? 1 : 0))

export function setLoadingLabel(text) {
  loadingLabel.value = text || 'Loading…'
}

// --- UI: чёрный экран без миганий ---
let visible = false
let lastShowAt = 0
const MIN_SHOW_MS = 300 // минимальное время отображения

function showImmediate() {
  if (visible) return
  Loading.show({ group: 'gallery', message: loadingLabel.value })
  document.body.classList.add('gallery-loading') // твой CSS делает фон чёрным
  visible = true
  lastShowAt = Date.now()
}
function tryHide() {
  if (!visible) return
  if (activeLoading.value > 0) return
  const elapsed = Date.now() - lastShowAt
  const delay = elapsed < MIN_SHOW_MS ? MIN_SHOW_MS - elapsed : 0
  setTimeout(() => {
    if (activeLoading.value > 0 || !visible) return
    Loading.hide()
    document.body.classList.remove('gallery-loading')
    visible = false
    loadingLabel.value = 'Loading…'
    loadingPercent.value = 0
  }, delay)
}
function updateMsg(loaded, total) {
  const pct = total ? Math.round((loaded / total) * 100) : 0
  loadingPercent.value = pct
  if (visible) {
    Loading.show({ group: 'gallery', message: `${loadingLabel.value} ${pct}%` })
  }
}

// --- публичные удержания на весь этап (переключение галерей и т.п.) ---
export function holdOverlay(label) {
  if (label) loadingLabel.value = label
  overlayHolds.value++
  showImmediate()
}
export function releaseOverlay() {
  overlayHolds.value = Math.max(0, overlayHolds.value - 1)
  tryHide()
}

// --- ручной учёт произвольных async (видео и пр.) ---
export function markStart(id) {
  manager.itemStart(id) // учтётся через обёртку ниже
  showImmediate()
}
export function markEnd(id) {
  manager.itemEnd(id)
  tryHide()
}

// --- интеграция с Three.LoadingManager (счётчик + проценты) ---
const _itemStart = manager.itemStart.bind(manager)
const _itemEnd = manager.itemEnd.bind(manager)

manager.itemStart = (url) => {
  if (inflightCount.value === 0) showImmediate()
  inflightCount.value++
  _itemStart(url)
}
manager.itemEnd = (url) => {
  inflightCount.value = Math.max(0, inflightCount.value - 1)
  _itemEnd(url)
  if (inflightCount.value === 0) {
    loadingPercent.value = 100
    tryHide()
  }
}

// прогресс и ошибки (не влияeт на счётчик, только на текст и лог)
manager.onProgress = (_url, loaded, total) => updateMsg(loaded, total)
manager.onError = (url) => console.error('[LoadingManager] error:', url)
