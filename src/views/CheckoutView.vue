<script setup>
import { computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useAuth } from '@/composables/useAuth'
import { useCheckout } from '@/composables/useCheckout'
import CheckoutHeader from '@/components/checkout/CheckoutHeader.vue'
import CheckoutStep from '@/components/checkout/CheckoutStep.vue'
import PackageOption from '@/components/checkout/PackageOption.vue'
import SingleOption from '@/components/checkout/SingleOption.vue'
import CourseOption from '@/components/checkout/CourseOption.vue'
import CardFields from '@/components/checkout/CardFields.vue'
import CheckoutSummary from '@/components/checkout/CheckoutSummary.vue'
import CheckoutDone from '@/components/checkout/CheckoutDone.vue'
import LoadingState from '@/components/base/LoadingState.vue'
import ErrorState from '@/components/base/ErrorState.vue'
import EmptyState from '@/components/base/EmptyState.vue'

// Smart view: it gets everything from useCheckout and hands it to dumb components.
// The plan comes from the link: /checkout?plan=Starter or /checkout?packageId=…
const route = useRoute()
const startPackageId = route.query.packageId
const startPlan = route.query.plan

const { currentUser } = useAuth()
const {
  combos, singles, courses, selectedId, courseId, card,
  selected, course, needsCourse, fullPrice, savings,
  loading, loadError, errors, payError, order, purchasing,
  load, pay, savingsFor,
} = useCheckout({ packageId: startPackageId, plan: startPlan })

const firstName = computed(() => currentUser.value?.name?.split(' ')[0] ?? '')
const paymentStep = computed(() => (needsCourse.value ? 3 : 2))


onMounted(load)
</script>

<template>
  <div class="flex min-h-screen flex-col">
    <CheckoutHeader :show-back="!order" />

    <LoadingState v-if="loading" label="Loading your plan…" />
    <ErrorState v-else-if="loadError" :message="loadError" @retry="load" />
    <EmptyState v-else-if="!selected" title="No plans to choose yet" description="Check back soon, or write to contact@danes.dk." />

    <CheckoutDone v-else-if="order" :pkg="selected" :course="needsCourse ? course : null" :order="order" :first-name="firstName" />

    <div v-else class="mx-auto flex w-full max-w-[1200px] flex-col gap-12 px-4 pb-24 pt-8 sm:px-10 sm:pt-12 lg:flex-row lg:items-start">
      <form id="checkout-form" novalidate aria-labelledby="checkout-title" class="flex min-w-0 flex-col gap-10 lg:flex-[3]" @submit.prevent="pay">
        <div class="flex flex-col gap-2">
          <h1 id="checkout-title" class="text-[40px] font-semibold leading-[1.1] sm:text-[56px]">Get {{ selected.title }}</h1>
          <p class="text-lg text-ink-muted">
            {{ savings > 0 ? `Everything in one plan, ${savings} kr less every month.` : 'Monthly, no binding. Cancel any time.' }}
          </p>
        </div>

                <CheckoutStep :number="1" title="Choose your plan">
          <div class="flex flex-col gap-6">
            <div v-if="combos.length" class="flex flex-col gap-3">
              <p class="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                <span class="text-lg font-semibold">Packages</span>
                <span class="text-sm text-ink-muted">Combine and save every month</span>
              </p>
              <div class="grid grid-cols-1 gap-3 sm:grid-cols-3">
                <PackageOption
                  v-for="pkg in combos"
                  :key="pkg.$id"
                  :pkg="pkg"
                  :selected="pkg.$id === selectedId"
                  :savings="savingsFor(pkg)"
                  :tag="tagFor(pkg)"
                  @select="selectedId = pkg.$id"
                />
              </div>
            </div>

            <div v-if="singles.length" class="flex flex-col gap-3">
              <p class="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                <span class="text-lg font-semibold">Or just one thing</span>
                <span class="text-sm text-ink-muted">Pay for one part only</span>
              </p>
              <div class="grid grid-cols-1 gap-3 sm:grid-cols-3">
                <SingleOption
                  v-for="pkg in singles"
                  :key="pkg.$id"
                  :pkg="pkg"
                  :selected="pkg.$id === selectedId"
                  :tag="tagFor(pkg)"
                  @select="selectedId = pkg.$id"
                />
              </div>
            </div>
          </div>
        </CheckoutStep>

        <CheckoutStep v-if="needsCourse" :number="2" title="Pick the course it includes" :error="errors.course">
          <div class="flex flex-col gap-2">
            <CourseOption
              v-for="c in courses"
              :key="c.$id"
              :course="c"
              :selected="c.$id === courseId"
              @select="courseId = c.$id"
            />
          </div>
        </CheckoutStep>

        <CheckoutStep :number="paymentStep" title="Payment">
          <CardFields
            v-model:name="card.name"
            v-model:number="card.number"
            v-model:expiry="card.expiry"
            v-model:cvc="card.cvc"
            :errors="errors"
          />
        </CheckoutStep>
      </form>

      <div class="min-w-0 lg:flex-[2]">
        <CheckoutSummary
          :pkg="selected"
          :course="needsCourse ? course : null"
          :full-price="fullPrice"
          :savings="savings"
          :paying="purchasing"
          :error="payError"
        />
      </div>
    </div>
  </div>
</template>