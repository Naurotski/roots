import { Platform } from 'quasar'

export const pickKTX2Variant = (variants = {}, perfTier) => {
  if (!variants) return null
  const isPhone = Platform.is.mobile
  const dpr = Math.min(window.devicePixelRatio || 1, 3)
  const hiDPR = dpr >= 3
  const minSide = Math.min(window.innerWidth, window.innerHeight) * dpr

  const want = (keys) => keys.map((k) => variants[k]).find(Boolean) || null

  // === ТЕЛЕФОНЫ ===
  if (isPhone) {
    const bigPhone = minSide >= 900 // iPhone 8 (750) сюда НЕ попадает

    // почти все телефоны → thumb, mobile как fallback
    if (!bigPhone) {
      return want(['thumb', 'mobile'])
    }

    // реально большие трубки / мини-планшеты
    if (perfTier === 'high' || perfTier === 'mid') {
      return want(['mobile', 'thumb'])
    }

    // low tier → всё равно thumb
    return want(['thumb', 'mobile'])
  }

  // дальше твоя логика для mid/high/low (десктоп/планшет)
  if (perfTier === 'high') {
    if (minSide >= 1500) return want(['full', 'desktop', 'mobile', 'thumb'])
    if (minSide >= 1000) return want(['desktop', 'full', 'mobile', 'thumb'])
    // на high + телефон всё равно можно desktop
    return want(['desktop', 'mobile', 'thumb', 'full'])
  }

  if (perfTier === 'mid') {
    // если hi-DPR — поднимаем порядок: сначала desktop
    if (hiDPR) {
      if (minSide >= 1200) return want(['desktop', 'mobile', 'thumb', 'full'])
      if (minSide >= 700) return want(['desktop', 'mobile', 'thumb', 'full'])
      return want(['mobile', 'thumb', 'desktop', 'full'])
    }
    // обычный mid
    if (minSide >= 1200) return want(['desktop', 'mobile', 'thumb', 'full'])
    if (minSide >= 700) return want(['mobile', 'desktop', 'thumb', 'full'])
    return want(['thumb', 'mobile', 'desktop', 'full'])
  }

  // low
  return want(['thumb', 'mobile', 'desktop', 'full'])
}
