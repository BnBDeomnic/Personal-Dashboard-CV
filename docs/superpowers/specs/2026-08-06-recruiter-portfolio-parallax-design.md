# Recruiter Page — Portfolio as Page 2, with Parallax Reveal — Design

Date: 2026-08-06
Status: Approved

## Context

Following the earlier simplification of the recruiter hero (see
`2026-08-06-recruiter-onboarding-parallax-design.md`), the recruiter page's
focus shifts to portfolio-first: Page 1 is the Hero, Page 2 is Portfolio,
revealed with a parallax effect as the user scrolls from one into the other.
The remaining story sections (intro, About, Skills, Contact) stay, just
pushed below Page 2 and renumbered.

This change is scoped to `src/pages/RecruiterPage.vue` only. Klien mode/page
is out of scope, as established in the prior design.

## Goals

- New section order on `/recruiter`: Hero (page 1) → Portfolio (page 2) →
  BAB 01 Intro singkat → BAB 02 About → BAB 03 Skills & Experience →
  BAB 04 Contact → Footer.
- Portfolio is promoted out of the small `ChapterSection` card wrapper into
  its own full-bleed section with the same visual weight as the Hero (proper
  heading + subtitle, generous padding), containing the unchanged
  `PortfolioGallery` grid.
- Scrolling from Hero into Portfolio uses a parallax "reveal" effect: the
  Hero's background stays pinned briefly while the Portfolio section slides
  up to cover it, using pure CSS `position: sticky` — no JS scroll-jacking,
  no `preventDefault`, no programmatic `scrollTo`. The user's scroll stays
  100% native, consistent with the "just scroll down" requirement from the
  prior design.
- BAB numbering after Portfolio shifts down by one (former BAB 05 Contact
  becomes BAB 04), since Portfolio leaves the BAB sequence entirely.

## Non-goals

- Redesigning `PortfolioGallery.vue`'s internal grid/card markup — reused as-is.
- Changing klien mode/page.
- Changing the Hero's own internals (already simplified in the prior design) beyond wrapping it for the sticky reveal.
- Changing NavBar, SiteFooter, or routing.

## Design

### Structure in `RecruiterPage.vue`

```
<NavBar mode="recruiter" />

<!-- Page 1 + Page 2 parallax reveal wrapper -->
<div class="relative">
  <div class="sticky top-0 h-screen">
    <StoryHero mode="recruiter" />   <!-- pinned background -->
  </div>
</div>
<section class="relative z-10 -mt-screen ...">  <!-- Portfolio, page 2 -->
  ...
</section>

<ChapterSection number="BAB 01" title="Calon Software Developer &amp; UI/UX Designer">...</ChapterSection>
<ChapterSection number="BAB 02" title="About">...</ChapterSection>
<ChapterSection number="BAB 03" title="Skills &amp; Experience">...</ChapterSection>
<ChapterSection number="BAB 04" title="Contact">...</ChapterSection>

<SiteFooter />
```

The exact sticky/overlap mechanics (wrapper height, negative margins) are an
implementation detail to be worked out during coding — the constraint is:
native scroll only, Hero visually pinned while Portfolio slides over it,
no layout jump, works from mobile widths up.

### Portfolio section (page 2)

- New template block directly in `RecruiterPage.vue` (not a new component —
  it's page-specific chrome around the existing, reused `PortfolioGallery`).
- Light, opaque background (e.g. white/`bg-background`) with rounded top
  corners so it visually "caps" the dark Hero as it slides over.
- Heading ("Portfolio") + a short one-line subtitle, generous vertical
  padding (`py-16` or similar, full-bleed `px-6`), then `<PortfolioGallery />`
  unchanged.
- No BAB number — visually and semantically it's "page 2", not a story
  chapter.

### Story sections below Page 2

- `ChapterSection` usage for intro/About/Skills/Contact is unchanged except:
  - The Portfolio `ChapterSection` block is deleted (content moved to the
    new page-2 section above).
  - `number="BAB 05"` on the Contact section becomes `number="BAB 04"`.

## Testing

- `RecruiterPage.test.ts` (existing): update/extend to assert the new order
  — Portfolio content appears before "Calon Software Developer" intro text,
  and Contact section now carries `BAB 04` instead of `BAB 05`.
- No new unit test for the sticky/parallax CSS itself (not meaningfully
  testable via `@vue/test-utils`/jsdom, consistent with how the Hero's own
  parallax orbs were left untested in the prior design) — verified visually
  instead (Playwright now available for this).
- Run `pnpm test` after implementation to confirm no regressions.
