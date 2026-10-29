// One config object per collection the admin manages. AdminListView reads it
// to know how to load, filter, show and delete each kind of document, so the
// five lists share ONE view instead of five copies of the same page.
//
// toRow(doc) turns an Appwrite document into what the table or card shows:
// { title, subtitle, image, cells, checklist, text, status: { label, tone } }
//
// In a table, the first column is the title, the last one the status, and
// `cells` fill the columns in between (a string, or { text, bar } for seats).

import * as courseService from '@/services/courseService'
import * as liveClassService from '@/services/liveClassService'
import * as eventService from '@/services/eventService'
import * as packageService from '@/services/packageService'
import * as teacherService from '@/services/teacherService'
import { describePackage } from '@/utils/plans'

// "Fri 23 Oct · 18:00"
export function formatDateTime(value) {
  const d = new Date(value)
  const day = d.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' })
  const time = d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })
  return `${day} · ${time}`
}

// "20 Oct"
const shortDate = (value) => new Date(value).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })

const isUpcoming = (doc) => new Date(doc.dateTime) >= new Date()

// Draft, Full or Open, for anything with seats
function seatStatus(doc) {
  if (!doc.published) return { label: 'Draft', tone: 'outline' }
  if ((doc.spotsBooked ?? 0) >= doc.capacity) return { label: 'Full', tone: 'red' }
  return { label: 'Open', tone: 'success' }
}

const publishStatus = (doc) =>
  doc.published ? { label: 'Published', tone: 'success' } : { label: 'Draft', tone: 'outline' }

// The seats cell: "6 / 8" plus a bar
const seatsCell = (doc) => ({
  text: `${doc.spotsBooked ?? 0} / ${doc.capacity}`,
  bar: Math.min(100, Math.round(((doc.spotsBooked ?? 0) / doc.capacity) * 100)),
})

const PUBLISH_FILTERS = [
  { label: 'All', test: () => true },
  { label: 'Published', test: (doc) => doc.published },
  { label: 'Draft', test: (doc) => !doc.published },
]

const DATE_FILTERS = [
  { label: 'Upcoming', test: isUpcoming },
  { label: 'Past', test: (doc) => !isUpcoming(doc) },
  { label: 'All', test: () => true },
]

export const ADMIN_COLLECTIONS = {
  courses: {
    label: 'Courses',
    singular: 'course',
    description: 'Self-paced video courses learners buy on the site.',
    view: 'table',
    list: courseService.listAllCourses,
    remove: courseService.deleteCourse,
    get: courseService.getCourseById,
    create: courseService.createCourse,
    update: courseService.updateCourse,
    filters: PUBLISH_FILTERS,
    columns: [{ label: 'Course' }, { label: 'Price', align: 'right' }, { label: 'Updated' }, { label: 'Status' }],
    toRow: (doc) => ({
      title: doc.title,
      subtitle: doc.level || 'All levels',
      image: doc.thumbnailUrl,
      cells: [`${doc.price} kr/mo`, shortDate(doc.$updatedAt)],
      status: publishStatus(doc),
    }),
    deleteMessage: () => 'The course and its lessons disappear from the site. Learners who bought it keep their order history.',
  },

  liveClasses: {
    label: 'Live classes',
    singular: 'live class',
    description: 'Friday Speaking Club sessions: one hour on video, small group, one level.',
    view: 'table',
    list: liveClassService.listAllLiveClasses,
    remove: liveClassService.deleteLiveClass,
    get: liveClassService.getLiveClassById,
    create: liveClassService.createLiveClass,
    update: liveClassService.updateLiveClass,
    filters: DATE_FILTERS,
    columns: [{ label: 'Session' }, { label: 'Date' }, { label: 'Seats' }, { label: 'Status' }],
    toRow: (doc) => ({
      title: doc.title,
      subtitle: doc.level ? `Speaking Club · ${doc.level}` : 'Speaking Club',
      cells: [formatDateTime(doc.dateTime), seatsCell(doc)],
      status: seatStatus(doc),
    }),
    deleteMessage: (doc) => bookedWarning(doc, 'session'),
  },

  events: {
    label: 'Events',
    singular: 'event',
    description: 'Meet-ups in Copenhagen, Aarhus, Esbjerg and Odense.',
    view: 'table',
    list: eventService.listAllEvents,
    remove: eventService.deleteEvent,
    get: eventService.getEventById,
    create: eventService.createEvent,
    update: eventService.updateEvent,
    filters: DATE_FILTERS,
    columns: [{ label: 'Event' }, { label: 'Date' }, { label: 'Spots' }, { label: 'Status' }],
    toRow: (doc) => ({
      title: doc.title,
      subtitle: [doc.city, doc.location].filter(Boolean).join(' · '),
      image: doc.imageUrl,
      cells: [formatDateTime(doc.dateTime), seatsCell(doc)],
      status: seatStatus(doc),
    }),
    deleteMessage: (doc) => bookedWarning(doc, 'event'),
  },

  packages: {
    label: 'Packages',
    singular: 'package',
    description: 'Monthly plans: single parts, or bundles that combine them at a lower price.',
    view: 'cards',
    list: packageService.listAllPackages,
    remove: packageService.deletePackage,
    get: packageService.getPackageById,
    create: packageService.createPackage,
    update: packageService.updatePackage,
    filters: PUBLISH_FILTERS,
    toRow: (doc) => ({
      title: doc.title,
      subtitle: `${doc.price} kr / month`,
      text: describePackage(doc),
      checklist: [
        { label: 'One course', on: Boolean(doc.includesCourse) },
        { label: 'Speaking Club', on: Boolean(doc.includesSpeakingClub) },
        { label: 'Events', on: Boolean(doc.includesEvents) },
      ],
      status: doc.published ? { label: 'Live', tone: 'success' } : { label: 'Draft', tone: 'outline' },
    }),
    deleteMessage: () => 'The plan disappears from the site and the checkout. Learners who bought it keep their order history.',
  },

  teachers: {
    label: 'Teachers',
    singular: 'teacher',
    description: 'Shown on course pages, Speaking Club groups and the About page.',
    view: 'cards',
    list: teacherService.listTeachers,
    remove: teacherService.deleteTeacher,
    get: teacherService.getTeacherById,
    create: teacherService.createTeacher,
    update: teacherService.updateTeacher,
    filters: [],
    toRow: (doc) => ({
      title: doc.name,
      subtitle: doc.city || '',
      image: doc.photoUrl,
      text: doc.specialty || doc.bio || '',
    }),
    deleteMessage: () => 'Courses, classes and events that use this teacher will show no teacher until you pick another one.',
  },
}

// "6 people have a seat. They lose it when you delete the session."
function bookedWarning(doc, noun) {
  const n = doc.spotsBooked ?? 0
  const people = n === 1 ? '1 person has' : `${n} people have`
  return n > 0
    ? `${people} a seat. The ${noun} disappears from the site and their seat with it.`
    : `Nobody has booked yet. The ${noun} disappears from the site.`
}
