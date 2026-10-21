// src/composables/useLearner.js
//
// All the data of "My account", loaded once by AccountLayout and shared with
// the four tabs through provide/inject. The rules (what the plan costs, how
// far a course is…) live in utils/learner.js; this file loads and saves.

import { computed, ref } from 'vue'
import { useAuth } from '@/composables/useAuth'
import * as orderService from '@/services/orderService'
import * as profileService from '@/services/profileService'
import * as authService from '@/services/authService'
import * as courseService from '@/services/courseService'
import * as lessonService from '@/services/lessonService'
import * as progressService from '@/services/progressService'
import * as packageService from '@/services/packageService'
import * as teacherService from '@/services/teacherService'
import * as liveClassService from '@/services/liveClassService'
import * as eventService from '@/services/eventService'
import { cancelSpot } from '@/services/spotService'
import { planFromOrders, cheaperPackage, courseProgress, wordsLearned, splitByTime, nextRenewal } from '@/utils/learner'

const byId = (docs) => Object.fromEntries(docs.map((d) => [d.$id, d]))

// Published list + anything the learner has that isn't in it (e.g. unpublished later)
async function withOwned(list, ownedIds, getById) {
  const known = byId(list)
  const missing = ownedIds.filter((id) => !known[id])
  const extra = await Promise.all(missing.map((id) => getById(id).catch(() => null)))
  return [...list, ...extra.filter(Boolean)]
}

export function useLearner() {
  const { currentUser, refreshUser } = useAuth()

  const orders = ref([])
  const profile = ref(null)
  const packages = ref([])
  const courses = ref([])
  const teachers = ref([])
  const liveClasses = ref([])
  const events = ref([])
  const lessonsByCourse = ref({}) // { courseId: [lessons] }
  const doneIds = ref(new Set())
  const loading = ref(true)
  const error = ref('')

  const userId = () => currentUser.value.$id
  const active = (o) => o.status === 'confirmed' || o.status === 'waitlist'
  const idsOf = (type) => [...new Set(orders.value.filter((o) => o.itemType === type && active(o)).map((o) => o.itemId))]

  async function load() {
    loading.value = true
    error.value = ''
    try {
      const [orderDocs, profileDoc, packageDocs, courseDocs, teacherDocs, classDocs, eventDocs] = await Promise.all([
        orderService.listOrdersForUser(userId()),
        profileService.getProfileByUserId(userId()).catch(() => null),
        packageService.listAllPackages(),
        courseService.listPublishedCourses(),
        teacherService.listTeachers().catch(() => []),
        liveClassService.listPublishedLiveClasses(),
        eventService.listPublishedEvents(),
      ])
      orders.value = orderDocs
      profile.value = profileDoc
      packages.value = packageDocs
      teachers.value = teacherDocs

      // Add what the learner booked but isn't in the public lists any more
      ;[courses.value, liveClasses.value, events.value] = await Promise.all([
        withOwned(courseDocs, idsOf('course'), courseService.getCourseById),
        withOwned(classDocs, idsOf('liveClass'), liveClassService.getLiveClassById),
        withOwned(eventDocs, idsOf('event'), eventService.getEventById),
      ])

      // Lessons and progress of every course the learner has
      const owned = myCourseIds.value
      const [lessonLists, progressLists] = await Promise.all([
        Promise.all(owned.map((id) => lessonService.listLessonsByCourse(id).catch(() => []))),
        Promise.all(owned.map((id) => progressService.listProgressForCourse(userId(), id).catch(() => []))),
      ])
      lessonsByCourse.value = Object.fromEntries(owned.map((id, i) => [id, lessonLists[i]]))
      doneIds.value = new Set(progressLists.flat().filter((r) => r.done).map((r) => r.lessonId))
    } catch (err) {
      console.error(err)
      error.value = 'We couldn’t load your account.'
    } finally {
      loading.value = false
    }
  }

  // ---------- What the tabs show ----------

  const teachersById = computed(() => byId(teachers.value))
  const coursesById = computed(() => byId(courses.value))
  const myCourseIds = computed(() => orders.value.filter((o) => o.itemType === 'course' && o.status === 'confirmed').map((o) => o.itemId).filter((id, i, all) => all.indexOf(id) === i))

  // My courses, each with its progress and teacher
  const myCourses = computed(() =>
    myCourseIds.value
      .map((id) => coursesById.value[id])
      .filter(Boolean)
      .map((course) => ({
        course,
        teacher: teachersById.value[course.teacherId] ?? null,
        progress: courseProgress(lessonsByCourse.value[course.$id] ?? [], doneIds.value),
      }))
  )
  // Not finished yet. The ones you started come first, courses without lessons last.
  const rank = (c) => (c.progress.done > 0 ? 0 : c.progress.total > 0 ? 1 : 2)
  const inProgress = computed(() => myCourses.value.filter((c) => !c.progress.finished).sort((a, b) => rank(a) - rank(b)))
  const finished = computed(() => myCourses.value.filter((c) => c.progress.finished))
  const notMine = computed(() => courses.value.filter((c) => c.published && !myCourseIds.value.includes(c.$id)))

  const allLessons = computed(() => Object.values(lessonsByCourse.value).flat())
  const words = computed(() => wordsLearned(allLessons.value, doneIds.value))

  // Sessions and events the learner booked or waits for, with the order behind each
  function booked(type, docs) {
    const docsById = byId(docs)
    const latest = {}
    for (const o of orders.value.filter((o) => o.itemType === type && active(o))) latest[o.itemId] ??= o // orders are newest first
    return Object.values(latest)
      .filter((o) => docsById[o.itemId])
      .map((o) => ({ ...docsById[o.itemId], kind: type, order: o, status: o.status, host: teachersById.value[docsById[o.itemId].teacherId] ?? null }))
  }
  const myClasses = computed(() => splitByTime(booked('liveClass', liveClasses.value)))
  const myEvents = computed(() => splitByTime(booked('event', events.value)))

  // Next Friday sessions at the learner's level they haven't booked yet
  const openClasses = computed(() => {
    const bookedIds = new Set(myClasses.value.upcoming.map((c) => c.$id))
    const level = profile.value?.level
    return splitByTime(liveClasses.value).upcoming
      .filter((c) => !bookedIds.has(c.$id) && (!level || !c.level || c.level === level))
      .slice(0, 3)
      .map((c) => ({ ...c, host: teachersById.value[c.teacherId] ?? null }))
  })

  const plan = computed(() => planFromOrders(orders.value, byId(packages.value), coursesById.value))
  const planUpgrade = computed(() => cheaperPackage(plan.value, packages.value))
  const renewsOn = computed(() => {
    const first = plan.value.items.map((i) => i.order.createdAt).sort()[0]
    return first ? nextRenewal(first) : null
  })
  const hasEvents = computed(() => plan.value.items.some((i) => i.pkg.includesEvents))

  // ---------- Actions ----------

  // Give back a seat (Speaking Club) or a spot (event): the server function does -1
  async function cancelBooking(item, itemType) {
    await cancelSpot(itemType, item.$id)
    orders.value = orders.value.map((o) => (o.$id === item.order.$id ? { ...o, status: 'cancelled' } : o))
    const list = itemType === 'event' ? events : liveClasses
    list.value = list.value.map((d) => (d.$id === item.$id ? { ...d, spotsBooked: Math.max(0, (d.spotsBooked ?? 1) - 1) } : d))
  }

  async function leaveWaitlist(item) {
    await orderService.updateOrderStatus(item.order.$id, 'cancelled')
    orders.value = orders.value.map((o) => (o.$id === item.order.$id ? { ...o, status: 'cancelled' } : o))
  }

  // Name lives on the Appwrite account; city, level and emails on the profile document
  async function saveProfile({ name, ...fields }) {
    if (name.trim() && name.trim() !== currentUser.value.name) {
      await authService.updateName(name.trim())
      await refreshUser()
    }
    profile.value = profile.value
      ? await profileService.updateProfile(profile.value.$id, { name: name.trim(), ...fields })
      : await profileService.createProfile(userId(), name.trim(), currentUser.value.email, fields)
  }

  const changePassword = (newPassword, oldPassword) => authService.updatePassword(newPassword, oldPassword)

  return {
    loading, error, load,
    orders, profile, packages, courses, coursesById, teachersById, liveClasses, events,
    myCourses, inProgress, finished, notMine, words, doneIds,
    myClasses, myEvents, openClasses,
    plan, planUpgrade, renewsOn, hasEvents,
    cancelBooking, leaveWaitlist, saveProfile, changePassword,
  }
}
