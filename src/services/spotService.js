// Saves or gives back a spot in an event or live class by calling the
// `reserve-spot` Appwrite Function. The browser can't update spotsBooked
// itself (only admins can write those collections), so the server does it.

import { functions, FUNCTIONS } from './appwriteClient'

async function callSpotFunction(body, fallbackMessage) {
  const execution = await functions.createExecution({
    functionId: FUNCTIONS.RESERVE_SPOT,
    body: JSON.stringify(body),
  })
  const result = JSON.parse(execution.responseBody || '{}')
  if (execution.responseStatusCode >= 400) {
    throw new Error(result.error || fallbackMessage)
  }
  return result // { status, spotsBooked }
}

// itemType: 'event' | 'liveClass'. bundleId only when the spot comes with a package.
export function reserveSpot(itemType, itemId, bundleId = null) {
  return callSpotFunction({ itemType, itemId, bundleId }, 'Could not save your spot.')
}

export function cancelSpot(itemType, itemId) {
  return callSpotFunction({ itemType, itemId, action: 'cancel' }, 'Could not cancel your seat.')
}