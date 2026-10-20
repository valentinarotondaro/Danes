<script setup>
import FormField from '@/components/base/FormField.vue'

// The demo card form. defineModel gives each field a two-way binding,
// so the parent writes v-model:number="card.number" and owns the data.
const name = defineModel('name', { type: String, default: '' })
const number = defineModel('number', { type: String, default: '' })
const expiry = defineModel('expiry', { type: String, default: '' })
const cvc = defineModel('cvc', { type: String, default: '' })

defineProps({ errors: { type: Object, default: () => ({}) } })
</script>

<template>
  <div class="flex flex-col gap-4">
    <div class="flex items-start gap-3 rounded-ds bg-sky-soft p-4 text-sm">
      <svg aria-hidden="true" class="mt-px flex-none" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9" /><path d="M12 11v5M12 8h.01" /></svg>
      <span><strong>Demo payment.</strong> This is a student project: no card is charged. Paying creates a real order in the database. Try 4242 4242 4242 4242.</span>
    </div>

    <FormField v-model="name" label="Name on card" autocomplete="cc-name" :error="errors.name" />
    <FormField v-model="number" label="Card number" inputmode="numeric" autocomplete="cc-number" placeholder="1234 5678 9012 3456" :error="errors.number" />
    <div class="grid grid-cols-2 gap-4">
      <FormField v-model="expiry" label="Expiry date" inputmode="numeric" autocomplete="cc-exp" placeholder="MM / YY" :error="errors.expiry" />
      <FormField v-model="cvc" label="Security code" inputmode="numeric" autocomplete="cc-csc" hint="3 digits on the back" :error="errors.cvc" />
    </div>
  </div>
</template>