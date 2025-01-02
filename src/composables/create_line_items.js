import { i18n } from 'boot/i18n.js'

export const createLineItems = (listItems) => {
  const description = (item) => {
    if (i18n.global.locale.value === 'it') {
      return item.descriptionIt.length < 200
        ? item.descriptionIt
        : `${item.descriptionIt?.substring(0, 200)}...`
    } else {
      return item.description.length < 200
        ? item.description
        : `${item.description?.substring(0, 200)}...`
    }
  }
  const images = (item) => {
    console.log(item)
    if (String(item.id).includes('-')) {
      return [
        item.urlImage || item.urlImageWork,
        ...(item.urlSecondImages || item.urlSecondImagesWork || []).map((item) => item.url)
      ].splice(0, 5)
    } else {
      return [item.urlImageWork, ...(item.urlSecondImagesWork || [])].splice(0, 5)
    }
  }
  return listItems.map((item) => {
    return {
      quantity: item.quantityCart || 1,
      price_data: {
        currency: 'eur',
        unit_amount: item.price * 100,
        product_data: {
          name: i18n.global.locale.value === 'it' ? item.nameIt : item.name,
          description: description(item),
          images: images(item),
          metadata: {
            workIndex: item.index ?? null,
            id: item.id,
            artistId: item.artistId || null,
            rubric: item.rubric,
            artistName: item.artistName || null
          }
        }
      }
    }
  })
}
