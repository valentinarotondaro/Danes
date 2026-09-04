// src/services/teacherService.js
import { ID } from 'appwrite'
import { databases, DB_ID, COLLECTIONS } from './appwriteClient'

export async function listTeachers() {
  const res = await databases.listDocuments(DB_ID, COLLECTIONS.TEACHERS)
  return res.documents
}

export async function getTeacherById(id) {
  return databases.getDocument(DB_ID, COLLECTIONS.TEACHERS, id)
}

export async function createTeacher(data) {
  return databases.createDocument(DB_ID, COLLECTIONS.TEACHERS, ID.unique(), data)
}

export async function updateTeacher(id, data) {
  return databases.updateDocument(DB_ID, COLLECTIONS.TEACHERS, id, data)
}

export async function deleteTeacher(id) {
  return databases.deleteDocument(DB_ID, COLLECTIONS.TEACHERS, id)
}
