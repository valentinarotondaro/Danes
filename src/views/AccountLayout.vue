<script setup>
import { onMounted, provide } from 'vue'
import { RouterView } from 'vue-router'
import { useLearner } from '@/composables/useLearner'
import AccountTabs from '@/components/account/AccountTabs.vue'
import AdminToast from '@/components/admin/AdminToast.vue'
import LoadingState from '@/components/base/LoadingState.vue'
import ErrorState from '@/components/base/ErrorState.vue'

// The frame of My account: the tabs and the data. The data loads ONCE here and
// the four tabs get it with inject('learner'), so switching tabs is instant.
const learner = useLearner()
provide('learner', learner)
onMounted(learner.load)
</script>

<template>
  <div>
    <AccountTabs class="mt-6" />
    <div class="mx-auto max-w-[1200px] px-4 pb-24 pt-10 sm:px-10 sm:pt-12">
      <LoadingState v-if="learner.loading.value" :rows="4" label="Loading your account" />
      <ErrorState v-else-if="learner.error.value" :title="learner.error.value" @retry="learner.load" />
      <RouterView v-else />
    </div>
    <AdminToast />
  </div>
</template>
