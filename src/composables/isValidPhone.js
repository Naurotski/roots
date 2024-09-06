export const isValidPhone = (phone) => {
  const phoneRegExp =
    /^\+?[0-9]{1,4}?[-.\s]?(\(?\d{1,3}?\)?[-.\s]?)?\d{1,4}[-.\s]?\d{1,4}[-.\s]?\d{1,9}$/
  return phoneRegExp.test(phone)
}
