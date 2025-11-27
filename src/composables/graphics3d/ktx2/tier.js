const clampDpr = () => Math.min(window.devicePixelRatio || 1, 3)
const getMemGB = () => (Number.isFinite(navigator.deviceMemory) ? navigator.deviceMemory : 0)
const getCores = () =>
  Number.isFinite(navigator.hardwareConcurrency) ? navigator.hardwareConcurrency : 0

const isMobileUA = () => {
  const ua = navigator.userAgent || ''
  return /Mobi|Android|iPhone|iPad|iPod/i.test(ua)
}

export const detectPerfTier = async (renderer, { debug = false } = {}) => {
  const dpr = clampDpr()
  const memGB = getMemGB()
  const cores = getCores()
  const isMobile = isMobileUA()
  const minSideCss = Math.min(window.innerWidth, window.innerHeight)
  const minSide = minSideCss * dpr

  const gl = renderer.getContext()
  const caps = renderer.capabilities

  const maxTex = gl.getParameter(gl.MAX_TEXTURE_SIZE) || 0
  const webgl2 = !!caps.isWebGL2
  const hasASTC = !!caps.hasCompressedTextureASTC
  const hasBC = !!caps.hasCompressedTextureBC
  const hasETC2 = !!caps.hasCompressedTextureETC2

  const dbgExt = gl.getExtension('WEBGL_debug_renderer_info')
  const rendererStr = dbgExt ? gl.getParameter(dbgExt.UNMASKED_RENDERER_WEBGL) || '' : ''

  let score = 0

  // форма-фактор
  if (!isMobile) score += 4 // десктоп → базово high
  else score += 1 // мобильный → базово mid/low

  // GPU / WebGL
  if (webgl2) score += 2
  if (maxTex >= 8192) score += 3
  else if (maxTex >= 4096) score += 2
  else if (maxTex >= 2048) score += 1

  if (hasASTC || hasBC) score += 2
  if (hasETC2) score += 1

  // память
  if (memGB >= 12) score += 3
  else if (memGB >= 8) score += 2
  else if (memGB >= 4) score += 1
  else if (memGB > 0 && memGB <= 3) score -= 2 // совсем мало → штраф

  // ядра
  if (cores >= 8) score += 2
  else if (cores >= 4) score += 1
  else if (cores > 0 && cores <= 2) score -= 1

  // hi-DPR мобильник с большим экраном → чуть аккуратнее
  if (isMobile && dpr >= 3 && minSideCss >= 700) score -= 1

  // если память не раскрыта, но GPU-капабилити хорошие — небольшой буст
  if (!memGB && (maxTex >= 4096 || hasASTC || hasBC)) score += 1

  // маленький бонус для нормальных десктопных GPU (Mac / Radeon / M1+)
  if (/Mac|Apple|Radeon|M1|M2|M3|RTX|GTX/i.test(rendererStr)) score += 1

  // базовый tier по score
  let tier
  if (score >= 9) tier = 'high'
  else if (score >= 5) tier = 'mid'
  else tier = 'low'

  // safety-правки

  // очень маленький экран → не даём high
  if (minSide < 700 && tier === 'high') tier = 'mid'

  // мобильным сложнее получить high
  if (isMobile && tier === 'high') tier = 'mid'

  if (debug) {
    console.log('perfTier info:', {
      tier,
      score,
      isMobile,
      dpr,
      memGB,
      cores,
      minSideCss,
      maxTex,
      webgl2,
      hasASTC,
      hasBC,
      hasETC2,
      rendererStr
    })
  }
console.log('tier - ', tier)
  return tier
}
