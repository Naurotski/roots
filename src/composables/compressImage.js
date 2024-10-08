// import { Platform } from 'quasar'

export const compressImage = ({ imgSrc, translateX, translateY }) =>
  new Promise((resolve) => {
    console.log('compressImage --------', imgSrc, translateX, translateY)
    const canvas = document.createElement('canvas')
    const img = new Image()
    img.src = imgSrc
    img.crossOrigin = 'anonymous'
    img.onload = () => {
      console.log(img.height, img.width)
      const sideSquare = Math.min(img.width, img.height)
      const x = img.width > img.height ? img.width / 2 - img.height / 2 - translateX : 0
      const y = img.width < img.height ? img.height / 2 - img.width / 2 - translateY : 0
      canvas.width = sideSquare
      canvas.height = sideSquare
      console.log('x -----', x, 'y----', y, 'sideSquare ---', sideSquare)
      const ctx = canvas.getContext('2d')
      ctx.drawImage(img, x, y, sideSquare, sideSquare, 0, 0, sideSquare, sideSquare)
      const canvasDataUrl = canvas.toDataURL('image/jpeg')
      resolve(canvasDataUrl)
    }
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

  })
