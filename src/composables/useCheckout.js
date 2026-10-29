// The logic behind the checkout page: load the packages and courses, keep
// track of what the learner picked, check the demo card and create the order.
// CheckoutView only shows this state, it doesn't talk to Appwrite itself.

import { computed, reactive, ref } from 'vue'
import { useOrders } from '@/composables/useOrders'
import * as packageService from '@/services/packageService'
import * as courseService from '@/services/courseService'
import { validateCard } from '@/utils/cardValidation'
import { partsOf, separatePrice } from '@/utils/plans'

// start: { plan: 'Starter' } from the plan cards, or { packageId } from a package page
export function useCheckout(start = {}) {
  const { purchasing, purchaseBundle } = useOrders()

  const packages = ref([])
  const courses = ref([])
  const selectedId = ref(null)
  const courseId = ref(null)
  const card = reactive({ name: '', number: '', expiry: '', cvc: '' })

  const loading = ref(true)
  const loadError = ref('')
  const errors = ref({})
  const payError = ref('')
  const order = ref(null) // set when the payment worked

  const selected = computed(() => packages.value.find((p) => p.$id === selectedId.value) ?? null)
  const course = computed(() => courses.value.find((c) => c.$id === courseId.value) ?? null)
  const needsCourse = computed(() => Boolean(selected.value?.includesCourse))
  const fullPrice = computed(() => (selected.value ? separatePrice(selected.value, packages.value) : 0))
    const savings = computed(() => (selected.value ? savingsFor(selected.value) : 0))

  // Two groups for the plan picker: packages (2+ parts) and single plans (1 part)
  const combos = computed(() => packages.value.filter((p) => partsOf(p).length > 1))
  const singles = computed(() => packages.value.filter((p) => partsOf(p).length === 1))

  // How much a package saves compared with buying its parts one by one
  function savingsFor(pkg) {
    return Math.max(0, separatePrice(pkg, packages.value) - pkg.price)
  }

  function findStartPackage(list) {
    const plan = start.plan?.toLowerCase()
    return (
      list.find((p) => p.$id === start.packageId) ??
      list.find((p) => p.title.toLowerCase() === plan) ??
      list[0]
    )
  }

  async function load() {
    loading.value = true
    loadError.value = ''
    try {
      const [packageList, courseList] = await Promise.all([
        packageService.listPublishedPackages(),
        courseService.listPublishedCourses(),
      ])
      packages.value = packageList
      courses.value = courseList
      selectedId.value = findStartPackage(packageList)?.$id ?? null
      courseId.value = courseList[0]?.$id ?? null
    } catch {
      loadError.value = 'We couldn’t load the plans. Check your connection and try again.'
    } finally {
      loading.value = false
    }
  }

  async function pay() {
    payError.value = ''
    errors.value = validateCard(card)
    if (needsCourse.value && !course.value) errors.value.course = 'Pick the course for your plan.'
    if (Object.keys(errors.value).length) return

    try {
      order.value = await purchaseBundle(selected.value, needsCourse.value ? course.value.$id : null)
    } catch (err) {
      payError.value = err.message || 'The payment didn’t go through. Try again.'
    }
  }

  return {
    packages, combos, singles, courses, selectedId, courseId, card,
    selected, course, needsCourse, fullPrice, savings,
    loading, loadError, errors, payError, order, purchasing,
    load, pay, savingsFor,
  }
}