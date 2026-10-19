// functions/reserve-spot/src/main.js
//
// Runs on Appwrite's server, not in the browser. Learners can't write to
// `events` or `liveClasses` (only admins can), so the browser asks this
// function to save or give back a spot. The function checks everything
// itself and then writes with a server key the learner never sees.
//
// Body: { itemType, itemId, bundleId?, action? }  action: 'reserve' (default) | 'cancel'

import { Client, Databases, ID, Permission, Query, Role } from 'node-appwrite'

const COLLECTION_FOR = { event: 'events', liveClass: 'liveClasses' }

function readBody(req) {
  try {
    return JSON.parse(req.bodyText || '{}')
  } catch {
    return {}
  }
}

export default async ({ req, res, error }) => {
  // Appwrite adds this header only when a logged-in user calls the function
  const userId = req.headers['x-appwrite-user-id']
  if (!userId) return res.json({ error: 'Please log in first.' }, 401)

  const { itemType, itemId, bundleId, action = 'reserve' } = readBody(req)
  const collectionId = COLLECTION_FOR[itemType]
  if (!collectionId || !itemId) return res.json({ error: 'Unknown event or class.' }, 400)

  // Short-lived key Appwrite creates for each execution (scopes set in the function settings)
  const client = new Client()
    .setEndpoint(process.env.APPWRITE_FUNCTION_API_ENDPOINT)
    .setProject(process.env.APPWRITE_FUNCTION_PROJECT_ID)
    .setKey(req.headers['x-appwrite-key'])
  const databases = new Databases(client)
  const DB_ID = process.env.APPWRITE_DATABASE_ID

  // The user's confirmed order for one item, or null
  const findOrder = async (type, id) => {
    const found = await databases.listDocuments(DB_ID, 'orders', [
      Query.equal('userId', userId),
      Query.equal('itemType', type),
      Query.equal('itemId', id),
      Query.equal('status', 'confirmed'),
      Query.limit(1),
    ])
    return found.documents[0] ?? null
  }

  try {
    const item = await databases.getDocument(DB_ID, collectionId, itemId)

    // --- Cancel: give the spot back ---
    if (action === 'cancel') {
      const order = await findOrder(itemType, itemId)
      if (!order) return res.json({ error: 'You don’t have a seat to cancel.' }, 404)
      if (new Date(item.dateTime) <= new Date()) {
        return res.json({ error: 'It has already started, so the seat can’t be cancelled.' }, 409)
      }

      await databases.updateDocument(DB_ID, 'orders', order.$id, { status: 'cancelled' })
      // -1 in a single step; `min: 0` stops it from going below zero
      const updated = await databases.decrementDocumentAttribute({
        databaseId: DB_ID, collectionId, documentId: itemId, attribute: 'spotsBooked', value: 1, min: 0,
      })
      return res.json({ status: 'cancelled', spotsBooked: updated.spotsBooked })
    }

    // --- Reserve ---
    if (!item.published) return res.json({ error: 'This is not open for booking.' }, 404)

    // Clicking twice must not take two spots
    if (await findOrder(itemType, itemId)) {
      return res.json({ status: 'confirmed', spotsBooked: item.spotsBooked ?? 0 })
    }

    // Free if it comes with a package the user really bought, otherwise its own price
    let amount = item.price ?? 0
    if (bundleId) {
      const bundle = await databases.getDocument(DB_ID, 'bundles', bundleId)
      const included = bundle[`${itemType}Id`] === itemId
      if (!included || !(await findOrder('bundle', bundleId))) {
        return res.json({ error: 'This package does not include that item.' }, 403)
      }
      amount = 0
    }

    // +1 in a single step on the server. `max` makes Appwrite refuse it
    // when it would go over capacity, so two people can't take the last spot.
    let updated
    try {
      updated = await databases.incrementDocumentAttribute({
        databaseId: DB_ID,
        collectionId,
        documentId: itemId,
        attribute: 'spotsBooked',
        value: 1,
        max: item.capacity,
      })
    } catch {
      return res.json({ error: 'Sorry, it’s fully booked.' }, 409)
    }

    try {
      await databases.createDocument(
        DB_ID,
        'orders',
        ID.unique(),
        { userId, itemType, itemId, amount, status: 'confirmed', createdAt: new Date().toISOString() },
        [Permission.read(Role.user(userId)), Permission.update(Role.user(userId))]
      )
    } catch (err) {
      // The order failed: give the spot back so the count stays right
      await databases.decrementDocumentAttribute({
        databaseId: DB_ID, collectionId, documentId: itemId, attribute: 'spotsBooked', value: 1, min: 0,
      })
      throw err
    }

    return res.json({ status: 'confirmed', spotsBooked: updated.spotsBooked })
  } catch (err) {
    error(err.message)
    return res.json({ error: 'Something went wrong. Please try again.' }, 500)
  }
}