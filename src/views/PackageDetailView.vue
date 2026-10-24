<script setup>
import { onMounted, ref } from 'vue'
import { useRoute, useRouter, RouterLink } from 'vue-router'
import { usePackage } from '@/composables/usePackages'
import { useAuth } from '@/composables/useAuth'
import * as orderService from '@/services/orderService'
import PackageContentsList from '@/components/package/PackageContentsList.vue'
import LoadingState from '@/components/base/LoadingState.vue'
import ErrorState from '@/components/base/ErrorState.vue'
import BaseButton from '@/components/base/BaseButton.vue'

const route = useRoute()
const router = useRouter()
const id = route.params.id

const { pkg, loading, error, fetchPackage } = usePackage(id)
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
  await fetchPackage()
  await checkAccess()
})

function goToCheckout() {
  router.push({ name: 'checkout', query: { packageId: id } })
}
</script>

<template>
  <section class="mx-auto max-w-2xl px-6 py-12">
    <LoadingState v-if="loading" label="Loading package…" />
    <ErrorState v-else-if="error" :message="error" @retry="fetchPackage" />

    <template v-else-if="pkg">
      <h1 class="text-3xl font-semibold text-ink">{{ pkg.title }}</h1>
      <p class="mt-3 text-ink-muted">{{ pkg.description }}</p>
      <p class="mt-4 text-lg font-semibold text-ink">{{ pkg.price }} kr. <span class="text-sm font-medium text-ink-muted">/month</span></p>

      <h2 class="mt-8 text-xl font-semibold text-ink">What's included</h2>
      <div class="mt-4">
        <PackageContentsList :pkg="pkg" />
      </div>

      <div class="mt-6">
        <template v-if="!isLoggedIn">
          <p class="text-sm text-ink-muted">
            <RouterLink :to="{ name: 'login', query: { redirect: route.fullPath } }" class="text-red hover:underline">
              Log in
            </RouterLink>
            to purchase this package.
          </p>
        </template>
        <template v-else-if="checking">
          <p class="text-sm text-ink-muted">Checking access…</p>
        </template>
        <template v-else-if="hasAccess">
          <p class="text-sm font-medium text-success">You already own this package.</p>
        </template>
        <template v-else>
          <BaseButton @click="goToCheckout" class="max-w-xs">Buy package — {{ pkg.price }} kr./month</BaseButton>
        </template>
      </div>
    </template>
  </section>
</template>