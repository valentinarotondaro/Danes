<script setup>
import { computed } from 'vue'
import BaseButton from '@/components/base/BaseButton.vue'
import { describePackage, nextPaymentDate } from '@/utils/plans'

// The grey summary box with the price and the Pay button.
const props = defineProps({
  pkg: { type: Object, required: true },
  course: { type: Object, default: null },
  fullPrice: { type: Number, default: 0 },
  savings: { type: Number, default: 0 },
  paying: { type: Boolean, default: false },
  error: { type: String, default: '' },
})
defineEmits(['pay'])

const renewsOn = nextPaymentDate()

// "Danish for work + Speaking Club": the picked course instead of "One course"
const contents = computed(() => {
  const text = describePackage(props.pkg)
  return props.course ? text.replace('One course', props.course.title) : text
})
</script>

<template>
  <aside aria-labelledby="summary-title" class="flex flex-col gap-5 rounded-ds bg-surface-secondary p-6 sm:p-8 lg:sticky lg:top-8">
    <h2 id="summary-title" class="text-2xl font-semibold leading-tight">Summary</h2>

    <div class="flex flex-col gap-1">
      <span class="text-lg font-semibold">{{ pkg.title }}</span>
      <span class="text-sm text-ink-muted">{{ contents }}</span>
    </div>

    <ul class="flex flex-col gap-2.5 border-y border-line py-4 text-sm">
      <li class="flex"><span>{{ pkg.title }}, per month</span><span class="ml-auto">{{ pkg.price }} kr</span></li>
      <template v-if="savings > 0">
        <li class="flex text-ink-muted"><span>Bought one by one</span><span class="ml-auto line-through">{{ fullPrice }} kr</span></li>
        <li class="flex font-semibold text-success"><span>You save</span><span class="ml-auto">{{ savings }} kr / month</span></li>
      </template>
    </ul>

    <div class="flex items-baseline">
      <span class="font-semibold">Due today</span>
      <span class="ml-auto text-[32px] font-semibold leading-tight">{{ pkg.price }} kr</span>
    </div>

    <p v-if="error" role="alert" class="rounded-ds bg-red-soft p-4 text-sm text-red">{{ error }}</p>

    <BaseButton type="submit" form="checkout-form" :loading="paying">Pay {{ pkg.price }} kr</BaseButton>

    <ul class="flex flex-col gap-2 text-sm">
      <li class="flex items-start gap-2.5">
        <svg aria-hidden="true" class="mt-0.5 flex-none" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m5 12 5 5 9-10" /></svg>
        Starts today. Renews on {{ renewsOn }}.
      </li>
      <li v-if="pkg.includesCourse" class="flex items-start gap-2.5">
        <svg aria-hidden="true" class="mt-0.5 flex-none" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m5 12 5 5 9-10" /></svg>
        Your course opens as soon as you pay.
      </li>
    </ul>
  </aside>
</template>