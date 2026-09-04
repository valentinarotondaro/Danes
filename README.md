# DANES — Project Skeleton

"Learn, Practice, Belong" — a Danish learning + community platform for immigrants and expats.

This is **Step 9, Phase 1** of the build: the project skeleton only. No Appwrite
collections exist yet, no views are actually built out — this just proves the
whole toolchain wires together (Vite -> Vue Router -> Tailwind v4 -> Appwrite SDK).

## Stack

- Vue 3 + Composition API
- Vite
- Vue Router 4 (with auth/admin navigation guards)
- Tailwind CSS v4 (via `@tailwindcss/vite` — no separate config file needed)
- Appwrite SDK
- Vitest + @vue/test-utils (for composable unit tests, added in Phase 5)

## Getting started

```bash
npm install
cp .env.example .env   # then fill in your real Appwrite project values
npm run dev
```

## Folder structure

```
src/
├── views/              13 route-level pages (currently placeholders)
├── components/
│   ├── base/            generic UI (LoadingState, EmptyState, ErrorState, forms...)
│   ├── layout/           AppHeader is the only one built so far
│   ├── course/           LEARN pillar
│   ├── liveClass/        PRACTICE pillar
│   ├── event/            BELONG pillar
│   ├── bundle/
│   ├── order/
│   ├── account/
│   └── admin/
├── composables/         useAuth.js is built; the rest come in Phase 3+
├── services/             appwriteClient.js (connection) + authService.js
├── router/               index.js — all 13 routes + guards
```

## What's built vs. what's a stub

| Built | Stub (placeholder only) |
|---|---|
| `appwriteClient.js` — Appwrite connection | All 13 views |
| `authService.js` — login/signup/logout/getCurrentUser | Every other service |
| `useAuth.js` — shared session state | Every other composable |
| `router/index.js` — routes + guards | — |
| `AppHeader.vue` | Every other component |

## Next steps (per the planning doc, Step 9)

1. **Appwrite backend setup** — create the 7 collections, relationships, and
   Teams-based permissions from the Step 3 data model.
2. **Auth foundation** — build out `LoginView`/`SignupView` forms (the composable
   and guards already exist).
3. **Vertical slice: Course** — `courseService.js` -> `useCourses` +
   `useCourseAccess` -> `CourseCard`/`CourseGrid`/`CourseDetailView` ->
   `AdminTable`/`AdminForm` for courses. Prove the full data loop once, then
   repeat the pattern for the rest.

## Known limitation (documented, not a bug)

Lesson content access is checked client-side via `useCourseAccess` (Phase 4+),
not enforced server-side. Documented as a V2 item — see project planning notes.
