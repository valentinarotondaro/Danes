import { ID, Query } from 'appwrite'
import { databases, DB_ID, COLLECTIONS } from './appwriteClient'

export async function listLessonsByCourse(courseId) {
  const res = await databases.listDocuments(DB_ID, COLLECTIONS.LESSONS, [
    Query.equal('courseId', courseId),
    Query.orderAsc('order'),
    Query.limit(100), // Appwrite returns 25 by default
  ])
  return res.documents
}

export async function createLesson(data) {
  return databases.createDocument(DB_ID, COLLECTIONS.LESSONS, ID.unique(), data)
}

export async function updateLesson(lessonId, data) {
  return databases.updateDocument(DB_ID, COLLECTIONS.LESSONS, lessonId, data)
}

export async function deleteLesson(lessonId) {
  return databases.deleteDocument(DB_ID, COLLECTIONS.LESSONS, lessonId)
}
