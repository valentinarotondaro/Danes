<script setup>
import { reactive, ref } from 'vue'
import { useRouter, RouterLink } from 'vue-router'
import { useAuth } from '@/composables/useAuth'
import AuthBrandPanel from '@/components/layout/AuthBrandPanel.vue'
import FormField from '@/components/base/FormField.vue'
import BaseButton from '@/components/base/BaseButton.vue'

const { signup } = useAuth()
const router = useRouter()

const form = reactive({ name: '', email: '', password: '' })
const errors = reactive({ name: '', email: '', password: '' })
const submitError = ref('')
const loading = ref(false)

function validate() {
  errors.name = form.name.trim().length >= 2 ? '' : 'Enter your name.'
  errors.email = /^\S+@\S+\.\S+$/.test(form.email) ? '' : 'Enter a valid email address.'
  errors.password = form.password.length >= 8 ? '' : 'Password must be at least 8 characters.'
  return !errors.name && !errors.email && !errors.password
}

async function onSubmit() {
  submitError.value = ''
  if (!validate()) return

  loading.value = true
  try {
    await signup(form.email, form.password, form.name)
    router.push({ name: 'home' })
  } catch (err) {
    submitError.value = 'Could not create your account. That email may already be in use.'
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
        <h1 class="text-3xl text-neutral-900">Create your account</h1>
        <p class="mt-2 text-neutral-500">Start learning, practicing, and belonging.</p>

        <div class="mt-8 space-y-4">
          <FormField v-model="form.name" label="Name" autocomplete="name" :error="errors.name" />
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
            autocomplete="new-password"
            :error="errors.password"
          />
        </div>

        <p v-if="submitError" class="mt-4 text-sm text-red-600">{{ submitError }}</p>

        <div class="mt-6">
          <BaseButton type="submit" :loading="loading">Create account</BaseButton>
        </div>

        <p class="mt-6 text-sm text-neutral-500">
          Already have an account?
          <RouterLink to="/login" class="text-[#C8102E] hover:underline">Log in</RouterLink>
        </p>
      </form>
    </div>
  </div>
</template>
