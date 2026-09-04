<script setup>
import { reactive, ref } from 'vue'
import { useRouter, useRoute, RouterLink } from 'vue-router'
import { useAuth } from '@/composables/useAuth'
import AuthBrandPanel from '@/components/layout/AuthBrandPanel.vue'
import FormField from '@/components/base/FormField.vue'
import BaseButton from '@/components/base/BaseButton.vue'

const { login } = useAuth()
const router = useRouter()
const route = useRoute()

const form = reactive({ email: '', password: '' })
const errors = reactive({ email: '', password: '' })
const submitError = ref('')
const loading = ref(false)

function validate() {
  errors.email = /^\S+@\S+\.\S+$/.test(form.email) ? '' : 'Enter a valid email address.'
  errors.password = form.password.length >= 8 ? '' : 'Password must be at least 8 characters.'
  return !errors.email && !errors.password
}

async function onSubmit() {
  submitError.value = ''
  if (!validate()) return

  loading.value = true
  try {
    await login(form.email, form.password)
    router.push(route.query.redirect || { name: 'home' })
  } catch (err) {
    submitError.value = 'Could not log in. Check your email and password and try again.'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="grid min-h-[calc(100vh-73px)] md:grid-cols-2">
    <AuthBrandPanel />

    <div class="flex items-center justify-center px-6 py-16">
      <form @submit.prevent="onSubmit" class="w-full max-w-sm">
        <h1 class="font-serif text-3xl text-neutral-900">Log in</h1>
        <p class="mt-2 text-neutral-500">Continue where you left off.</p>

        <div class="mt-8 space-y-4">
          <FormField
            v-model="form.email"
            label="Email"
            type="email"
            autocomplete="email"
            :error="errors.email"
          />
          <FormField
            v-model="form.password"
            label="Password"
            type="password"
            autocomplete="current-password"
            :error="errors.password"
          />
        </div>

        <p v-if="submitError" class="mt-4 text-sm text-red-600">{{ submitError }}</p>

        <div class="mt-6">
          <BaseButton type="submit" :loading="loading">Log in</BaseButton>
        </div>

        <p class="mt-6 text-sm text-neutral-500">
          New here?
          <RouterLink to="/signup" class="text-[#C8102E] hover:underline">Create an account</RouterLink>
        </p>
      </form>
    </div>
  </div>
</template>
