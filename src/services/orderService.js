// src/services/orderService.js
import { ID, Permission, Role, Query } from 'appwrite'
import { databases, DB_ID, COLLECTIONS } from './appwriteClient'

// status defaults to 'confirmed' (= paid). Pass 'waitlist' to join a waitlist.
export async function createOrder(userId, itemType, itemId, amount, status = 'confirmed') {
  return databases.createDocument(
    DB_ID,
    COLLECTIONS.ORDERS,
    ID.unique(),
    {
      userId,
      itemType,
      itemId,
      amount,
      status,
      createdAt: new Date().toISOString(),
    },
    [Permission.read(Role.user(userId)), Permission.update(Role.user(userId))]
  )
}

export async function hasConfirmedOrder(userId, itemType, itemId) {
  const res = await databases.listDocuments(DB_ID, COLLECTIONS.ORDERS, [
    Query.equal('userId', userId),
    Query.equal('itemType', itemType),
    Query.equal('itemId', itemId),
    Query.equal('status', 'confirmed'),
    Query.limit(1),
  ])
  return res.total > 0
}

export async function listOrdersForUser(userId) {
  const res = await databases.listDocuments(DB_ID, COLLECTIONS.ORDERS, [
    Query.equal('userId', userId),
    Query.orderDesc('$createdAt'),
  ])
  return res.documents
}
// Latest order status for one item, or null if the user has none.
// Used for events: 'confirmed' = going, 'waitlist' = waiting for a spot.
export async function getOrderStatus(userId, itemType, itemId) {
  const res = await databases.listDocuments(DB_ID, COLLECTIONS.ORDERS, [
    Query.equal('userId', userId),
    Query.equal('itemType', itemType),
    Query.equal('itemId', itemId),
    Query.notEqual('status', 'cancelled'),
    Query.orderDesc('$createdAt'),
    Query.limit(1),
  ])
  return res.documents[0]?.status ?? null
}
