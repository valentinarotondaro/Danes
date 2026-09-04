<script setup>
import { onMounted, ref } from 'vue'
import { useRoute, useRouter, RouterLink } from 'vue-router'
import { useBundle } from '@/composables/useBundles'
import { useAuth } from '@/composables/useAuth'
import * as orderService from '@/services/orderService'
import BundleContentsList from '@/components/bundle/BundleContentsList.vue'
import LoadingState from '@/components/base/LoadingState.vue'
import ErrorState from '@/components/base/ErrorState.vue'
import BaseButton from '@/components/base/BaseButton.vue'

const route = useRoute()
const router = useRouter()
const id = route.params.id

const { bundle, loading, error, fetchBundle } = useBundle(id)
const { currentUser, isLoggedIn } = useAuth()

const hasAccess = ref(false)
const checking = ref(false)

async function checkAccess() {
  if (!isLoggedIn.value) return
  checking.value = true
  try {
    hasAccess.value = await orderService.hasConfirmedOrder(currentUser.value.$id, 'bundle', id)
  } finally {
    checking.value = false
  }
}

onMounted(async () => {
  await fetchBundle()
  await checkAccess()
})

function goToCheckout() {
  router.push({ name: 'checkout', query: { bundleId: id } })
}
</script>

<template>
  <section class="mx-auto max-w-2xl px-6 py-12">
    <LoadingState v-if="loading" label="Loading bundle…" />
    <ErrorState v-else-if="error" :message="error" @retry="fetchBundle" />

    <template v-else-if="bundle">
      <h1 class="font-serif text-3xl text-neutral-900">{{ bundle.title }}</h1>
      <p class="mt-3 text-neutral-600">{{ bundle.description }}</p>
      <p class="mt-4 text-lg font-medium text-neutral-900">{{ bundle.price }} DKK</p>

      <h2 class="mt-8 font-serif text-xl text-neutral-900">What's included</h2>
      <div class="mt-4">
        <BundleContentsList :bundle="bundle" />
      </div>

      <div class="mt-6">
        <template v-if="!isLoggedIn">
          <p class="text-sm text-neutral-500">
            <RouterLink :to="{ name: 'login', query: { redirect: route.fullPath } }" class="text-[#C8102E] hover:underline">
              Log in
            </RouterLink>
            to purchase this bundle.
          </p>
        </template>
        <template v-else-if="checking">
          <p class="text-sm text-neutral-500">Checking access…</p>
        </template>
        <template v-else-if="hasAccess">
          <p class="text-sm font-medium text-green-700">You already own this bundle.</p>
        </template>
        <template v-else>
          <BaseButton @click="goToCheckout" class="max-w-xs">Buy bundle — {{ bundle.price }} DKK</BaseButton>
        </template>
      </div>
    </template>
  </section>
</template>
