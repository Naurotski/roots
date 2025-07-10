import { Notify, Loading } from 'quasar'

export function showErrorMessage(errorMessage) {
  Loading.hide()
  Notify.create({
    type: 'negative',
    message: errorMessage || 'An error occurred',
    timeout: 5000, // исчезает через 5 сек
    position: 'bottom', // можно изменить на bottom, top-right и т.д.
    icon: 'error'
  })
}
