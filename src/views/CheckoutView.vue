<script setup>
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { usePackage } from '@/composables/usePackages'
import { useOrders } from '@/composables/useOrders'
import PackageContentsList from '@/components/package/PackageContentsList.vue'
import LoadingState from '@/components/base/LoadingState.vue'
import ErrorState from '@/components/base/ErrorState.vue'
import EmptyState from '@/components/base/EmptyState.vue'
import BaseButton from '@/components/base/BaseButton.vue'

const route = useRoute()
const router = useRouter()
const packageId = route.query.packageId

const { pkg, loading, error, fetchPackage } = packageId
  ? usePackage(packageId)
  : { pkg: ref(null), loading: ref(false), error: ref(null), fetchPackage: () => {} }

const { purchasing, purchasePackage } = useOrders()
const confirmError = ref('')
const confirmed = ref(false)

async function onConfirm() {
  confirmError.value = ''
  try {
    await purchasePackage(pkg.value)
    confirmed.value = true
  } catch (err) {
    confirmError.value = err.message || 'Could not complete the purchase.'
  }
}

onMounted(fetchPackage)
</script>

<template>
  <section class="mx-auto max-w-lg px-6 py-12">
    <EmptyState
      v-if="!packageId"
      title="Nothing to check out"
      description="Start from a course, class, event, or package page."
    />

    <template v-else>
      <LoadingState v-if="loading" label="Loading order summary…" />
      <ErrorState v-else-if="error" :message="error" @retry="fetchPackage" />

      <template v-else-if="confirmed">
        <h1 class="text-2xl font-bold text-ink">You're all set</h1>
        <p class="mt-2 text-black/60">Your purchase is confirmed. Everything's waiting in your account.</p>
        <BaseButton class="mt-6 max-w-xs" @click="router.push({ name: 'my-account' })">
          Go to My Account
        </BaseButton>
      </template>

      <template v-else-if="pkg">
        <h1 class="text-2xl font-bold text-ink">Order summary</h1>
        <p class="mt-2 text-black/60">{{ pkg.title }}</p>

        <div class="mt-6">
          <PackageContentsList :pkg="pkg" />
        </div>

        <p class="mt-6 text-lg font-extrabold text-ink">Total: {{ pkg.price }} kr. <span class="text-sm font-medium text-black/60">/month</span></p>
        <p class="mt-1 text-sm text-black/60/70">Mock checkout — no real payment is processed.</p>

        <p v-if="confirmError" class="mt-4 text-sm text-red">{{ confirmError }}</p>

        <BaseButton class="mt-6 max-w-xs" :loading="purchasing" @click="onConfirm">
          Confirm purchase
        </BaseButton>
      </template>
    </template>
  </section>
</template>