<script setup>
import { reactive, ref } from 'vue'
import { useRouter, useRoute, RouterLink } from 'vue-router'
import { useAuth } from '@/composables/useAuth'
import { validateLogin } from '@/utils/validation'
import { loginErrorMessage } from '@/utils/authErrors'
import LoginPanel from '@/components/auth/LoginPanel.vue'
import AuthAlert from '@/components/auth/AuthAlert.vue'
import FormField from '@/components/base/FormField.vue'
import BaseButton from '@/components/base/BaseButton.vue'

const { login, role } = useAuth()
const router = useRouter()
const route = useRoute()

const form = reactive({ email: '', password: '' })
const errors = ref({})
const submitError = ref('')
const loading = ref(false)

async function onSubmit() {
  submitError.value = ''
  errors.value = validateLogin(form)
  if (Object.keys(errors.value).length) return

  loading.value = true
  try {
    await login(form.email.trim(), form.password)
    // Admins land in the admin area, learners on the home page (unless a redirect is waiting)
    const fallback = role.value === 'admin' ? { name: 'admin-dashboard' } : { name: 'home' }
    router.push(route.query.redirect || fallback)
  } catch (err) {
    submitError.value = loginErrorMessage(err)
  } finally {
    loading.value = false
  }
}
</script>

<template>
      <div class="mx-auto flex max-w-[1200px] flex-col gap-8 px-4 pt-6 sm:px-10 sm:pt-10 lg:min-h-[640px] lg:flex-row lg:gap-12">
    <LoginPanel />

       <main class="flex items-center justify-center lg:min-w-0 lg:flex-1 lg:basis-0 lg:py-10">
      <form novalidate class="flex w-full max-w-[440px] flex-col gap-5 lg:gap-6" @submit.prevent="onSubmit">
        <div class="flex flex-col gap-2">
          <h2 class="text-[32px] font-semibold leading-[1.1] text-ink lg:text-[40px]">Welcome back</h2>
          <p class="text-ink-muted">Log in to your lessons, Fridays and events.</p>
        </div>

        <AuthAlert v-if="submitError" title="We couldn’t log you in." :message="submitError" />

        <FormField v-model="form.email" label="Email" type="email" autocomplete="email" :error="errors.email" />
        <FormField
          v-model="form.password"
          label="Password"
          type="password"
          autocomplete="current-password"
          :error="errors.password"
        />

        <BaseButton type="submit" :loading="loading">Log in</BaseButton>

        <p class="text-sm text-ink">
          New here?
          <RouterLink :to="{ name: 'signup', query: route.query }" class="font-semibold text-red">Create an account</RouterLink>
        </p>
        <p class="rounded-ds bg-surface-secondary p-4 text-sm text-ink">
          <strong>Teacher or admin?</strong> Use this same login. If your account has admin access, you’ll go straight to the admin area.
        </p>
      </form>
    </main>
  </div>
</template>