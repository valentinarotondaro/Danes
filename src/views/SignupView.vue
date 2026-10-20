<script setup>
import { reactive, ref } from 'vue'
import { useRouter, useRoute, RouterLink } from 'vue-router'
import { useAuth } from '@/composables/useAuth'
import { validateSignup } from '@/utils/validation'
import { signupErrorMessage } from '@/utils/authErrors'
import SignupPanel from '@/components/auth/SignupPanel.vue'
import AuthAlert from '@/components/auth/AuthAlert.vue'
import FormField from '@/components/base/FormField.vue'
import FilterChips from '@/components/base/FilterChips.vue'
import BaseButton from '@/components/base/BaseButton.vue'

const { signup } = useAuth()
const router = useRouter()
const route = useRoute()

const DANISH_OPTIONS = [
  { value: 'none', label: 'None yet' },
  { value: 'a-little', label: 'A little' },
  { value: 'can-chat', label: 'I can chat' },
  { value: 'not-sure', label: 'Not sure' },
]

const form = reactive({ name: '', email: '', password: '', journey: '', agreed: false })
const errors = ref({})
const submitError = ref('')
const loading = ref(false)

async function onSubmit() {
  submitError.value = ''
  errors.value = validateSignup(form)
  if (Object.keys(errors.value).length) return

  loading.value = true
  try {
    await signup(form.email.trim(), form.password, form.name.trim(), form.journey)
    // Back to where they came from (e.g. the checkout), otherwise the level test
    router.push(route.query.redirect || { name: 'level-test' })
  } catch (err) {
    const { field, message } = signupErrorMessage(err)
    if (field) errors.value = { [field]: message }
    else submitError.value = message
  } finally {
    loading.value = false
  }
}
</script>

<template>
    <div class="mx-auto flex max-w-[1200px] flex-col gap-8 px-4 pt-6 sm:px-10 sm:pt-10 lg:min-h-[640px] lg:flex-row lg:gap-12">
    <SignupPanel />

        <main class="flex items-center justify-center lg:min-w-0 lg:flex-1 lg:basis-0 lg:py-10">
      <form novalidate class="flex w-full max-w-[440px] flex-col gap-5 lg:gap-6" @submit.prevent="onSubmit">
        <div class="flex flex-col gap-2">
          <h2 class="text-[32px] font-semibold leading-[1.1] text-ink lg:text-[40px]">Create your account</h2>
          <p class="text-ink-muted">Free to join. Take the level test, then pick a plan when you’re ready.</p>
        </div>

        <AuthAlert v-if="submitError" title="Something went wrong." :message="submitError" />

        <FormField v-model="form.name" label="First name" autocomplete="given-name" :error="errors.name" />
        <FormField v-model="form.email" label="Email" type="email" autocomplete="email" :error="errors.email" />
        <FormField
          v-model="form.password"
          label="Password"
          type="password"
          autocomplete="new-password"
          hint="At least 8 characters."
          :error="errors.password"
        />

        <fieldset class="flex flex-col gap-3">
          <legend class="mb-3 text-sm font-semibold text-ink">How much Danish do you speak?</legend>
          <FilterChips v-model="form.journey" :options="DANISH_OPTIONS" label="How much Danish do you speak?" />
        </fieldset>

        <div class="flex flex-col gap-2">
          <label class="flex items-start gap-3 text-sm text-ink">
            <input
              v-model="form.agreed"
              type="checkbox"
              :aria-invalid="errors.agreed ? 'true' : undefined"
              class="size-5 flex-none accent-red"
            />
            <span>I agree to the <strong>terms</strong> and <strong>privacy policy</strong>.</span>
          </label>
          <p v-if="errors.agreed" class="text-sm font-semibold text-red">{{ errors.agreed }}</p>
        </div>

        <BaseButton type="submit" :loading="loading">Create account</BaseButton>

        <p class="text-sm text-ink-muted">Next: a 5-minute level test, so we can suggest your first course.</p>
        <p class="text-sm text-ink">
          Already a member?
          <RouterLink :to="{ name: 'login', query: route.query }" class="font-semibold text-red">Log in</RouterLink>
        </p>
      </form>
    </main>
  </div>
</template>