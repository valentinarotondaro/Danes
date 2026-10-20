// src/utils/cardValidation.js
//
// Checks the demo card form before we create the order. Pure function:
// it gets the values and returns the errors, so it is easy to test.
// No card is ever charged: this only makes the form behave like a real one.

export function validateCard({ name, number, expiry, cvc }, today = new Date()) {
  const errors = {}

  if (!name.trim()) errors.name = 'Write the name on the card.'

  const digits = number.replace(/\s/g, '')
  if (!/^\d{16}$/.test(digits)) errors.number = 'A card number has 16 digits.'

  const match = expiry.match(/^\s*(\d{2})\s*\/\s*(\d{2})\s*$/)
  const month = match ? Number(match[1]) : 0
  if (!match || month < 1 || month > 12) {
    errors.expiry = 'Use the format MM / YY.'
  } else {
    // A card works until the last day of its month
    const firstDayAfter = new Date(2000 + Number(match[2]), month, 1)
    if (firstDayAfter <= today) errors.expiry = 'This card has expired. Check the date.'
  }

  if (!/^\d{3}$/.test(cvc.trim())) errors.cvc = 'Write the 3 digits on the back.'

  return errors
}