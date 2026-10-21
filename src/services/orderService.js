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
    Query.limit(200), // Appwrite returns 25 by default
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

// Admin only: the latest orders of everyone (the admins team can read all orders)
export async function listAllOrders(limit = 100) {
  const res = await databases.listDocuments(DB_ID, COLLECTIONS.ORDERS, [
    Query.orderDesc('$createdAt'),
    Query.limit(limit),
  ])
  return res.documents
}

// The learner changes the status of their own order, e.g. leaving a waitlist ('cancelled').
// Allowed because each order gives update permission to its owner.
export async function updateOrderStatus(orderId, status) {
  return databases.updateDocument(DB_ID, COLLECTIONS.ORDERS, orderId, { status })
}
