// Turns Appwrite's technical errors into messages people understand.
// Appwrite sends a number (code) and a short name (type) with each error.

export function loginErrorMessage(err) {
  if (err?.code === 429) return 'Too many tries. Wait a minute and try again.'
  if (err?.code === 401) return 'Check your email and password and try again.'
  return 'Something went wrong. Check your connection and try again.'
}

// Returns { field, message }: field says which input to mark (or null for the banner)
export function signupErrorMessage(err) {
  if (err?.code === 409) return { field: 'email', message: 'An account with this email already exists. Log in instead.' }
  if (err?.code === 400 && /password/i.test(err.message ?? '')) {
    return { field: 'password', message: 'Choose a stronger password: at least 8 characters, not a common word.' }
  }
  if (err?.code === 429) return { field: null, message: 'Too many tries. Wait a minute and try again.' }
  return { field: null, message: 'We couldn’t create your account. Check your connection and try again.' }
}