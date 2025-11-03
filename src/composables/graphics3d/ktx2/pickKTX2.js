export const pickKTX2Variant = (variants = {}, renderer, perfTier) => {
  if (!variants) return null
  const dpr = Math.min(window.devicePixelRatio || 1, 3)
  const hiDPR = dpr >= 3
  const minSide = Math.min(window.innerWidth, window.innerHeight) * dpr

  const want = (keys) => keys.map((k) => variants[k]).find(Boolean) || null

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
  if (minSide >= 900) return want(['mobile', 'thumb', 'desktop', 'full'])
  return want(['thumb', 'mobile', 'desktop', 'full'])
}
