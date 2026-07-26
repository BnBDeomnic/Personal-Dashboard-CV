# Personal Dashboard CV — Design Spec

Date: 2026-07-26
Status: Approved (ready for implementation planning)

## 1. Purpose

A personal portfolio site that serves two audiences at once:

- **Klien** (UMKM/bisnis kecil) looking to hire freelance web/UI-UX services.
- **Recruiter** evaluating the owner as a candidate (internship/job) after graduation.

Primary goal (business context): support closing 5–8 small freelance projects within
2 months by presenting a credible, professional portfolio that converts visitors into
inquiries. Secondary goal: double as a CV for job/internship applications.

## 2. Tech Stack

- **Vue 3** + **Vite** + **TypeScript**
- **vue-router** (v4) — client-side routing between `/`, `/klien`, `/recruiter`
- **Tailwind CSS v4** (`@tailwindcss/vite`)
- **shadcn-vue** (style: `new-york`) for UI primitives, aliased under `@/components/ui`
- **motion-v** — Vue port of Motion/Framer Motion, used for scroll-reveal animations
- **@supabase/supabase-js** — stores booking/contact form submissions
- **vee-validate** + **zod** (`@vee-validate/zod`, zod pinned to `^3.24.0` for
  compatibility with `@vee-validate/zod`) — booking form validation
- **@lucide/vue** — icon set (replaces deprecated `lucide-vue-next`)
- Package manager: **pnpm**, pinned via `packageManager: "pnpm@10.33.0"` in
  `package.json` to avoid corepack store-version conflicts.

## 3. Site Structure (Approach C3: Landing + Two Dedicated Pages)

Three routes, chosen over a single toggling page so each audience gets a page fully
tailored to it, at the cost of duplicating the Portfolio Gallery and Footer — which is
mitigated by extracting them as shared components.

- **`/` — Landing**: minimal gateway. Avatar, name, one-line tagline, and two buttons:
  "Saya Klien, cari jasa →" and "Saya Recruiter →". No long scroll, no chapters.
- **`/klien`**: sales-oriented. Sections (see §5).
- **`/recruiter`**: CV-oriented. Sections (see §5).

### Shared components (used by both `/klien` and `/recruiter`)

- `PortfolioGallery` — same 3 items on both pages, single source of data.
- `SiteFooter` — contact links, consistent across pages.
- `NavBar` — shows a small "mode" pill linking to the other page (`Mode: Klien · ganti
  ke Recruiter` / `Mode: Recruiter · ganti ke Klien`).

## 4. Visual Design System — "Mint Tech"

| Token | Value |
|---|---|
| Background | `#F8FAFC` |
| Text (primary) | `#0F172A` |
| Text (secondary) | `#64748B` |
| Accent / primary | `#14B8A6` (teal) |
| Accent tint (success/estimate box) | `#F0FDFA` bg, `#99F6E4` border, `#0D9488` text |
| Heading font | Space Grotesk (500/600/700) |
| Body font | Inter (400/500/600) |

Implementation notes:
- `shadcn-vue init` defaulted `components.json` to font `roboto` and base color
  `zinc` — these must be overridden: swap the Google Fonts import in `src/style.css`
  to Space Grotesk + Inter, and remap the shadcn CSS variables (`--primary`,
  `--ring`, `--accent`, etc.) from the zinc/oklch defaults to the Mint Tech teal
  scale above.
- Keep `tw-animate-css` (already wired into `src/style.css`) for shadcn's built-in
  utility animations (accordions, tooltips); it's separate from `motion-v`, which
  handles the chapter-reveal storytelling animations.

## 5. Page Content Detail

### `/klien` (chapters, each wrapped in a numbered "BAB" section for the
scrollytelling effect — see §6)

1. **Bab 01 — Hero**: "Bantu bisnis Anda punya web & tampilan yang menjual."
2. **Bab 02 — Services**: 3 package cards — Landing Page, Multi-halaman, UI/UX Only.
3. **Bab 03 — Kalkulator Estimasi Harga**:
   - Inputs: jenis project (select), jumlah halaman (stepper), fitur tambahan
     (checkboxes: WA integrasi, animasi, dll.), kecepatan pengerjaan (normal/urgent).
   - Output: computed estimated price displayed live, with a CTA that scrolls to
     the booking form (Bab 05).
   - Pricing formula is a simple additive model (base price by jenis project +
     per-page increment + per-feature flat add-ons + urgent multiplier); exact
     numbers to be finalized in the implementation plan, not this spec.
4. **Bab 04 — Portfolio Gallery** (shared component): 3 items —
   - Real UMKM landing page project (before/after)
   - UX case study (redesign of a real flawed app/flow)
   - This dashboard site itself
5. **Bab 05 — Booking / Contact Form**: nama, WhatsApp/email, kebutuhan project
   (textarea). On submit: insert row into Supabase `inquiries` table, then trigger
   an email notification (owner-facing) confirming a new lead came in. Zod schema
   validates required fields client-side before submit.

### `/recruiter`

1. **Bab 01 — Hero**: professional summary line (target role, informatics, final
   semester).
2. **Bab 02 — About**: pendidikan, lokasi, minat (Web Dev, UI/UX).
3. **Bab 03 — Skills & Experience**: tech stack, design tools, organisasi/magang.
4. **Bab 04 — Portfolio Gallery** (shared component, same data as `/klien`).
5. **Bab 05 — Contact ringkas**: "Download CV (PDF)" button + email/LinkedIn link.
   No booking form here — recruiters get a lighter-weight contact path.

## 6. Interaction / Motion Design — Scrollytelling (Approach A)

Each "Bab" section on `/klien` and `/recruiter` is:
- Labeled with a small chapter marker (e.g. `BAB 03`) for narrative pacing.
- Animated in with `motion-v` (fade + slide-up) as it enters the viewport, using
  Vue's `<motion.div>`-style component with `whileInView`/`viewport` props (or
  the `v-motion` directive equivalent, whichever `motion-v`'s API surface uses at
  implementation time — to confirm against its docs).
- The Landing page (`/`) has no chapters/animation — it's a static, immediate
  choice screen by design, so it doesn't slow down a visitor who already knows why
  they're there.

This spec intentionally does not lock the animation timing/easing curves — those
are implementation details to be tuned by feel, not upfront design decisions.

## 7. Data — Supabase

Single table for v1: `inquiries` (or similar), populated only by the `/klien`
booking form. Minimum columns: name, contact (WA/email), message, calculator
snapshot (jenis project, jumlah halaman, fitur, kecepatan, estimated price),
created_at. No CMS usage in v1 — portfolio content stays hardcoded in the Vue
components (per earlier decision: "belum perlu sekarang" for CMS).

Email notification mechanism (which provider, e.g. Resend, and whether it's a
Supabase Edge Function or a separate serverless call) is left to the
implementation plan.

## 8. Out of Scope (v1)

- Supabase-backed CMS for portfolio content (hardcoded for now).
- Guided/interactive click-through storytelling (Approach C from the story-feel
  exploration) — noted as a possible v2 direction once the site is already
  generating leads.
- Dark mode.
- Any i18n / English version.

## 9. Open Items for Implementation Plan

- Exact pricing calculator formula/numbers.
- Email provider choice + whether via Supabase Edge Function or client-side call.
- Content for the 3 portfolio pieces (real project write-ups, images).
- Actual CV PDF file for the `/recruiter` download button.
