// import { Platform } from 'quasar'

export const compressImage = (img, format) =>
  new Promise((resolve) => {
    img.crossOrigin = 'anonymous'
    const canvas = document.createElement('canvas')
    canvas.width = img.width - 120
    canvas.height = img.height - 320
    const ctx = canvas.getContext('2d')
    ctx.drawImage(
      img,
      0,
      320,
      img.width - 120,
      img.height - 320,
      0,
      0,
      img.width - 120,
      img.height - 320
    )
    const canvasDataUrl = canvas.toDataURL(format)
    // let canvasDataUrl
    //   let imageHeight = Math.round(240 / (img.width / img.height))
    // const size = await new Promise((resolve) => {
    //
    //   ctx.drawImage(img, 0, 0)
    //   let canvasDataUrl = canvas.toDataURL(format, 1)
    //   let base64Data = canvasDataUrl.split(',')[1]
    //   // Преобразуем в бинарные данные
    //   let binaryData = atob(base64Data)
    //   // Вычисляем размер данных
    //   let fileSize = (binaryData.length / 1024).toFixed()
    //   resolve(fileSize)
    // })
    // if (size >= 50) {
    //   if (Platform.is.android) {
    //     let quality = 150 / size
    //     canvasDataUrl = canvas.toDataURL(format, quality)
    //   } else {
    //     canvasDataUrl = canvas.toDataURL(format, 0.1)
    //   }
    // }
    resolve(canvasDataUrl)
  })
