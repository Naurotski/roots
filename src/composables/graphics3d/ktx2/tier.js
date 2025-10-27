const dpr = Math.min(window.devicePixelRatio || 1, 3)
const memGB = Number.isFinite(navigator.deviceMemory) ? navigator.deviceMemory : 0
const cores = Number.isFinite(navigator.hardwareConcurrency) ? navigator.hardwareConcurrency : 0
const net = navigator.connection?.effectiveType ?? null
const saveData = !!navigator.connection?.saveData

async function gpuProbe(renderer, ms = 400) {
  const gl = renderer.getContext()
  if (!renderer.__probe) {
    const vs = `
      attribute vec2 p;
      void main() { gl_Position = vec4(p,0.0,1.0); }`
    const fs = `
      precision mediump float;
      void main() { gl_FragColor = vec4(0.03,0.03,0.03,1.0); }`
    const prog = createProgram(gl, vs, fs)
    const buf = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, buf)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1, 3,-1, -1,3]), gl.STATIC_DRAW)
    const loc = gl.getAttribLocation(prog, 'p')
    renderer.__probe = { prog, buf, loc }
  }
  const { prog, buf, loc } = renderer.__probe
  let frames = 0
  const t0 = performance.now()
  return await new Promise((resolve) => {
    function frame() {
      gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight)
      gl.useProgram(prog)
      gl.bindBuffer(gl.ARRAY_BUFFER, buf)
      gl.enableVertexAttribArray(loc)
      gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0)
      gl.drawArrays(gl.TRIANGLES, 0, 3)
      frames++
      if (performance.now() - t0 >= ms) {
        resolve(Math.round(frames * 1000 / (performance.now() - t0)))
      } else {
        requestAnimationFrame(frame)
      }
    }
    requestAnimationFrame(frame)
  })

  function createProgram(gl, vsSrc, fsSrc) {
    const vs = gl.createShader(gl.VERTEX_SHADER); gl.shaderSource(vs, vsSrc); gl.compileShader(vs)
    const fs = gl.createShader(gl.FRAGMENT_SHADER); gl.shaderSource(fs, fsSrc); gl.compileShader(fs)
    const p = gl.createProgram(); gl.attachShader(p, vs); gl.attachShader(p, fs); gl.linkProgram(p)
    return p
  }
}
export const detectPerfTier = async (renderer, { sampleMs = 600 } = {}) => {
  const caps = renderer.capabilities
  const gl = renderer.getContext()

  const maxTex = gl.getParameter(gl.MAX_TEXTURE_SIZE) || 0
  const hasASTC = !!caps.hasCompressedTextureASTC
  const hasBC = !!caps.hasCompressedTextureBC
  const hasETC2 = !!caps.hasCompressedTextureETC2
  const webgl2 = !!caps.isWebGL2

  // (опционально) попытка понять GPU
  const dbg = gl.getExtension('WEBGL_debug_renderer_info')
  const rendererStr = dbg ? gl.getParameter(dbg.UNMASKED_RENDERER_WEBGL) || '' : ''

  const fps = await gpuProbe(renderer, sampleMs)

  let score = 0
  // графика
  score += webgl2 ? 2 : -1
  if (hasASTC || hasBC) score += 2
  if (hasETC2) score += 1
  if (maxTex >= 8192) score += 2
  else if (maxTex >= 4096) score += 1

  // система
  if (memGB >= 12) score += 3
  else if (memGB >= 8) score += 2
  else if (memGB >= 4) score += 1

  if (cores >= 8) score += 1

  // iOS часто скрывает память/ядра — дайте «разумную» поправку, если GPU/форматы сильные
  if (memGB === 0 && (hasASTC || maxTex >= 4096)) score += 2

  // маленький буст для Apple A-серии (если строка раскрыта)
  if (/Apple|A1[4-9]|A2[0-9]/i.test(rendererStr)) score += 1

  // DPR: штрафуем только если fps низкий
  if (dpr >= 2 && fps < 45) score -= 1

  // производительность кадра
  if (fps >= 55) score += 3
  else if (fps >= 40) score += 1
  else if (fps >= 28) score -= 1
  else score -= 2

  // сеть
  if (net === '2g' || net === 'slow-2g') score -= 2
  if (saveData) score -= 2

  // hi-DPR + ок fps = буст (поднимет iPhone 14 в high)
  if (dpr >= 3 && fps >= 50) score += 2

  if (score >= 8) return 'high'
  if (score >= 4) return 'mid'
  return 'low'
}
