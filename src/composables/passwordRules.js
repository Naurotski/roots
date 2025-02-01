export const passwordRules = [
  (val) => !!val || 'Password is required',
  (val) => val.length >= 8 || 'Minimum 8 characters',
  (val) => val.length <= 30 || 'Maximum 30 characters',
  (val) => /[A-Z]/.test(val) || 'At least one uppercase letter',
  (val) => /[0-9]/.test(val) || 'At least one number',
  (val) => /[!@#$%^&*]/.test(val) || 'At least one special character (!@#$%^&*)'
]
