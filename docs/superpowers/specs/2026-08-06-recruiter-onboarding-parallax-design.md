# Recruiter Onboarding Hero Simplification — Design

Date: 2026-08-06
Status: Approved

## Context

`StoryHero.vue` currently implements a scroll-jacking "pinned card deck" mechanic shared by both `mode="klien"` and `mode="recruiter"`: the section is wrapped in a very tall container (`h-[300vh]` for recruiter, `h-[220vh]` for klien), pinned via `sticky top-14`, and driven by a `wheel` listener that calls `preventDefault()` and programmatically scrolls the page to step through narrative beats / value cards one at a time.

For recruiter mode, this is being replaced with a simple, non-hijacked onboarding: the user scrolls down normally, background elements move with a lightweight parallax effect, and the page flows naturally into the main `ChapterSection` content (BAB 01–05) below. Klien mode is explicitly out of scope for this change and keeps its existing pinned wheel-jacking mechanic.

## Goals

- Recruiter hero (`StoryHero.vue`, `mode="recruiter"`) becomes a normal-flow section (~100vh, `min-h-screen`), not pinned/sticky, with no wheel `preventDefault` hijacking.
- All 4 narrative beats (Awal Mula, Titik Nyala, Pertemuan dengan Desain, Sekarang) are shown together as a static vertical timeline, each revealed via scroll-into-view animation (not step-gated by scroll position).
- Background parallax orbs continue to move subtly, scoped to the hero's own scroll position (not the old 300vh `scrollProgress`).
- "Scroll untuk melanjutkan cerita" indicator remains as a visual cue into the content below.
- Klien mode (`mode="klien"`) is unchanged — same container, same `handleScroll`/`handleWheel` pinned-card mechanic.

## Non-goals

- Redesigning klien mode's onboarding (explicitly deferred — "recruiter saja dulu").
- Redesigning the BAB 01–05 `ChapterSection` content itself.
- Changing NavBar or other layout components.

## Design

### Template structure

`StoryHero.vue` currently has one top-level `containerRef` div wrapping a `sticky top-14` inner section, inside which `v-if="mode === 'recruiter'"` / `v-else` branches render. This shared wrapper is split:

- **Recruiter branch**: rendered as its own top-level section, no `containerRef`/sticky wrapper, no dynamic height hack — just `min-h-screen` normal-flow markup.
- **Klien branch**: keeps the existing `containerRef` + `sticky top-14 h-[calc(100vh-3.5rem)]` pinned wrapper and `h-[220vh]` spacer, unchanged.

### Recruiter hero content

- Same dark gradient background (`#0F172A → #0D2235 → #0B1E3A`), same parallax background blobs and noise texture.
- Same label ("Tentang Saya · Untuk Recruiter") and headline.
- All 4 `recruiterBeats` render together in the vertical timeline (icon bubble + label + text), each wrapped in a `motion.div` using `while-in-view` (same pattern as `ChapterSection.vue`) with a small per-item stagger delay (e.g. `delay: i * 0.1`), `once: true`.
- Bottom CTA/stats block ("Mari bangun sesuatu yang berarti, bersama.") and the "Scroll untuk melanjutkan cerita" indicator render unconditionally at the end of the hero (no longer gated behind `recruiterStep >= 3`).

### Parallax behavior

- A local `heroRef` + scroll listener (`onMounted`/`onUnmounted`, passive) computes a 0–1 progress value based on how far the recruiter hero element has scrolled through the viewport (e.g. using `getBoundingClientRect()` relative to `window.innerHeight`), clamped to [0, 1].
- This progress value drives the existing background orb `translate3d` parallax offsets (same visual effect as today), but is no longer tied to the old `scrollProgress` computed from the 300vh container, and does not call `preventDefault` or programmatically scroll.

### Removed (recruiter only)

- `recruiterStep` computed and all `:class` bindings gated on it.
- The `handleWheel` recruiter early-return branch (recruiter no longer participates in wheel handling at all).
- The 300vh spacer / pinned sticky wrapper for recruiter.

### Code layout

Single-file `StoryHero.vue` is kept (not split into two components) — the mode-based branching already exists and this keeps the parallax-orb visual style shared/consistent. Recruiter-specific scroll logic (heroRef, scroll listener, progress ref) is added alongside the existing klien-specific logic (`containerRef`, `handleScroll`, `handleWheel`), each scoped to its own mode.

## Testing

- New `StoryHero.test.ts`: mount with `mode="recruiter"`, assert all 4 beat labels render, headline renders, and no `wheel` listener with `preventDefault` is attached for this mode (smoke-level coverage; motion-v `while-in-view` behavior itself is not unit-tested, consistent with `ChapterSection.test.ts`).
- Klien mode is unchanged and has no existing tests — none added (out of scope).
- Run `pnpm test` after implementation to confirm no regressions in `RecruiterPage.test.ts` / `KlienPage.test.ts`.
