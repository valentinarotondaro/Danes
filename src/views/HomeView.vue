<script setup>
import { computed, onMounted, ref } from 'vue'
import { RouterLink } from 'vue-router'
import * as eventService from '@/services/eventService'
import danishFlagImg from '@/assets/img/danish-flag.avif'
import danesSmilesImg from '@/assets/img/danes-smiles.avif'
import speakingClubImg from '@/assets/img/speaking-club.webp'
import heroCyclistsImg from '@/assets/img/hero-cyclists.png'
import courseNewcomersImg from '@/assets/img/course-newcomers.png'
import courseExamImg from '@/assets/img/course-exam.png'
import danesLogoRedImg from '@/assets/img/danes-logo-red.png'

// --- photo slots ---------------------------------------------------------
// Empty for now — drop a URL in and the matching <img> renders automatically,
// falling back to a brand-colored block everywhere else in the meantime.
const heroImageUrl = heroCyclistsImg
const valuesImageUrl = danesSmilesImg
const levelTestImageUrl = danesSmilesImg
const speakingClubImageUrl = speakingClubImg

const avatarColors = ['bg-sky', 'bg-red', 'bg-ink', 'bg-sky', 'bg-red']

const courses = [
  {
    tag1: '3 modules',
    title: 'Danish for newcomers',
    desc: 'Everything for your first months here: the alphabet and pronunciation, introductions and greetings, ordering at the bakery, and reading your first brev from the kommune.',
    price: '399 kr.',
    image: courseNewcomersImg,
  },
  {
    tag1: '6 modules',
    title: 'Danish for the Exam',
    desc: 'Structured, deadline-driven prep for Prøve i Dansk 1–3 and Studieprøven, with timed mock exams modeled closely on the real test format.',
    price: '399 kr.',
    image: courseExamImg,
  },
]

const howStep1 = { title: 'Discover\nyour danish level', desc: 'A free 15-minute placement test tells us exactly where to start you, no guessing.' }
const howSteps = [
  { n: '2', title: 'Explore our popular courses', desc: 'Self-paced courses built around what you need for everyday life. Danish for Newcomers, etc.', bg: 'bg-red', text: 'text-white', textSoft: 'text-white/80', pill: 'bg-white text-ink', circle: 'bg-sky text-ink' },
  { n: '3', title: 'Attend our Speaking Club', desc: 'A weekly video hangout to practice out loud with fellow learners and native speakers.', bg: 'bg-sky', text: 'text-ink', textSoft: 'text-black/60', pill: 'bg-red text-white', circle: 'bg-red text-white' },
  { n: '4', title: 'Join our events and excursions', desc: 'Julefrokost, fælles hygge nights, city walks with your class. DANES events happen every month.', bg: 'bg-red', text: 'text-white', textSoft: 'text-white/80', pill: 'bg-white text-ink', circle: 'bg-sky text-ink' },
]

const reviews = [
  { quote: 'I went from panicking at Netto to actually chatting with the cashier. The speaking club made the difference.', name: 'Sofia', context: 'Argentina' },
  { quote: 'Recorded lessons meant I could study around night shifts. My CPR appointment last week was fully in Danish.', name: 'Tomas', context: 'Colombia' },
  { quote: 'My teacher understood exactly what expat life needed — job Danish, not just textbook Danish.', name: 'Galina', context: 'Ukraine' },
]

const faqs = [
  { q: 'Do I need Danish to get started?', a: 'Not at all — most learners start from zero. Your level test places you in the right starting point, whether that\'s the alphabet or fine-tuning your grammar.' },
  { q: 'What happens after my first lesson?', a: 'Your teacher gives you a level and a recommended plan. There\'s no obligation to continue — you decide what fits.' },
  { q: 'Can I pause or cancel my plan?', a: 'Yes, anytime from your account settings. Group and self-paced plans are month-to-month with no lock-in.' },
  { q: 'Can I use DANES to give an exam?', a: 'DANES doesn\'t administer official exams, but teachers can build Prøve i Dansk / Studieprøven prep into your plan with practice sessions modeled on the real test.' },
  { q: 'How can I join the events?', a: 'Sign up, then RSVP to any event from the Events page — spots are limited, so book ahead.' },
  { q: 'What if I am an introvert person?', a: 'Totally fine — start with recorded lessons at your own pace, and join live classes or events only when you\'re ready.' },
]
const openFaq = ref(null)
function toggleFaq(i) {
  openFaq.value = openFaq.value === i ? null : i
}

// --- city walks (real Appwrite events, grouped by city) ------------------
const CITIES = ['All', 'Aarhus', 'Copenhagen', 'Odense', 'Esbjerg', 'Billund']
const events = ref([])
const activeCity = ref('All')

onMounted(async () => {
  try {
    events.value = await eventService.listPublishedEvents()
  } catch {
    events.value = []
  }
})

const cityEvents = computed(() =>
  (activeCity.value === 'All' ? events.value : events.value.filter((e) => e.city === activeCity.value)).slice(0, 3)
)

function formatDate(iso) {
  return new Date(iso).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }).toUpperCase()
}
</script>

<template>
  <div class="bg-white">
    <!-- Hero -->
    <section class="px-6 py-16 md:py-20">
      <div class="mx-auto max-w-6xl overflow-hidden rounded-[32px] bg-sky md:rounded-[58px]">
        <div class="grid grid-cols-1 md:grid-cols-2">
          <div class="flex flex-col justify-center gap-8 p-8 sm:p-12 md:p-14">
            <p class="text-4xl font-semibold leading-[1.1] text-ink md:text-6xl">
              Everyday Danish, built for real life.
            </p>

            <div class="flex items-center gap-3">
              <div class="flex -space-x-3">
                <span
                  v-for="(c, i) in ['bg-red', 'bg-ink', 'bg-white']"
                  :key="i"
                  class="h-11 w-11 rounded-full border-2 border-sky"
                  :class="c"
                />
              </div>
              <span class="rounded-full bg-white px-4 py-2 text-sm font-medium text-ink">+150</span>
            </div>

            <div class="flex flex-wrap items-center gap-3">
              <RouterLink to="/signup" class="rounded-full bg-red px-6 py-3.5 text-sm font-semibold text-white transition hover:opacity-90">
                Start the level test
              </RouterLink>
              <a href="#how" class="rounded-full bg-white px-6 py-3.5 text-sm font-semibold text-ink transition hover:opacity-90">
                How it works
              </a>
            </div>
          </div>

          <div class="aspect-[4/3] md:aspect-auto">
            <img v-if="heroImageUrl" :src="heroImageUrl" alt="Cyclists in a Danish city" class="h-full w-full object-cover" />
          </div>
        </div>
      </div>
    </section>

    <!-- Feel at home in Denmark -->
    <section class="px-6 py-16 md:py-24">
      <div class="mx-auto max-w-5xl">
        <h2 class="text-4xl font-semibold tracking-tight text-ink md:text-6xl">Feel at home in Denmark</h2>
        <p class="mt-3 text-lg text-black/60 md:text-2xl">Self-paced courses built around what you need for everyday life.</p>

        <div class="mt-8 flex flex-wrap items-center gap-3">
          <div class="flex flex-wrap gap-2">
            <span class="rounded-full bg-ink px-5 py-2.5 text-sm font-medium text-white">All</span>
            <span class="rounded-full border border-black/15 px-5 py-2.5 text-sm font-medium text-ink">A1 Beginner</span>
            <span class="rounded-full border border-black/15 px-5 py-2.5 text-sm font-medium text-ink">A2 Elementary</span>
            <span class="rounded-full border border-black/15 px-5 py-2.5 text-sm font-medium text-ink">B1 Intermediate</span>
          </div>
          <RouterLink to="/courses" class="ml-auto rounded-full bg-red px-6 py-2.5 text-sm font-medium text-white transition hover:opacity-90">
            See all courses
          </RouterLink>
        </div>

        <div class="mt-10 grid grid-cols-1 gap-8 md:grid-cols-2">
          <div v-for="c in courses" :key="c.title" class="overflow-hidden rounded-2xl">
            <div class="aspect-[4/3] overflow-hidden rounded-t-2xl bg-sky">
              <img :src="c.image" :alt="c.title" class="h-full w-full object-cover" />
            </div>
            <div class="rounded-b-2xl bg-sky p-6">
              <span class="rounded-full bg-white px-4 py-1.5 text-xs font-semibold uppercase tracking-wide text-ink">{{ c.tag1 }}</span>
              <h3 class="mt-4 text-2xl text-ink">{{ c.title }}</h3>
              <p class="mt-3 text-base text-ink/80">{{ c.desc }}</p>
              <p class="mt-6 text-2xl font-semibold text-ink">{{ c.price }}/month</p>
              <RouterLink to="/courses" class="mt-6 block rounded-full bg-red px-4 py-2.5 text-center text-sm font-medium text-white transition hover:opacity-90">
                Read more here
              </RouterLink>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Our values -->
    <section id="about" class="bg-red px-6 py-16 md:py-20">
      <div class="mx-auto grid max-w-5xl grid-cols-1 items-center gap-10 md:grid-cols-[1.15fr_0.85fr]">
        <div>
          <span class="text-sm font-semibold uppercase tracking-wide text-white">Our values</span>
          <h2 class="mt-4 flex flex-wrap items-center gap-x-3 text-3xl font-semibold leading-tight tracking-tight text-white md:text-5xl">
            <span>In</span>
            <span class="relative inline-block h-9 aspect-[3.9/1] overflow-hidden align-middle md:h-12">
              <img :src="danesLogoRedImg" alt="DANES" class="absolute -top-[136%] left-0 w-full" />
            </span>
            <span>we help you build your life in Denmark.</span>
          </h2>
          <div class="mt-6 flex flex-wrap gap-2">
            <span class="rounded-full bg-sky px-5 py-2 text-sm font-semibold text-ink">Community</span>
            <span class="rounded-full bg-sky px-5 py-2 text-sm font-semibold text-ink">Confidence</span>
            <span class="rounded-full bg-sky px-5 py-2 text-sm font-semibold text-ink">Support</span>
            <span class="rounded-full bg-sky px-5 py-2 text-sm font-semibold text-ink">Belonging</span>
            <span class="rounded-full bg-sky px-5 py-2 text-sm font-semibold text-ink">Opportunities</span>
            <span class="rounded-full bg-sky px-5 py-2 text-sm font-semibold text-ink">Motivation</span>
          </div>
        </div>
        <div class="aspect-[4/5] overflow-hidden rounded-[32px] md:rounded-[58px]">
          <img v-if="valuesImageUrl" :src="valuesImageUrl" alt="DANES community" class="h-full w-full object-cover" />
        </div>
      </div>
    </section>

    <!-- How it works — bento -->
    <section id="how" class="border-b border-black/10 px-6 py-16 md:py-24">
      <div class="mx-auto max-w-4xl">
        <h2 class="text-4xl font-semibold tracking-tight text-ink md:text-6xl">How it works</h2>
        <p class="mt-3 text-lg text-black/60 md:text-2xl">From your level test to your first real conversation in Danish, here's the path.</p>

        <div class="mt-10 grid grid-cols-1 gap-5 md:grid-cols-[1fr_1.7fr]">
          <div class="flex min-h-[280px] flex-col justify-between rounded-[28px] bg-sky p-7">
            <div class="flex items-start justify-between">
              <span class="rounded-full bg-red px-4 py-1.5 text-sm font-semibold text-white">Step 1</span>
              <span class="flex h-9 w-9 items-center justify-center rounded-full bg-red text-base font-bold text-white">↗</span>
            </div>
            <div>
              <h3 class="mt-6 whitespace-pre-line text-2xl font-semibold leading-tight text-ink">{{ howStep1.title }}</h3>
              <p class="mt-3 text-sm text-black/60">{{ howStep1.desc }}</p>
            </div>
          </div>

          <div class="min-h-[280px] overflow-hidden rounded-[28px] bg-sky">
            <img :src="danishFlagImg" alt="Danish flag" class="h-full w-full object-cover" />
          </div>
        </div>

        <div class="mt-5 grid grid-cols-1 gap-5 md:grid-cols-3">
          <div v-for="step in howSteps" :key="step.n" class="flex min-h-[220px] flex-col justify-between rounded-[28px] p-7" :class="step.bg">
            <div class="flex items-start justify-between">
              <span class="rounded-full px-4 py-1.5 text-sm font-semibold" :class="step.pill">Step {{ step.n }}</span>
              <span class="flex h-9 w-9 items-center justify-center rounded-full text-base font-bold" :class="step.circle">↗</span>
            </div>
            <div>
              <h3 class="mt-6 text-xl font-semibold leading-tight" :class="step.text">{{ step.title }}</h3>
              <p class="mt-3 text-sm" :class="step.textSoft">{{ step.desc }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Not sure where to stand -->
    <section class="px-6 py-16 md:py-20">
      <div class="mx-auto max-w-6xl rounded-[32px] bg-sky p-4 md:rounded-[58px] md:p-6">
        <div class="grid grid-cols-1 items-center gap-8 md:grid-cols-[0.85fr_1.15fr] md:gap-12">
          <div class="aspect-4/3 overflow-hidden rounded-[24px] md:aspect-square md:rounded-[44px]">
            <img v-if="levelTestImageUrl" :src="levelTestImageUrl" alt="Friends laughing together" class="h-full w-full object-cover" />
          </div>
          <div class="pb-2 md:pr-8 md:pb-4">
            <span class="flex gap-6 text-sm font-semibold text-ink">
              <span>FREE</span>
              <span>15MIN</span>
            </span>
            <h2 class="mt-4 text-4xl font-semibold leading-tight text-ink md:text-6xl">Not sure where to stand?</h2>
            <p class="mt-4 max-w-md text-black/60">Answer a few questions and get a personalized assessment: your level, your strengths, and the plan we'd recommend to get you to your first proper samtale.</p>
            <RouterLink to="/signup" class="mt-6 inline-block rounded-full bg-red px-6 py-3.5 text-sm font-semibold text-white transition hover:opacity-90">
              Start the level test
            </RouterLink>
          </div>
        </div>
      </div>
    </section>

    <!-- Join us in our city walks -->
    <section id="events" class="border-b border-black/10 px-6 py-16 md:py-24">
      <div class="mx-auto max-w-5xl text-center">
        <h2 class="text-4xl font-semibold tracking-tight text-ink md:text-6xl">Join us in our city walks</h2>
        <p class="mx-auto mt-3 max-w-2xl text-lg text-black/60 md:text-2xl">Walks, coffee, culture and conversation with learners who are just like you.</p>

        <div class="mt-8 flex flex-wrap justify-center gap-2">
          <button
            v-for="city in CITIES"
            :key="city"
            @click="activeCity = city"
            class="rounded-full px-5 py-2.5 text-sm font-medium transition"
            :class="activeCity === city ? 'bg-ink text-white' : 'border border-black/15 text-ink hover:opacity-70'"
          >
            {{ city }}
          </button>
        </div>

        <div v-if="cityEvents.length" class="mt-10 grid grid-cols-1 gap-6 text-left md:grid-cols-3">
          <div v-for="e in cityEvents" :key="e.$id" class="overflow-hidden rounded-[28px] border border-black/10 shadow-[0_8px_24px_0_rgba(23,23,23,0.07)]">
            <div class="aspect-[4/3] overflow-hidden bg-sky">
              <img v-if="e.imageUrl" :src="e.imageUrl" :alt="e.title" class="h-full w-full object-cover" />
            </div>
            <div class="p-6">
              <span class="rounded-full bg-sky/40 px-3 py-1.5 text-xs font-semibold uppercase tracking-wide text-ink">{{ formatDate(e.dateTime) }} · {{ e.city }}</span>
              <h3 class="mt-3 text-2xl text-ink">{{ e.title }}</h3>
              <p class="mt-3 text-base text-ink/70">{{ e.description }}</p>
              <RouterLink to="/events" class="mt-6 block rounded-full bg-red px-4 py-3 text-center text-sm font-semibold text-white transition hover:opacity-90">
                Save your spot
              </RouterLink>
            </div>
          </div>
        </div>
        <p v-else class="mt-10 text-sm text-black/60">No walks scheduled in {{ activeCity }} yet — check back soon, or see all events →
          <RouterLink to="/events" class="font-semibold text-red hover:underline">Events</RouterLink>
        </p>
      </div>
    </section>

    <!-- Reviews -->
    <section class="border-b border-black/10 px-6 py-16 md:py-24">
      <div class="mx-auto max-w-4xl text-center">
        <h2 class="text-3xl font-semibold tracking-tight text-ink md:text-4xl">
          Transform your life in Denmark with
          <span class="inline-flex align-middle">
            <img :src="danesLogoRedImg" alt="DANES" class="ml-1 h-9 w-auto rounded-lg md:h-11" />
          </span>
        </h2>
      </div>
      <div class="mx-auto mt-10 grid max-w-4xl grid-cols-1 gap-6 md:grid-cols-3">
        <div v-for="r in reviews" :key="r.name" class="rounded-2xl bg-black/5 p-6">
          <p class="text-sm text-red">★★★★★</p>
          <q class="mt-4 block text-sm font-medium text-ink">{{ r.quote }}</q>
          <div class="mt-5 flex items-center gap-3">
            <div class="h-9 w-9 rounded-full bg-sky" />
            <div><b class="block text-xs font-semibold text-ink">{{ r.name }}</b><span class="text-xs text-black/60">{{ r.context }}</span></div>
          </div>
        </div>
      </div>
    </section>

    <!-- Speaking club — Friday Zoom banner -->
    <section class="bg-red px-6 py-16 md:py-20">
      <div class="mx-auto grid max-w-5xl grid-cols-1 items-center gap-10 md:grid-cols-[1.15fr_0.85fr]">
        <div>
          <span class="flex gap-6 text-sm font-semibold uppercase tracking-wide text-white">
            <span>Speaking club</span>
            <span>45min session</span>
          </span>
          <h2 class="mt-4 text-4xl font-semibold leading-tight text-white md:text-6xl">Every Friday, we get together on Zoom.</h2>
          <div class="mt-6 flex items-center gap-3">
            <div class="flex -space-x-3">
              <span v-for="(c, i) in ['bg-sky', 'bg-ink', 'bg-white']" :key="i" class="h-9 w-9 rounded-full border-2 border-red" :class="c" />
            </div>
            <span class="rounded-full bg-white px-3.5 py-1.5 text-sm font-medium text-ink">+150</span>
          </div>
          <RouterLink to="/live-classes" class="mt-6 inline-block rounded-full bg-sky px-6 py-3.5 text-sm font-semibold text-ink transition hover:opacity-90">
            Join the Speaking Club
          </RouterLink>
        </div>
        <div class="aspect-[4/5] overflow-hidden rounded-[32px] md:rounded-[58px]">
          <img v-if="speakingClubImageUrl" :src="speakingClubImageUrl" alt="Speaking Club on a Zoom call" class="h-full w-full object-cover" />
        </div>
      </div>
    </section>

    <!-- FAQ -->
    <section id="faq" class="px-6 py-16 md:py-24">
      <div class="mx-auto grid max-w-4xl grid-cols-1 gap-10 md:grid-cols-[0.8fr_1.2fr] md:gap-14">
        <div>
          <span class="inline-block rounded-full border border-black/10 px-4 py-1.5 text-xs font-semibold text-red">FAQ</span>
          <h2 class="mt-3 text-3xl font-bold tracking-tight text-ink">Got a question?</h2>
          <p class="mt-3 max-w-xs text-black/60">Everything you're probably wondering before you sign up.</p>
        </div>
        <div class="rounded-2xl border border-black/10 bg-black/5 px-6">
          <div v-for="(item, i) in faqs" :key="item.q" :class="i !== faqs.length - 1 ? 'border-b border-black/10' : ''">
            <button @click="toggleFaq(i)" class="flex w-full items-center justify-between py-5 text-left text-sm font-semibold text-ink">
              {{ item.q }}
              <span class="ml-4 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-ink text-xs text-white">
                {{ openFaq === i ? '−' : '↓' }}
              </span>
            </button>
            <p v-if="openFaq === i" class="pb-5 text-sm text-black/60">{{ item.a }}</p>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
