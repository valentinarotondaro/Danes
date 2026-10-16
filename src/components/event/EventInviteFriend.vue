<script setup>
import { computed, ref } from 'vue'
import { useAuth } from '@/composables/useAuth'
import friendsImg from '@/assets/img/speaking-group.jpg'

const { currentUser } = useAuth()
const copied = ref(false)

// Each member gets a personal link. Logged out: a generic one.
const inviteLink = computed(() =>
  currentUser.value ? `danes.dk/invite/${currentUser.value.$id.slice(0, 8)}` : 'danes.dk/invite'
)

async function copyLink() {
  try {
    await navigator.clipboard.writeText(`https://${inviteLink.value}`)
    copied.value = true
    setTimeout(() => (copied.value = false), 2000)
  } catch {
    copied.value = false // clipboard blocked: the link is still visible to copy by hand
  }
}
</script>

<template>
  <section id="invite" class="flex flex-col gap-6 rounded-ds bg-sky p-6 lg:flex-row">
    <div class="flex flex-1 flex-col justify-center gap-4 p-2 lg:p-4">
      <span class="text-xs font-semibold uppercase tracking-wide text-ink">Bring a friend</span>
      <h2 class="text-[32px] font-semibold leading-[1.1] text-ink sm:text-[56px]">Danish is easier with a friend.</h2>
      <p class="max-w-md text-ink">Send your invite link to a colleague, a neighbour or your partner. Their first event is on us.</p>
      <div class="flex max-w-lg flex-col gap-2 sm:flex-row sm:items-end">
        <label class="flex flex-1 flex-col gap-2">
          <span class="text-sm font-semibold text-ink">Your invite link</span>
          <input
            :value="inviteLink"
            readonly
            class="h-12 rounded-ds border-[1.5px] border-ink-muted bg-white px-4 text-ink"
          />
        </label>
        <button type="button" class="h-12 rounded-ds bg-red px-6 font-semibold text-white hover:bg-red-hover" @click="copyLink">
          {{ copied ? 'Copied!' : 'Copy link' }}
        </button>
      </div>
      <p class="sr-only" role="status">{{ copied ? 'Link copied' : '' }}</p>
    </div>
    <img :src="friendsImg" alt="Four friends taking a selfie outside a bageri" class="max-h-[420px] min-h-[300px] w-full flex-1 rounded-ds object-cover lg:w-auto" />
  </section>
</template>