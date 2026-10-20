<script setup>
import { computed, onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import { useAuth } from '@/composables/useAuth'
import { useAdminDashboard } from '@/composables/useAdminDashboard'
import { formatDateTime } from '@/components/admin/adminCollections'
import StatusTag from '@/components/admin/StatusTag.vue'
import LoadingState from '@/components/base/LoadingState.vue'
import ErrorState from '@/components/base/ErrorState.vue'

const { currentUser } = useAuth()
const { loading, error, numbers, attention, upcoming, recentOrders, load } = useAdminDashboard()

const firstName = computed(() => currentUser.value?.name?.split(' ')[0] ?? '')
const hour = new Date().getHours()
const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening'
const today = new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' })
const month = new Date().toLocaleDateString('en-GB', { month: 'long' })

const kpis = computed(() => [
  { label: 'Paying learners', value: numbers.value.payingLearners, note: 'With at least one paid order' },
  { label: `Revenue, ${month}`, value: `${numbers.value.revenue.toLocaleString('en-GB')} kr`, note: 'Paid orders this month' },
  { label: `Orders, ${month}`, value: numbers.value.ordersThisMonth, note: `${numbers.value.ordersToday} today` },
  { label: 'Friday seats, next 7 days', value: `${numbers.value.seatsBooked} / ${numbers.value.seatsTotal}`, note: `${numbers.value.groupsThisWeek} groups` },
])

const TYPE = { course: 'Course', liveClass: 'Live class', event: 'Event', bundle: 'Package' }
const ORDER_STATUS = {
  confirmed: { label: 'Paid', tone: 'success' },
  pending: { label: 'Pending', tone: 'outline' },
  waitlist: { label: 'Waitlist', tone: 'sky' },
  refunded: { label: 'Refunded', tone: 'red' },
  cancelled: { label: 'Cancelled', tone: 'outline' },
}
const seatsPct = (doc) => Math.min(100, Math.round(((doc.spotsBooked ?? 0) / doc.capacity) * 100))
const editTo = (to) => ({ name: 'admin-edit', params: to })

onMounted(load)
</script>

<template>
  <div class="flex flex-col gap-8">
    <div class="flex flex-wrap items-end gap-4">
      <div class="flex min-w-0 flex-[1_1_360px] flex-col gap-1">
        <span class="text-sm text-ink-muted">{{ today }}</span>
        <h1 class="text-[32px] font-semibold leading-tight">{{ greeting }}<template v-if="firstName">, {{ firstName }}</template></h1>
        <p class="text-ink-muted">Here’s what’s happening across DANES.</p>
      </div>
      <div class="flex flex-wrap gap-3">
        <RouterLink :to="editTo({ collection: 'events', id: 'new' })" class="inline-flex h-12 items-center rounded-ds border-2 border-ink px-6 font-semibold text-ink no-underline hover:bg-ink hover:text-white">New event</RouterLink>
        <RouterLink :to="editTo({ collection: 'courses', id: 'new' })" class="inline-flex h-12 items-center rounded-ds bg-red px-6 font-semibold text-white no-underline hover:bg-red-hover">New course</RouterLink>
      </div>
    </div>

    <LoadingState v-if="loading" :rows="4" label="Loading the dashboard" />
    <ErrorState v-else-if="error" :title="error" @retry="load" />

    <template v-else>
      <section aria-label="Key numbers" class="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div v-for="k in kpis" :key="k.label" class="flex flex-col gap-1 rounded-ds bg-surface-secondary p-5">
          <span class="text-sm text-ink-muted">{{ k.label }}</span>
          <span class="text-[32px] font-semibold leading-tight">{{ k.value }}</span>
          <span class="text-sm text-ink-muted">{{ k.note }}</span>
        </div>
      </section>

      <div class="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <section aria-labelledby="attn-title" class="flex flex-col gap-4 rounded-ds border border-line p-6">
          <div class="flex items-center gap-3">
            <h2 id="attn-title" class="text-2xl font-semibold">Needs attention</h2>
            <StatusTag v-if="attention.length" :label="String(attention.length)" tone="red" />
          </div>
          <p v-if="!attention.length" class="text-ink-muted">All good. Nothing is full, missing or waiting.</p>
          <div v-for="item in attention.slice(0, 4)" :key="item.title" class="flex items-center gap-4 rounded-ds p-4" :class="item.tone === 'red' ? 'bg-red-soft' : 'bg-sky-soft'">
            <span class="flex min-w-0 flex-1 flex-col">
              <span class="font-semibold">{{ item.title }}</span>
              <span class="text-sm text-ink-muted">{{ item.meta }}</span>
            </span>
            <RouterLink :to="editTo(item.to)" class="inline-flex h-10 flex-none items-center rounded-ds border-2 border-ink bg-white px-4 text-sm font-semibold text-ink no-underline hover:bg-ink hover:text-white">{{ item.action }}</RouterLink>
          </div>
        </section>

        <section aria-labelledby="up-title" class="flex flex-col gap-4 rounded-ds border border-line p-6">
          <h2 id="up-title" class="text-2xl font-semibold">Coming up</h2>
          <p v-if="!upcoming.length" class="text-ink-muted">Nothing planned yet.</p>
          <RouterLink
            v-for="doc in upcoming"
            :key="doc.$id"
            :to="editTo({ collection: doc.kind === 'event' ? 'events' : 'liveClasses', id: doc.$id })"
            class="flex items-center gap-4 text-ink no-underline hover:text-red"
          >
            <span class="flex h-14 w-14 flex-none flex-col items-center justify-center rounded-ds bg-sky">
              <span class="text-xs font-semibold uppercase">{{ new Date(doc.dateTime).toLocaleDateString('en-GB', { month: 'short' }) }}</span>
              <span class="text-xl font-semibold leading-none">{{ new Date(doc.dateTime).getDate() }}</span>
            </span>
            <span class="flex min-w-0 flex-1 flex-col gap-1">
              <span class="font-semibold">{{ doc.title }}</span>
              <span class="text-sm text-ink-muted">{{ doc.kind === 'event' ? doc.city : 'Speaking Club' }} · {{ formatDateTime(doc.dateTime) }}</span>
              <span class="flex items-center gap-2 text-sm text-ink-muted">
                <span aria-hidden="true" class="block h-1.5 w-24 overflow-hidden rounded-full bg-line"><span class="block h-full rounded-full" :class="seatsPct(doc) >= 100 ? 'bg-red' : 'bg-sky-strong'" :style="{ width: `${seatsPct(doc)}%` }" /></span>
                {{ doc.spotsBooked ?? 0 }} / {{ doc.capacity }}
              </span>
            </span>
          </RouterLink>
        </section>
      </div>

      <section aria-labelledby="orders-title" class="flex flex-col gap-4">
        <h2 id="orders-title" class="text-2xl font-semibold">Recent orders</h2>
        <p v-if="!recentOrders.length" class="text-ink-muted">No orders yet.</p>
        <div v-else class="overflow-x-auto rounded-ds border border-line">
          <table class="w-full min-w-[640px] border-collapse text-left text-sm">
            <thead>
              <tr class="bg-surface-secondary">
                <th v-for="h in ['Learner', 'Item', 'Type', 'Amount', 'Status', 'Date']" :key="h" scope="col" class="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-ink-muted" :class="h === 'Amount' ? 'text-right' : ''">{{ h }}</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="o in recentOrders" :key="o.$id" class="border-t border-line">
                <!-- Admins can read orders but not profiles, so we show a short learner id -->
                <td class="px-4 py-3 text-ink-muted">#{{ o.userId.slice(-6).toUpperCase() }}</td>
                <td class="px-4 py-3 font-semibold">{{ o.itemName }}</td>
                <td class="px-4 py-3">{{ TYPE[o.itemType] }}</td>
                <td class="whitespace-nowrap px-4 py-3 text-right">{{ o.amount }} kr</td>
                <td class="px-4 py-3"><StatusTag v-bind="ORDER_STATUS[o.status] ?? { label: o.status }" /></td>
                <td class="whitespace-nowrap px-4 py-3 text-ink-muted">{{ formatDateTime(o.createdAt) }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </template>
  </div>
</template>
