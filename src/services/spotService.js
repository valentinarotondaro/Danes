// src/services/spotService.js
//
// Saves a spot in an event or live class by calling the `reserve-spot`
// Appwrite Function. The browser can't update spotsBooked itself
// (only admins can write those collections), so the server does it.

import { functions, FUNCTIONS } from './appwriteClient'

// itemType: 'event' | 'liveClass'. bundleId only when the spot comes with a package.
export async function reserveSpot(itemType, itemId, bundleId = null) {
  const execution = await functions.createExecution({
    functionId: FUNCTIONS.RESERVE_SPOT,
    body: JSON.stringify({ itemType, itemId, bundleId }),
  })
  const result = JSON.parse(execution.responseBody || '{}')
  if (execution.responseStatusCode >= 400) {
    throw new Error(result.error || 'Could not save your spot.')
  }
  return result // { status: 'confirmed', spotsBooked: 12 }
}