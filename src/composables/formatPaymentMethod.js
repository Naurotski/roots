import { i18n } from 'boot/i18n'

export const formatPaymentMethod = (pm) => {
  if (!pm) {
    return {
      label: i18n.global.t('subscription.noMethod'),
      icon: 'credit_card_off',
      color: 'grey',
      noMethod: true
    }
  }
  switch (pm.type) {
    case 'card':
      return {
        label: `${pm.card.brand.toUpperCase()} •••• ${pm.card.last4}`,
        icon: getCardIcon(pm.card.brand),
        color: 'blue'
      }
    case 'sepa_debit':
      return {
        label: `IBAN ••••${pm.sepa_debit.last4} (${pm.sepa_debit.country})`,
        icon: 'account_balance',
        color: 'teal'
      }
    case 'us_bank_account':
      return {
        label: `${pm.us_bank_account.bank_name} ••••${pm.us_bank_account.last4} (${pm.us_bank_account.account_type})`,
        icon: 'account_balance',
        color: 'green'
      }
    case 'bacs_debit':
      return {
        label: `UK Bank ••••${pm.bacs_debit.last4} (Sort Code ${pm.bacs_debit.sort_code})`,
        icon: 'account_balance',
        color: 'purple'
      }
    case 'paypal':
      return {
        label: `PayPal ${pm.paypal.payer_email}`,
        icon: 'mdi-paypal', // если используешь @quasar/extras/mdi-v6
        color: 'deep-orange'
      }
    default:
      return {
        label: `Метод оплаты: ${pm.type}`,
        icon: 'payment',
        color: 'grey'
      }
  }
}

const getCardIcon = (brand) => {
  switch (brand.toLowerCase()) {
    case 'visa':
      return 'fa-brands fa-cc-visa'
    case 'mastercard':
      return 'fa-brands fa-cc-mastercard'
    case 'amex':
      return 'fa-brands fa-cc-amex'
    case 'discover':
      return 'fa-brands fa-cc-discover'
    default:
      return 'fa-solid fa-credit-card'
  }
}
