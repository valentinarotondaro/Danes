# AGENTS.md

## Purpose
This project (DANES) is a Vue 3 + Appwrite exam project — a Danish learning and community platform. Keep solutions simple, readable, and easy to explain in class and at the oral exam.

## Vue
- Prefer Vue 3 latest patterns with `<script setup>`.
- Prefer `defineModel()` over manual prop/emit pairs for simple two-way binding.
- Use `defineProps()` and `defineEmits()` when the component API is not just a simple model.
- Preserve reactivity. Do not create non-reactive snapshots from refs.
- Prefer small composables for reusable stateful logic.
- No Pinia — shared state (e.g. auth) lives in module-level composables (`useAuth`).

## Design
- Favor SRP: each component, composable, or service should have one clear responsibility.
- Favor SoC: keep UI, reactive state, and external data access in separate layers.
- Keep views focused on rendering and user interaction.
- Keep composables focused on state, orchestration, and UI actions.
- Keep services focused on **Appwrite** or other external API calls.
- Write permissions are enforced at the Appwrite backend level (Teams), not just hidden in the UI.
- Content access (purchased lessons) is gated client-side via `useCourseAccess` against the `orders` collection — this is a documented tradeoff, not an oversight, since YouTube embeds make full server-side DRM impractical.

## Style
- Prefer small, incremental changes that are easy to understand as a student.
- Avoid unnecessary abstraction unless it clearly improves readability or reuse.
- Styling via Tailwind CSS v4 (`@theme` in `styles.css`, no `tailwind.config.js`).
- Components organized by domain in `src/components` (account, admin, bundle/package, course, event, layout, liveClass, order).

## Future (if needed)
- Add handlers/helpers layer only if composables start mixing too much unrelated logic — not needed for MVP.