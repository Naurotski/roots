//  не используется, исполльзовался в ThankYouPage
import { i18n } from 'boot/i18n.js'
export function findWork(allWorks, workId) {
  if (allWorks.value.length) {
    let localData = allWorks.value.find((item) => String(item.id) === workId.value)
    if (i18n.global.locale.value === 'it') {
      return {
        ...localData,
        description: localData.descriptionIt,
        materials: localData.materialsIt,
        name: localData.nameIt
      }
    } else {
      return { ...localData }
    }
  } else {
    return null
  }
}
