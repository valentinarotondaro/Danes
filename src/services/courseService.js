import { ID, Query } from 'appwrite'
import { databases, DB_ID, COLLECTIONS } from './appwriteClient'

export async function listPublishedCourses() {
  const res = await databases.listDocuments(DB_ID, COLLECTIONS.COURSES, [
    Query.equal('published', true),
    Query.orderDesc('$createdAt'),
    Query.limit(100), // Appwrite returns 25 by default
  ])
  return res.documents
}

export async function getCourseById(courseId) {
  return databases.getDocument(DB_ID, COLLECTIONS.COURSES, courseId)
}

export async function listAllCourses() {
  // Admin view — includes unpublished drafts.
  const res = await databases.listDocuments(DB_ID, COLLECTIONS.COURSES, [
    Query.orderDesc('$createdAt'),
    Query.limit(100), // Appwrite returns 25 by default
  ])
  return res.documents
}

export async function createCourse(data) {
  return databases.createDocument(DB_ID, COLLECTIONS.COURSES, ID.unique(), data)
}

export async function updateCourse(courseId, data) {
  return databases.updateDocument(DB_ID, COLLECTIONS.COURSES, courseId, data)
}

export async function deleteCourse(courseId) {
  // Appwrite has no cascading delete, so remove the course's lessons first
  const orphaned = await databases.listDocuments(DB_ID, COLLECTIONS.LESSONS, [
    Query.equal('courseId', courseId),
    Query.limit(100), // Appwrite returns 25 by default
  ])
  await Promise.all(
    orphaned.documents.map((lesson) =>
      databases.deleteDocument(DB_ID, COLLECTIONS.LESSONS, lesson.$id)
    )
  )
  return databases.deleteDocument(DB_ID, COLLECTIONS.COURSES, courseId)
}
