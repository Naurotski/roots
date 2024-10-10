import { Platform } from 'quasar'

export const compressImage = ({ imgSrc, imgType, translateX, translateY }) =>
  new Promise((resolve) => {
    const canvas = document.createElement('canvas')
    const img = new Image()
    img.src = imgSrc
    img.crossOrigin = 'anonymous'
    let canvasDataUrl
    img.onload = () => {
      const sideSquare = Math.min(img.width, img.height)
      const x = img.width > img.height ? img.width / 2 - img.height / 2 - translateX : 0
      const y = img.width < img.height ? img.height / 2 - img.width / 2 - translateY : 0
      canvas.width = sideSquare
      canvas.height = sideSquare
      const ctx = canvas.getContext('2d')
      ctx.drawImage(img, x, y, sideSquare, sideSquare, 0, 0, sideSquare, sideSquare)
      canvasDataUrl = canvas.toDataURL(imgType)
      let base64Data = canvasDataUrl.split(',')[1]
      let byteSize = Math.round((base64Data.length * 3) / 4096)
      if (byteSize >= 250) {
        if (Platform.is.ios) {
          canvasDataUrl = canvas.toDataURL(imgType, 0.1)
        } else {
          let quality = 150 / byteSize
          canvasDataUrl = canvas.toDataURL(imgType, quality)
        }
      }
      resolve(canvasDataUrl)
    }
  })
