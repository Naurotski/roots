// import { Platform } from 'quasar'

export const compressImage = ({ imgSrc, imgType, translateX, translateY }) =>
  new Promise((resolve) => {
    console.log('compressImage --------', imgSrc, imgType, translateX, translateY)
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
      const canvasDataUrl = canvas.toDataURL(imgType)
      resolve(canvasDataUrl)
    }
  })
