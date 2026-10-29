// Form checks as pure functions: they return an object with one message per
// field that has a problem. An empty object means the form is valid.

export const isEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value.trim())

export function validateSignup({ name, email, password, agreed }) {
  const errors = {}
  if (name.trim().length < 2) errors.name = 'Add your first name.'
  if (!isEmail(email)) errors.email = 'Add a full email, like name@mail.com.'
  if (password.length < 8) errors.password = 'Use at least 8 characters.'
  if (!agreed) errors.agreed = 'Please accept the terms to continue.'
  return errors
}

export function validateLogin({ email, password }) {
  const errors = {}
  if (!isEmail(email)) errors.email = 'Add a full email, like name@mail.com.'
  if (!password) errors.password = 'Add your password.'
  return errors
}