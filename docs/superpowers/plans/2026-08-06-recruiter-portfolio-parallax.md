# Recruiter Page — Portfolio as Page 2, with Parallax Reveal Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Restructure `/recruiter` into Page 1 (Hero) → Page 2 (Portfolio, promoted out of the BAB sequence) → BAB 01-04 (Intro/About/Skills/Contact) → Footer, with a pure-CSS `position: sticky` parallax reveal where the Hero stays pinned while Portfolio slides up to cover it.

**Architecture:** `StoryHero` (recruiter mode, already normal-flow from the prior simplification) gets wrapped in a taller-than-viewport container with an inner `sticky top-0 h-screen` div, giving it room to stay pinned during scroll. A new page-2 `<section>` for Portfolio sits immediately after with a negative top margin and higher `z-index`, so it visually rises over the still-pinned Hero as the user scrolls. No JS scroll-jacking — 100% native scroll, matching the spec's "just scroll down" requirement.

**Tech Stack:** Vue 3 `<script setup>`, Tailwind CSS v4 utility classes, Vitest + `@vue/test-utils` for the structural test, Playwright MCP for visual verification (no code changes from it unless tuning is needed).

**Spec:** `docs/superpowers/specs/2026-08-06-recruiter-portfolio-parallax-design.md`

---

### Task 1: Restructure `RecruiterPage.vue` — Portfolio as page 2, renumbered BAB sequence

**Files:**
- Modify: `src/pages/RecruiterPage.vue`
- Test: `src/pages/RecruiterPage.test.ts`

- [ ] **Step 1: Write the failing test**

Replace the full contents of `src/pages/RecruiterPage.test.ts` with:

```typescript
// src/pages/RecruiterPage.test.ts
import { describe, expect, it } from 'vitest'
import { mount, RouterLinkStub } from '@vue/test-utils'
import RecruiterPage from './RecruiterPage.vue'

describe('RecruiterPage', () => {
  it('renders Portfolio as page 2 (no BAB number) directly before BAB 01-04, and a CV download link', () => {
    const wrapper = mount(RecruiterPage, {
      global: { stubs: { RouterLink: RouterLinkStub } },
    })
    const text = wrapper.text()

    expect(text).toContain('BAB 01')
    expect(text).toContain('BAB 02')
    expect(text).toContain('BAB 03')
    expect(text).toContain('BAB 04')
    expect(text).not.toContain('BAB 05')

    // Portfolio (page 2) appears before the BAB 01 intro chapter
    expect(text.indexOf('Portfolio')).toBeGreaterThan(-1)
    expect(text.indexOf('Portfolio')).toBeLessThan(text.indexOf('BAB 01'))

    expect(wrapper.findAll('article')).toHaveLength(6) // 3 skill groups + 3 portfolio items

    const downloadLink = wrapper.get('a[download]')
    expect(downloadLink.text()).toContain('Download CV')
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/pages/RecruiterPage.test.ts`

Expected: FAIL — the current page still contains `BAB 05` and doesn't have "Portfolio" text appearing before "BAB 01" (Portfolio is currently `BAB 04`, after BAB 01-03).

- [ ] **Step 3: Restructure the page template**

Replace the full contents of `src/pages/RecruiterPage.vue` with:

```vue
<script setup lang="ts">
import NavBar from '@/components/layout/NavBar.vue'
import SiteFooter from '@/components/layout/SiteFooter.vue'
import ChapterSection from '@/components/story/ChapterSection.vue'
import StoryHero from '@/components/story/StoryHero.vue'
import PortfolioGallery from '@/components/portfolio/PortfolioGallery.vue'
import { skillGroups } from '@/data/profile'

const cvFileHref = '/cv-bagus-wikan.pdf'
</script>

<template>
  <div>
    <NavBar mode="recruiter" />

    <!-- Page 1: Hero. Wrapper is taller than one viewport so the inner
         sticky Hero has room to stay pinned while the user scrolls,
         before Page 2 (Portfolio) rises to cover it. -->
    <div class="relative h-[160vh]">
      <div class="sticky top-0 h-screen overflow-hidden">
        <StoryHero mode="recruiter" />
      </div>
    </div>

    <!-- Page 2: Portfolio. Negative top margin pulls it up so it visually
         slides over the still-pinned Hero as the user scrolls past it;
         z-10 keeps it painting above the Hero during the overlap. -->
    <section
      class="relative z-10 -mt-[40vh] rounded-t-[2.5rem] bg-background px-6 pt-16 pb-16 shadow-[0_-20px_60px_-15px_rgba(0,0,0,0.35)] sm:pt-20 sm:pb-20"
    >
      <div class="mx-auto max-w-4xl text-center">
        <p class="mb-2 text-xs font-semibold tracking-[0.3em] uppercase text-primary">
          Portfolio
        </p>
        <h2 class="mb-3 font-heading text-3xl font-bold text-foreground sm:text-4xl">
          Portfolio
        </h2>
        <p class="mb-10 text-sm text-muted-foreground sm:text-base">
          Beberapa proyek yang menunjukkan cara saya berpikir dan membangun produk.
        </p>
        <PortfolioGallery />
      </div>
    </section>

    <ChapterSection number="BAB 01" title="Calon Software Developer &amp; UI/UX Designer">
      <p class="text-muted-foreground">
        Mahasiswa Informatika, semester akhir — siap kontribusi di tim engineering/produk.
      </p>
    </ChapterSection>

    <ChapterSection number="BAB 02" title="About">
      <ul class="space-y-1 text-sm text-muted-foreground">
        <li><strong class="text-foreground">Pendidikan:</strong> S1 Informatika — Semester Akhir</li>
        <li><strong class="text-foreground">Lokasi:</strong> Yogyakarta, Indonesia</li>
        <li><strong class="text-foreground">Minat:</strong> Web Development, UI/UX Design</li>
      </ul>
    </ChapterSection>

    <ChapterSection number="BAB 03" title="Skills &amp; Experience">
      <div class="grid gap-4 sm:grid-cols-3">
        <article
          v-for="skill in skillGroups"
          :key="skill.id"
          class="rounded-lg border border-border bg-card p-4 text-left"
        >
          <h4 class="font-heading font-semibold">{{ skill.title }}</h4>
          <p class="mt-2 text-sm text-muted-foreground">{{ skill.detail }}</p>
        </article>
      </div>
    </ChapterSection>

    <ChapterSection number="BAB 04" title="Contact">
      <div class="flex flex-wrap gap-3">
        <a
          :href="cvFileHref"
          download
          class="rounded-md bg-primary px-4 py-2 font-heading font-semibold text-primary-foreground"
        >
          Download CV (PDF)
        </a>
        <a
          href="mailto:nama@email.com"
          class="rounded-md border border-primary px-4 py-2 font-heading font-semibold text-primary"
        >
          Email / LinkedIn
        </a>
      </div>
    </ChapterSection>

    <SiteFooter />
  </div>
</template>
```

This removes the old `ChapterSection number="BAB 04" title="Portfolio"` block entirely (its content — `<PortfolioGallery />` — moved into the new page-2 `<section>`), and renumbers the former `BAB 05` Contact chapter to `BAB 04`.

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/pages/RecruiterPage.test.ts`

Expected: PASS

- [ ] **Step 5: Run the full test suite to check for regressions**

Run: `npx vitest run`

Expected: All test files pass (no other test references `BAB 05` or the old Portfolio chapter position — `KlienPage.test.ts` and `StoryHero.test.ts` are unaffected since they don't touch `RecruiterPage.vue`).

- [ ] **Step 6: Commit**

```bash
git add src/pages/RecruiterPage.vue src/pages/RecruiterPage.test.ts
git commit -m "feat: promote recruiter Portfolio to page 2 with sticky parallax reveal"
```

---

### Task 2: Visual verification and tuning via Playwright

**Files:**
- Possibly modify: `src/pages/RecruiterPage.vue:11-13,17` (the `h-[160vh]`, `-mt-[40vh]` values) if the reveal doesn't look right
- Possibly modify: `src/components/story/StoryHero.vue` (recruiter mode root, currently `min-h-screen`) if content is clipped by the new `overflow-hidden` wrapper

This task has no predetermined code changes — Step 3 only applies if Step 2's observation calls for it.

- [ ] **Step 1: Start the dev server**

Run in background: `pnpm dev`

Note the local URL it prints (e.g. `http://localhost:5173/` — check the terminal output, Vite picks the next free port if 5173 is taken).

- [ ] **Step 2: Drive the page with Playwright and capture the reveal**

Using the `playwright` MCP tools:
1. `browser_navigate` to `http://localhost:<port>/recruiter`
2. `browser_take_screenshot` — capture the initial state (Hero fully visible, Portfolio not yet showing)
3. `browser_evaluate` with `() => window.scrollTo(0, window.innerHeight * 0.9)` — scroll partway into the sticky wrapper's extra room
4. `browser_take_screenshot` — capture mid-scroll: Hero should still be visible/pinned, Portfolio's rounded top edge should be rising into view over it
5. `browser_evaluate` with `() => window.scrollTo(0, window.innerHeight * 1.8)` — scroll past the reveal
6. `browser_take_screenshot` — capture the settled state: Portfolio should now fully cover the viewport, Hero no longer visible
7. `browser_console_messages` — check for any runtime errors/warnings introduced by the new markup

Judge against the spec: Hero visible and pinned first, Portfolio's rounded top visibly rising over it mid-scroll (not appearing instantly, not overlapping from the very start), no layout jump, no clipped content (e.g. the Hero's bottom scroll-indicator or the Portfolio heading shouldn't be cut off).

- [ ] **Step 3 (only if Step 2 shows a problem): Adjust and re-verify**

Common fixes, applied directly to `src/pages/RecruiterPage.vue`:
- Reveal happens too early/late → adjust `-mt-[40vh]` (smaller magnitude = later reveal, larger = earlier) on the `<section>` from Step 3 of Task 1.
- Not enough/too much "stuck" time before Portfolio fully covers → adjust `h-[160vh]` on the outer Hero wrapper div (closer to `h-screen` = shorter stuck time, larger = longer).
- Hero content (e.g. the scroll indicator or CTA text) is clipped at the bottom → this means the Hero's own content, in `src/components/story/StoryHero.vue`'s recruiter branch, is taller than 100vh at the tested viewport size. Reduce vertical padding there (e.g. `py-10 sm:py-14` → `py-6 sm:py-10`) rather than removing `overflow-hidden` from the wrapper (removing it breaks the pin illusion).

After any change, repeat Step 2's navigate + screenshot sequence to confirm the fix, then:

```bash
npx vitest run src/pages/RecruiterPage.test.ts
```

Expected: still PASS (these are visual-only Tailwind value changes, not structural).

- [ ] **Step 4: Stop the dev server**

Find and kill the process started in Step 1 (e.g. via `netstat -ano | grep <port>` then `taskkill //PID <pid> //F` on Windows) so it doesn't linger.

- [ ] **Step 5: Commit (only if Step 3 made changes)**

```bash
git add src/pages/RecruiterPage.vue src/components/story/StoryHero.vue
git commit -m "fix: tune recruiter page-2 parallax reveal timing"
```

If Step 2 showed no issues, skip this commit — nothing changed.
