# DANES — Your bridge into Danish life

DANES is a Danish learning platform for internationals living in Denmark. It has three parts:

- **Learn**: self-paced video courses (A1–B1) with lessons, vocabulary and progress tracking.
- **Practice**: the Friday Speaking Club, small live groups held in a video room (Jitsi).
- **Belong**: in-person events in Danish cities, such as walks, museum visits and board-game nights.

Learners sign up, take a level test, buy a plan (a single course, the Speaking Club, events or a package), then follow lessons and book seats from **My account**. Admins manage all content from a separate **admin area**.

**Live:** https://danes-app.vercel.app
Exam project for Advanced JavaScript at EASV (Multimedia Design), made by Valentina Rotondaro.

> Test accounts (learner and admin) are included in the exam submission, not in this repository.

---

## Stack

| Layer | Choice |
|---|---|
| Frontend | Vue 3 (Composition API, `<script setup>`), Vue Router 4, Vite |
| Styling | Tailwind CSS v4, with design tokens in `src/style.css` (`@theme`) |
| Backend | Appwrite Cloud: Auth, Databases, Teams and Functions |
| Video | YouTube (privacy-enhanced embeds) for lessons, Jitsi for live sessions |
| Tests | Vitest + @vue/test-utils (72 tests) |
| Hosting | Vercel (auto-deploy from `main`) |

No Pinia: shared state such as the logged-in user and toasts lives in composables with module-level state. The app is small enough that a store would add a concept without solving a problem.

## Run it locally

```bash
npm install
cp .env.example .env     # fill in your Appwrite endpoint, project ID and database ID
npm run dev
npm test                 # unit tests
```

Only the three `VITE_APPWRITE_*` variables go to the frontend. The admin scripts in `scripts/` use a server API key (`APPWRITE_API_KEY`), which stays in a local `.env` and is never committed or deployed.

## How the code is organised

Data flows in one direction:

```
views  →  composables  →  services  →  Appwrite
(pages)   (state + logic)  (one file per collection)
              ↓
            utils  (pure functions, no Vue, no Appwrite — easy to test)
```

```
src/
├── views/         Route-level pages. They wire composables to components and hold little logic.
├── components/    Grouped by feature: account, admin, auth, base, checkout, course, event, lesson, …
│   └── base/      Shared UI: BaseButton, FormField, LoadingState, EmptyState, ErrorState
├── composables/   useAuth, useLearner, useLessonPlayer, useCheckout, useAdminForm, useAdminList, …
├── services/      appwriteClient.js plus one service per collection (courseService, orderService, …)
├── utils/         Business rules: plans, learner progress, admin stats, validation, dates
└── router/        Routes and the navigation guard
functions/
└── reserve-spot/  Appwrite Function (Node) for seats at sessions and events
scripts/           Provisioning, seeding and admin setup (run locally with a server key)
```

Examples of the split:

- `utils/learner.js` decides what the learner pays, which lesson comes next and what counts as "upcoming". `useLearner.js` loads the data and calls those rules. The tab views only display the result.
- The admin area is driven by configuration. `components/admin/adminCollections.js` describes each collection: its service calls, list columns, filters and delete message. One list view and one edit view then serve courses, sessions, events, packages and teachers.

## Routing and protection

| Route | Access |
|---|---|
| `/`, `/courses`, `/live-classes`, `/events`, `/about` | Everyone |
| `/courses/:id/lessons/:lessonId`, `/checkout`, `/account/*` | Logged-in users (`meta.requiresAuth`) |
| `/admin/*` | Members of the `admins` Team (`meta.requiresAdmin`) |
| `/login`, `/signup` | Guests only; logged-in users are redirected |

A global `router.beforeEach` guard waits for the session to load, then sends visitors who aren't logged in to `/login?redirect=…`. Non-admins who try to open `/admin` are sent home.

**The guard is UX, not security.** The real protection is in Appwrite permissions:

| Collection | Read | Create / update / delete |
|---|---|---|
| teachers, courses, liveClasses, events, bundles (packages) | anyone | `admins` team only |
| lessons | logged-in users | `admins` team only |
| profiles, orders, lessonProgress, bookings | the owner (document security) and admins | the user creates their own rows; admins can read them all |

So a learner who calls the API directly still cannot edit a course or give themselves a seat.

## Data model

- **courses → lessons**: each lesson has a `courseId`, `module`, `order`, `videoUrl` and a word list.
- **teachers**: referenced by courses, sessions and events through `teacherId`.
- **liveClasses** and **events**: one row per dated occurrence, with `capacity` and `spotsBooked`.
- **bundles** (shown as "Packages"): the six plans. Each one has `includesCourse`, `includesSpeakingClub` and `includesEvents` flags and a price.
- **orders**: the entitlement table. One row per thing a user owns (`itemType`: course, liveClass, event or bundle), with a status (confirmed, waitlist or cancelled). Course access, bookings and the "My plan" summary are all read from orders.
- **lessonProgress**: one row per user per lesson they marked as done.
- **profiles**: name, level, city and email preferences, linked to the Appwrite account.

## The reserve-spot Function

Learners cannot write to `events` or `liveClasses`, so a booking can't simply be `spotsBooked + 1` from the browser. The browser calls the `reserve-spot` Function instead, which:

1. Reads the user ID from the header Appwrite adds. The user is never trusted from the request body.
2. Refuses a second booking for the same item.
3. Checks whether the user's package covers the item. If it does, the order is free.
4. Increases `spotsBooked` in a single atomic operation with `max: capacity`. Two people can't take the last seat; the second one gets "fully booked".
5. Creates the order with owner-only permissions. If that step fails, it gives the seat back.

Cancelling works the same way in reverse, with `min: 0`.

## UX states

Every page that loads data shows one of three states: **loading** (skeletons), **empty** (a clear message, e.g. "No sessions here yet") or **error** (with a retry button). The base components are `LoadingState`, `EmptyState` and `ErrorState`. Forms validate inline. Admin actions show a toast, and deleting asks for confirmation first. Lessons and checkout use a focus layout without the site header.

## Decisions and trade-offs

- **Content gating is client-side for reading.** Lessons are YouTube embeds, so a determined user could always find the video link. The app checks orders before showing a lesson (`useCourseAccess`), and lessons are only readable by logged-in users. *V2:* serve video links from a Function that checks the order first.
- **Orders as one entitlement table.** Courses, sessions, events and packages all become an order. One query answers "what does this person have?" and the account page, access checks and admin stats share it.
- **Payments are simulated.** Checkout validates the card form and creates orders, but no money is charged. *V2:* Stripe Checkout plus a webhook Function that creates the order.
- **Weekly sessions are separate rows.** "Repeat weekly" in the admin creates one row per Friday, so each date has its own capacity and attendees.
- **Images are served from `public/img`.** Image paths are stored in the database as `/img/…`, so they need to be static files. Vite only ships files in `src/assets` when the code imports them.
- **V2 ideas:** admin pages for orders and users, email reminders before a session, packages that make Friday bookings free automatically.

## Scripts

Run these locally with a server API key in `.env`. Delete the key in Appwrite afterwards.

| Command | What it does |
|---|---|
| `npm run provision` | Creates the database, collections, attributes and permissions |
| `node scripts/add-admin.mjs <userId>` | Adds a user to the `admins` team |
| `npm run seed:events` / `seed:sessions` / `seed:lessons` | Fills in demo events, Friday sessions and lessons |
| `node scripts/deploy-function.mjs` | Uploads and activates a new `reserve-spot` deployment |

---

## AI usage and reflection

**Tools:** Claude (Anthropic) for planning, architecture, code, debugging, code review and documentation. ChatGPT for the photography campaign, the images used across the site.

**What I mainly used AI for:**
- Planning the data model and the permissions (which collection, who can write).
- Generating and refactoring components and composables, then splitting logic out into testable utils.
- Writing unit tests and finding bugs.
- Turning my designs into Vue + Tailwind code.

**Where AI helped:** booking seats. Doing `spotsBooked + 1` from the browser would break permissions (learners can't write to events), and two people could take the last seat at the same time. With AI I moved this into the `reserve-spot` Function, which uses an atomic increment with a `max`. Now the backend enforces the rule, not the UI.

**Where I had to correct or reject AI suggestions:**
- **Logic bug:** My account suggested "Save 399 kr" by switching to a package. That was wrong, because the learner had *two* courses and a package only includes one. I caught it while testing with real orders. We added a guard and a unit test for it.
- **Design:** AI simplified the Events page and added a "Your pick" tag to the plan picker. I rejected both. The tag didn't explain anything to the user. I redesigned the plan picker myself in two clear groups (single plans and packages) before it was coded.
- **Details AI missed:** the logo looked pixelated (hard alpha edges). Images worked locally but broke on Vercel, because their paths pointed into `src/assets`, which only exists in development. I found both by checking the real result instead of trusting that the code "looked right".
- **Security:** early on, a `.env` file with a server key was committed. I revoked the key, removed the file from the repo and added `.env` to `.gitignore`. Now only `VITE_` variables reach the frontend.

**Reflection:** AI made me much faster at the parts with a clear right answer: boilerplate, refactoring, tests and explaining Appwrite APIs. Human judgement was still needed for what the product should do, how it should feel, and whether a suggestion actually solved the user's problem. I had to understand and test each suggestion, and I only kept the code I can explain.
