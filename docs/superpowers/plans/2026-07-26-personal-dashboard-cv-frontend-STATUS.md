# Status: Personal Dashboard CV Frontend — Paused

**Paused on:** 2026-07-26
**Branch state:** Merged into `main` up through Task 10. Work resumes as new tasks on top of `main` — no open feature branch/worktree remains.
**Plan:** `docs/superpowers/plans/2026-07-26-personal-dashboard-cv-frontend.md` (17 tasks total)
**Spec:** `docs/superpowers/specs/2026-07-26-personal-dashboard-cv-design.md`

## Done (Tasks 1–10, all merged to `main`)

1. Fixed broken shadcn scaffold (`src/lib/utils.ts`)
2. Vitest + @vue/test-utils + jsdom testing tooling
3. Mint Tech visual theme (`src/style.css`)
4. Vue Router with `/`, `/klien`, `/recruiter` (stub page content only — see below)
5. Static data layer: `src/data/portfolio.ts`, `services.ts`, `profile.ts`
6. Pricing calculator logic: `src/lib/pricing.ts` (`calculatePrice`, `formatRupiah`)
7. Booking form schema: `src/lib/bookingSchema.ts` (zod)
8. `src/components/layout/SiteFooter.vue`
9. `src/components/layout/NavBar.vue`
10. `src/components/story/ChapterSection.vue` (motion-v scrollytelling wrapper)

**Current verified state on `main`:** `pnpm build` passes, `pnpm test` passes (9 test files, 17 tests).

## One real bug found and fixed along the way (worth knowing about)

Vitest was picking up test files from inside `.claude/worktrees/**` (the worktree lives physically nested inside the repo), doubling every test and causing cross-resolution failures (duplicate `vue-router`/`@vue/test-utils` instances broke `RouterLinkStub` matching). Fixed by adding `exclude: ['**/node_modules/**', '**/.claude/**']` to the `test` block in `vite.config.ts` (commit `e4730d3`). **If a future worktree is created for the remaining tasks, re-verify this exclude is still in place and still works** — it's easy to lose track of since it only bites when running tests from the repo root while a worktree is present.

Also worth knowing: the plan's original `src/test/setup.ts` code used `@ts-expect-error` comments that this TypeScript version (`~6.0.2`) flagged as "unused directive" (`TS2578`), breaking the build. Fixed with type assertions instead (see `src/test/setup.ts` on `main`). If you're referencing the plan file for exact code to paste, use what's actually in `main`, not the plan's original snippet for that one file.

## Not done yet (Tasks 11–17 — remaining work)

11. `PortfolioGallery.vue` — shared gallery component (3 items from `src/data/portfolio.ts`)
12. `PricingCalculator.vue` — interactive UI wired to `calculatePrice()`/`formatRupiah()`
13. `BookingForm.vue` — vee-validate + zod form, emits `submitted` (no Supabase call yet — intentionally deferred, see spec)
14. `LandingPage.vue` real content (currently just a `<h1>Landing Page</h1>` stub)
15. `KlienPage.vue` real content — assembles Tasks 11–13 into 5 `ChapterSection`s (currently just a `<h1>Klien Page</h1>` stub)
16. `RecruiterPage.vue` real content — 5 `ChapterSection`s with About/Skills/Contact (currently just a `<h1>Recruiter Page</h1>` stub)
17. Final integration check (full test suite, `pnpm build`, manual browser smoke test of all 3 routes)

Full task text (exact code, file paths, test content) for all of these is already written out in `docs/superpowers/plans/2026-07-26-personal-dashboard-cv-frontend.md` — no re-planning needed, just resume execution from Task 11.

## How to resume

1. Set up a worktree again (or work directly on `main` if isolation isn't needed for a short remaining stretch — your call at resume time).
2. Pick up Task 11 from the plan file and continue sequentially through Task 17.
3. Each task in the plan is already self-contained (files to touch, exact code, exact test commands) — no additional context-gathering should be needed.

## Explicitly out of scope (per the design spec, not forgotten)

- Supabase persistence + email notification for the booking form (user is setting up Supabase separately later)
- Dark mode, CMS-driven portfolio content, i18n
- The actual CV PDF file for the `/recruiter` download button (link will point to a file that doesn't exist yet — known, called out in Task 17)
