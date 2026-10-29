// lessonProgress: one row per learner per lesson. `done` drives the ✓ marks
// and the course progress bar. Each row is readable and editable only by its owner.

import { ID, Permission, Role, Query } from 'appwrite'
import { databases, DB_ID, COLLECTIONS } from './appwriteClient'

// All the rows of one learner in one course (that's why courseId is copied into each row)
export async function listProgressForCourse(userId, courseId) {
  const res = await databases.listDocuments(DB_ID, COLLECTIONS.LESSON_PROGRESS, [
    Query.equal('userId', userId),
    Query.equal('courseId', courseId),
    Query.limit(200),
  ])
  return res.documents
}

// Create the row the first time, update it after that ("upsert")
export async function setLessonDone(userId, lesson, done, existingRow = null) {
  if (existingRow) {
    return databases.updateDocument(DB_ID, COLLECTIONS.LESSON_PROGRESS, existingRow.$id, { done })
  }
  return databases.createDocument(
    DB_ID,
    COLLECTIONS.LESSON_PROGRESS,
    ID.unique(),
    { userId, lessonId: lesson.$id, courseId: lesson.courseId, done },
    [Permission.read(Role.user(userId)), Permission.update(Role.user(userId))]
  )
}
