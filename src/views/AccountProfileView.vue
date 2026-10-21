<script setup>
import { computed, inject, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '@/composables/useAuth'
import { useToast } from '@/composables/useToast'
import { required } from '@/utils/adminForm'
import { LEVEL_OPTIONS, CITIES } from '@/components/admin/adminOptions'
import PlanSummary from '@/components/account/PlanSummary.vue'
import StatusTag from '@/components/admin/StatusTag.vue'
import FormField from '@/components/base/FormField.vue'
import SelectField from '@/components/base/SelectField.vue'
import BaseButton from '@/components/base/BaseButton.vue'

const router = useRouter()
const { currentUser, logout } = useAuth()
const { showToast } = useToast()
const { profile, orders, plan, planUpgrade, renewsOn, packages, coursesById, liveClasses, events, saveProfile, changePassword } = inject('learner')

// ---------- Your details ----------
const details = reactive({
  name: currentUser.value?.name ?? '',
  city: profile.value?.city ?? '',
  level: profile.value?.level ?? '',
  emailFridayReminder: profile.value?.emailFridayReminder ?? true,
  emailWaitlist: profile.value?.emailWaitlist ?? true,
  emailCityEvents: profile.value?.emailCityEvents ?? false,
})
const detailsError = ref('')
const savingDetails = ref(false)

async function onSaveDetails() {
  detailsError.value = required(details.name, 'Add your name.')
  if (detailsError.value) return
  savingDetails.value = true
  try {
    await saveProfile({ ...details, city: details.city || null, level: details.level || null })
    showToast('Saved.', 'Your details are up to date.')
  } catch (err) {
    console.error(err)
    detailsError.value = 'We couldn’t save. Check your connection and try again.'
  } finally {
    savingDetails.value = false
  }
}

const EMAILS = [
  { key: 'emailFridayReminder', label: 'Remind me on Friday afternoon' },
  { key: 'emailWaitlist', label: 'Tell me when a waitlist spot opens' },
  { key: 'emailCityEvents', label: 'New events in my city' },
]

// ---------- Header ----------
const initials = computed(() => (currentUser.value?.name ?? '?').split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase())
const since = computed(() => new Date(currentUser.value?.$createdAt ?? Date.now()).toLocaleDateString('en-GB', { month: 'long', year: 'numeric' }))
const headerLine = computed(() => [`Learner since ${since.value}`, profile.value?.level, profile.value?.city].filter(Boolean).join(' · '))

// ---------- Orders ----------
const names = computed(() => ({
  bundle: Object.fromEntries(packages.value.map((d) => [d.$id, d.title])),
  course: Object.fromEntries(Object.values(coursesById.value).map((d) => [d.$id, d.title])),
  liveClass: Object.fromEntries(liveClasses.value.map((d) => [d.$id, d.title])),
  event: Object.fromEntries(events.value.map((d) => [d.$id, d.title])),
}))
const TYPE = { bundle: 'Plan', course: 'Course', liveClass: 'Speaking Club', event: 'Event' }
const STATUS = {
  confirmed: { label: 'Paid', tone: 'success' },
  waitlist: { label: 'Waitlist', tone: 'sky' },
  cancelled: { label: 'Cancelled', tone: 'outline' },
  refunded: { label: 'Refunded', tone: 'red' },
  pending: { label: 'Pending', tone: 'outline' },
}
const orderRows = computed(() =>
  orders.value.map((o) => ({
    id: o.$id,
    item: names.value[o.itemType]?.[o.itemId] ?? 'Removed item',
    meta: `${TYPE[o.itemType]} · ${new Date(o.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })} · #${o.$id.slice(-6).toUpperCase()}`,
    amount: o.amount ? `${o.amount} kr` : 'Included',
        // Sessions and events are "Booked"; courses and plans are "Paid"
    status: o.status === 'confirmed' && (o.itemType === 'event' || o.itemType === 'liveClass') ? { label: 'Booked', tone: 'success' } : STATUS[o.status] ?? { label: o.status },
  }))
)

// ---------- Password ----------
const pw = reactive({ open: false, old: '', next: '', error: '', saving: false })
async function onChangePassword() {
  pw.error = pw.next.length < 8 ? 'Use at least 8 characters.' : !pw.old ? 'Add your current password.' : ''
  if (pw.error) return
  pw.saving = true
  try {
    await changePassword(pw.next, pw.old)
    Object.assign(pw, { open: false, old: '', next: '' })
    showToast('Password changed.', 'Use the new one next time you log in.')
  } catch (err) {
    pw.error = err?.code === 401 ? 'Your current password isn’t right.' : 'We couldn’t change it. Try again.'
  } finally {
    pw.saving = false
  }
}

async function onLogout() {
  await logout()
  router.push({ name: 'home' })
}
</script>

<template>
  <div class="flex flex-col gap-12">
    <div class="flex items-center gap-5">
      <span aria-hidden="true" class="flex h-20 w-20 flex-none items-center justify-center rounded-full bg-sky text-2xl font-semibold">{{ initials }}</span>
      <div class="flex min-w-0 flex-col gap-1">
        <h1 class="text-[32px] font-semibold leading-tight sm:text-[40px]">{{ currentUser?.name }}</h1>
        <p class="text-ink-muted">{{ headerLine }}</p>
      </div>
    </div>

    <div class="flex flex-col gap-6 lg:flex-row lg:items-start">
      <form novalidate aria-labelledby="det-title" class="flex min-w-0 flex-col gap-5 rounded-ds border border-line p-6 sm:p-8 lg:flex-[3]" @submit.prevent="onSaveDetails">
        <h2 id="det-title" class="text-2xl font-semibold">Your details</h2>
        <FormField v-model="details.name" label="Name" autocomplete="name" :error="detailsError && !details.name.trim() ? detailsError : ''" />
        <div class="flex flex-col gap-2">
          <label for="p-email" class="text-sm font-semibold">Email</label>
          <input id="p-email" :value="currentUser?.email" disabled aria-describedby="p-email-msg" class="h-12 rounded-ds border border-line bg-surface-secondary px-4 text-ink-muted" />
          <span id="p-email-msg" class="text-sm text-ink-muted">This is your login. Write to contact@danes.dk to change it.</span>
        </div>
        <div class="grid gap-4 sm:grid-cols-2">
          <SelectField v-model="details.city" label="City" :options="CITIES" placeholder="Pick your city" />
          <SelectField v-model="details.level" label="Your Danish level" :options="LEVEL_OPTIONS" placeholder="Not sure yet" hint="We use it to suggest Friday groups and courses." />
        </div>
        <fieldset class="flex flex-col gap-3">
          <legend class="mb-2 text-sm font-semibold">Emails from us</legend>
          <label v-for="e in EMAILS" :key="e.key" class="flex items-center gap-3">
            <input v-model="details[e.key]" type="checkbox" class="h-[18px] w-[18px] accent-ink" />
            {{ e.label }}
          </label>
        </fieldset>
        <p v-if="detailsError && details.name.trim()" role="alert" class="text-sm text-red">{{ detailsError }}</p>
        <BaseButton type="submit" :loading="savingDetails" class="self-start sm:w-auto">Save changes</BaseButton>
      </form>

      <div class="flex min-w-0 flex-col gap-6 lg:flex-[2]">
        <PlanSummary :plan="plan" :upgrade="planUpgrade" :renews-on="renewsOn" />

        <section aria-labelledby="acc-title" class="flex flex-col gap-4 rounded-ds border border-line p-6">
          <h2 id="acc-title" class="text-2xl font-semibold">Account</h2>
          <button v-if="!pw.open" type="button" class="self-start font-semibold underline hover:text-red" @click="pw.open = true">Change password</button>
          <form v-else novalidate class="flex flex-col gap-4" @submit.prevent="onChangePassword">
            <FormField v-model="pw.old" label="Current password" type="password" autocomplete="current-password" />
            <FormField v-model="pw.next" label="New password" type="password" autocomplete="new-password" hint="At least 8 characters." />
            <p v-if="pw.error" role="alert" class="text-sm text-red">{{ pw.error }}</p>
            <div class="flex flex-wrap gap-3">
              <button type="button" class="h-12 rounded-ds border-2 border-ink px-6 font-semibold hover:bg-ink hover:text-white" @click="pw.open = false">Cancel</button>
              <BaseButton type="submit" :loading="pw.saving" class="w-auto">Change password</BaseButton>
            </div>
          </form>
          <button type="button" class="inline-flex h-12 items-center self-start rounded-ds border-2 border-ink px-6 font-semibold hover:bg-ink hover:text-white" @click="onLogout">Log out</button>
        </section>
      </div>
    </div>

    <section aria-labelledby="ord-title" class="flex flex-col gap-4">
      <h2 id="ord-title" class="text-2xl font-semibold">Orders</h2>
      <p v-if="!orderRows.length" class="rounded-ds bg-surface-secondary p-6 text-ink-muted">No orders yet.</p>
      <ul v-else class="flex flex-col divide-y divide-line rounded-ds border border-line">
        <li v-for="o in orderRows" :key="o.id" class="flex flex-wrap items-center gap-x-4 gap-y-1 px-5 py-4">
          <span class="flex min-w-0 flex-[1_1_240px] flex-col">
            <span class="font-semibold">{{ o.item }}</span>
            <span class="text-sm text-ink-muted">{{ o.meta }}</span>
          </span>
          <span class="whitespace-nowrap">{{ o.amount }}</span>
          <StatusTag v-bind="o.status" />
        </li>
      </ul>
    </section>
  </div>
</template>
