<script setup>
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useBundle } from '@/composables/useBundles'
import { useOrders } from '@/composables/useOrders'
import BundleContentsList from '@/components/bundle/BundleContentsList.vue'
import LoadingState from '@/components/base/LoadingState.vue'
import ErrorState from '@/components/base/ErrorState.vue'
import EmptyState from '@/components/base/EmptyState.vue'
import BaseButton from '@/components/base/BaseButton.vue'

const route = useRoute()
const router = useRouter()
const bundleId = route.query.bundleId

const { bundle, loading, error, fetchBundle } = bundleId
  ? useBundle(bundleId)
  : { bundle: ref(null), loading: ref(false), error: ref(null), fetchBundle: () => {} }

const { purchasing, purchaseBundle } = useOrders()
const confirmError = ref('')
const confirmed = ref(false)

async function onConfirm() {
  confirmError.value = ''
  try {
    await purchaseBundle(bundle.value)
    confirmed.value = true
  } catch (err) {
    confirmError.value = err.message || 'Could not complete the purchase.'
  }
}

onMounted(fetchBundle)
</script>

<template>
  <section class="mx-auto max-w-lg px-6 py-12">
    <EmptyState
      v-if="!bundleId"
      title="Nothing to check out"
      description="Start from a course, class, event, or bundle page."
    />

    <template v-else>
      <LoadingState v-if="loading" label="Loading order summary…" />
      <ErrorState v-else-if="error" :message="error" @retry="fetchBundle" />

      <template v-else-if="confirmed">
        <h1 class="font-serif text-2xl text-neutral-900">You're all set</h1>
        <p class="mt-2 text-neutral-600">Your purchase is confirmed. Everything's waiting in your account.</p>
        <BaseButton class="mt-6 max-w-xs" @click="router.push({ name: 'my-account' })">
          Go to My Account
        </BaseButton>
      </template>

      <template v-else-if="bundle">
        <h1 class="font-serif text-2xl text-neutral-900">Order summary</h1>
        <p class="mt-2 text-neutral-600">{{ bundle.title }}</p>

        <div class="mt-6">
          <BundleContentsList :bundle="bundle" />
        </div>

        <p class="mt-6 text-lg font-medium text-neutral-900">Total: {{ bundle.price }} DKK</p>
        <p class="mt-1 text-sm text-neutral-400">Mock checkout — no real payment is processed.</p>

        <p v-if="confirmError" class="mt-4 text-sm text-red-600">{{ confirmError }}</p>

        <BaseButton class="mt-6 max-w-xs" :loading="purchasing" @click="onConfirm">
          Confirm purchase
        </BaseButton>
      </template>
    </template>
  </section>
</template>
