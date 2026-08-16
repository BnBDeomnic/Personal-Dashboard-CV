# Personal Dashboard CV — Frontend Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the complete front-end (routing, visual system, all page content, pricing calculator, and booking form UI) for the Personal Dashboard CV portfolio site, per `docs/superpowers/specs/2026-07-26-personal-dashboard-cv-design.md`.

**Architecture:** A Vue 3 + Vite SPA with three routes (`/`, `/klien`, `/recruiter`) sharing a `NavBar`, `SiteFooter`, and `PortfolioGallery`. Each "chapter" of content on `/klien` and `/recruiter` is wrapped in a `ChapterSection` component that adds a numbered label and a `motion-v` scroll-reveal animation (the "scrollytelling" effect from the design spec). Business logic that doesn't need a DOM (pricing calculation, form validation schema) lives in plain, unit-tested TypeScript modules under `src/lib/`, separate from the Vue components that consume them.

**Tech Stack:** Vue 3, Vite, TypeScript, vue-router, Tailwind CSS v4, shadcn-vue, motion-v, vee-validate + zod, Vitest + @vue/test-utils + jsdom.

**Out of scope for this plan** (per the design spec's "Open Items" / explicit user deferral): Supabase persistence and email notification for the booking form. The `BookingForm` component will validate input and emit a `submitted` event with the payload; the parent page reacts by showing a thank-you message. Wiring that event to Supabase + an email provider is a separate follow-up plan.

---

## Starting State (already done, do not redo)

The project was scaffolded and partially configured before this plan was written:

- `pnpm create vite@latest . -- --template vue-ts` was run, plus `pnpm dlx shadcn-vue@latest init` (style `new-york`).
- Tailwind v4, shadcn-vue deps, motion-v, `@supabase/supabase-js`, vee-validate + zod (pinned to `^3.24.0` for `@vee-validate/zod` compatibility), `@lucide/vue`, and vue-router are already installed (see `package.json`).
- `vite.config.ts` already has the `@tailwindcss/vite` plugin and the `@` → `./src` alias.
- `tsconfig.json` / `tsconfig.app.json` already have the `@/*` path mapping (note: **no** `baseUrl` — this TypeScript version deprecates it; `paths` alone is sufficient and already in place).
- `package.json` has `"packageManager": "pnpm@10.33.0"` pinned to avoid a corepack store-version conflict seen earlier.

Known broken state to fix in Task 1: `src/components/ui/button/Button.vue` imports `cn` from `@/lib/utils`, but that file was never created (the `shadcn-vue init` run failed partway through). Confirmed by running `pnpm build`, which currently fails with:

```
src/components/ui/button/Button.vue(6,20): error TS2307: Cannot find module '@/lib/utils' or its corresponding type declarations.
```

## File Structure

```
src/
  lib/
    utils.ts            # shadcn's cn() helper (create — Task 1)
    pricing.ts           # calculatePrice() + formatRupiah() (create — Task 6)
    pricing.test.ts
    bookingSchema.ts      # zod schema for the booking form (create — Task 7)
    bookingSchema.test.ts
  data/
    portfolio.ts          # 3 portfolio items (create — Task 5)
    portfolio.test.ts
    services.ts           # 3 service packages (create — Task 5)
    services.test.ts
    profile.ts             # recruiter skills/experience groups (create — Task 5)
    profile.test.ts
  components/
    layout/
      NavBar.vue           # create — Task 9
      NavBar.test.ts
      SiteFooter.vue        # create — Task 8
      SiteFooter.test.ts
    story/
      ChapterSection.vue    # create — Task 10
      ChapterSection.test.ts
    portfolio/
      PortfolioGallery.vue  # create — Task 11
      PortfolioGallery.test.ts
    klien/
      PricingCalculator.vue # create — Task 12
      PricingCalculator.test.ts
      BookingForm.vue       # create — Task 13
      BookingForm.test.ts
  pages/
    LandingPage.vue         # stub in Task 4, real content in Task 14
    LandingPage.test.ts
    KlienPage.vue           # stub in Task 4, real content in Task 15
    KlienPage.test.ts
    RecruiterPage.vue       # stub in Task 4, real content in Task 16
    RecruiterPage.test.ts
  router/
    index.ts               # create — Task 4
    index.test.ts
  test/
    setup.ts                # jsdom polyfills for IntersectionObserver/ResizeObserver (create — Task 2)
  App.vue                   # modify — Task 4
  main.ts                    # modify — Task 4
  style.css                  # rewrite — Task 3
vite.config.ts               # modify — Task 2 (add `test` block)
package.json                  # modify — Task 2 (add `test` script), Task 1 (no changes needed)
index.html                    # modify — Task 4 (title)
```

Files deleted along the way: `src/components/HelloWorld.vue`, `src/assets/hero.png`, `src/assets/vite.svg`, `src/assets/vue.svg` (all only used by the starter template markup we're replacing) — Task 4.

---

### Task 1: Fix the broken shadcn scaffold (`src/lib/utils.ts`)

**Files:**

- Create: `src/lib/utils.ts`

- [ ] **Step 1: Confirm the current failure**

Run: `pnpm build`
Expected: FAIL with `src/components/ui/button/Button.vue(6,20): error TS2307: Cannot find module '@/lib/utils'...`

- [ ] **Step 2: Create the missing utils file**

```ts
// src/lib/utils.ts
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

- [ ] **Step 3: Verify the build now passes**

Run: `pnpm build`
Expected: PASS (exits 0, produces a `dist/` folder). If `vue-tsc` still errors on something unrelated, stop and report it — everything past this point in the plan assumes a clean baseline build.

- [ ] **Step 4: Commit**

```bash
git add src/lib/utils.ts
git commit -m "fix: add missing shadcn cn() utility so the build compiles"
```

---

### Task 2: Testing tooling (Vitest + @vue/test-utils)

**Files:**

- Modify: `vite.config.ts`
- Modify: `package.json`
- Create: `src/test/setup.ts`
- Create: `src/sanity.test.ts` (deleted at the end of this task once it's served its purpose)

- [ ] **Step 1: Install test dependencies**

```bash
pnpm add -D vitest @vue/test-utils jsdom
```

- [ ] **Step 2: Add the jsdom polyfills setup file**

`motion-v`'s scroll-reveal (`whileInView`) relies on `IntersectionObserver`, which jsdom does not implement. Without this, mounting any component that uses `ChapterSection` (Task 10+) in a test would throw.

```ts
// src/test/setup.ts
class IntersectionObserverMock {
  observe() {}
  unobserve() {}
  disconnect() {}
}

class ResizeObserverMock {
  observe() {}
  unobserve() {}
  disconnect() {}
}

// @ts-expect-error jsdom does not implement these observers
globalThis.IntersectionObserver = IntersectionObserverMock;
// @ts-expect-error jsdom does not implement these observers
globalThis.ResizeObserver = ResizeObserverMock;
```

- [ ] **Step 3: Wire Vitest into `vite.config.ts`**

Replace the full contents of `vite.config.ts` with:

```ts
/// <reference types="vitest/config" />
import path from "node:path";
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  test: {
    environment: "jsdom",
    setupFiles: ["./src/test/setup.ts"],
  },
});
```

- [ ] **Step 4: Add the `test` script**

In `package.json`, add `"test": "vitest run"` to the `scripts` block, so it reads:

```json
  "scripts": {
    "dev": "vite",
    "build": "vue-tsc -b && vite build",
    "preview": "vite preview",
    "test": "vitest run"
  },
```

- [ ] **Step 5: Write a throwaway sanity test to confirm the runner works**

```ts
// src/sanity.test.ts
import { describe, expect, it } from "vitest";

describe("sanity", () => {
  it("runs", () => {
    expect(1 + 1).toBe(2);
  });
});
```

- [ ] **Step 6: Run it**

Run: `pnpm test`
Expected: PASS — 1 test file, 1 test passed.

- [ ] **Step 7: Delete the sanity test (it was only there to prove the runner works)**

Delete `src/sanity.test.ts`.

- [ ] **Step 8: Commit**

```bash
git add vite.config.ts package.json pnpm-lock.yaml src/test/setup.ts
git commit -m "chore: add Vitest + @vue/test-utils testing setup"
```

---

### Task 3: Mint Tech visual theme

**Files:**

- Modify: `src/style.css`

The current `src/style.css` mixes shadcn's default zinc/oklch theme with CSS rules for the starter-template homepage (`.hero`, `#app`, `#next-steps`, `#docs`, `.ticks`, `#spacer`, `.counter`) that we're about to delete (Task 4). Also, per the design spec, dark mode is explicitly out of scope for v1, so the `.dark` overrides and the `prefers-color-scheme` block can be dropped too.

- [ ] **Step 1: Replace the full contents of `src/style.css`**

```css
@import url("https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Inter:wght@400;500;600&display=swap");

@import "tailwindcss";
@import "tw-animate-css";

@custom-variant dark (&:is(.dark *));

:root {
  --radius: 0.625rem;

  --background: #f8fafc;
  --foreground: #0f172a;

  --card: #ffffff;
  --card-foreground: #0f172a;

  --popover: #ffffff;
  --popover-foreground: #0f172a;

  --primary: #14b8a6;
  --primary-foreground: #f8fafc;

  --secondary: #f0fdfa;
  --secondary-foreground: #0f172a;

  --muted: #f1f5f9;
  --muted-foreground: #64748b;

  --accent: #99f6e4;
  --accent-foreground: #0f172a;

  --destructive: #dc2626;

  --border: #e2e8f0;
  --input: #e2e8f0;
  --ring: #14b8a6;

  --chart-1: #14b8a6;
  --chart-2: #0ea5e9;
  --chart-3: #6366f1;
  --chart-4: #f59e0b;
  --chart-5: #fb7185;

  --sidebar: #f8fafc;
  --sidebar-foreground: #0f172a;
  --sidebar-primary: #14b8a6;
  --sidebar-primary-foreground: #f8fafc;
  --sidebar-accent: #f0fdfa;
  --sidebar-accent-foreground: #0f172a;
  --sidebar-border: #e2e8f0;
  --sidebar-ring: #14b8a6;

  --sans: "Inter", system-ui, "Segoe UI", Roboto, sans-serif;
  --heading: "Space Grotesk", system-ui, "Segoe UI", Roboto, sans-serif;
  --mono: ui-monospace, Consolas, monospace;

  font: 16px/145% var(--sans);
  color-scheme: light;
  color: var(--foreground);
  background: var(--background);
  font-synthesis: none;
  text-rendering: optimizeLegibility;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

body {
  margin: 0;
}

h1,
h2,
h3,
h4 {
  font-family: var(--heading);
  font-weight: 600;
  color: var(--foreground);
}

@theme inline {
  --font-heading: var(--heading);
  --font-sans: var(--sans);
  --color-sidebar-ring: var(--sidebar-ring);
  --color-sidebar-border: var(--sidebar-border);
  --color-sidebar-accent-foreground: var(--sidebar-accent-foreground);
  --color-sidebar-accent: var(--sidebar-accent);
  --color-sidebar-primary-foreground: var(--sidebar-primary-foreground);
  --color-sidebar-primary: var(--sidebar-primary);
  --color-sidebar-foreground: var(--sidebar-foreground);
  --color-sidebar: var(--sidebar);
  --color-chart-5: var(--chart-5);
  --color-chart-4: var(--chart-4);
  --color-chart-3: var(--chart-3);
  --color-chart-2: var(--chart-2);
  --color-chart-1: var(--chart-1);
  --color-ring: var(--ring);
  --color-input: var(--input);
  --color-border: var(--border);
  --color-destructive: var(--destructive);
  --color-accent-foreground: var(--accent-foreground);
  --color-accent: var(--accent);
  --color-muted-foreground: var(--muted-foreground);
  --color-muted: var(--muted);
  --color-secondary-foreground: var(--secondary-foreground);
  --color-secondary: var(--secondary);
  --color-primary-foreground: var(--primary-foreground);
  --color-primary: var(--primary);
  --color-popover-foreground: var(--popover-foreground);
  --color-popover: var(--popover);
  --color-card-foreground: var(--card-foreground);
  --color-card: var(--card);
  --color-foreground: var(--foreground);
  --color-background: var(--background);
  --radius-sm: calc(var(--radius) - 4px);
  --radius-md: calc(var(--radius) - 2px);
  --radius-lg: var(--radius);
  --radius-xl: calc(var(--radius) + 4px);
}

@layer base {
  * {
    @apply border-border outline-ring/50;
  }
  body {
    @apply bg-background text-foreground;
  }
}
```

- [ ] **Step 2: Verify the build still passes**

Run: `pnpm build`
Expected: PASS.

- [ ] **Step 3: Commit**

```bash
git add src/style.css
git commit -m "style: apply Mint Tech palette and fonts, drop starter-template CSS and dark mode"
```

---

### Task 4: Router, page stubs, and starter-template cleanup

**Files:**

- Create: `src/router/index.ts`
- Create: `src/router/index.test.ts`
- Create: `src/pages/LandingPage.vue` (stub)
- Create: `src/pages/KlienPage.vue` (stub)
- Create: `src/pages/RecruiterPage.vue` (stub)
- Modify: `src/App.vue`
- Modify: `src/main.ts`
- Modify: `index.html`
- Delete: `src/components/HelloWorld.vue`, `src/assets/hero.png`, `src/assets/vite.svg`, `src/assets/vue.svg`

- [ ] **Step 1: Write the router test first**

```ts
// src/router/index.test.ts
import { describe, expect, it } from "vitest";
import { router } from "./index";

describe("router", () => {
  it("maps each path to the expected route name", () => {
    expect(router.resolve("/").name).toBe("landing");
    expect(router.resolve("/klien").name).toBe("klien");
    expect(router.resolve("/recruiter").name).toBe("recruiter");
  });
});
```

- [ ] **Step 2: Run it to see it fail**

Run: `pnpm test src/router`
Expected: FAIL — cannot find module `./index` (or `./LandingPage.vue` once resolution gets that far).

- [ ] **Step 3: Create the three stub pages**

```vue
<!-- src/pages/LandingPage.vue -->
<template>
  <main>
    <h1>Landing Page</h1>
  </main>
</template>
```

```vue
<!-- src/pages/KlienPage.vue -->
<template>
  <main>
    <h1>Klien Page</h1>
  </main>
</template>
```

```vue
<!-- src/pages/RecruiterPage.vue -->
<template>
  <main>
    <h1>Recruiter Page</h1>
  </main>
</template>
```

- [ ] **Step 4: Create the router**

```ts
// src/router/index.ts
import { createRouter, createWebHistory } from "vue-router";
import LandingPage from "@/pages/LandingPage.vue";
import KlienPage from "@/pages/KlienPage.vue";
import RecruiterPage from "@/pages/RecruiterPage.vue";

export const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: "/", name: "landing", component: LandingPage },
    { path: "/klien", name: "klien", component: KlienPage },
    { path: "/recruiter", name: "recruiter", component: RecruiterPage },
  ],
});
```

- [ ] **Step 5: Run the test again to see it pass**

Run: `pnpm test src/router`
Expected: PASS.

- [ ] **Step 6: Wire the router into the app**

```vue
<!-- src/App.vue (replace full contents) -->
<script setup lang="ts">
import { RouterView } from "vue-router";
</script>

<template>
  <RouterView />
</template>
```

```ts
// src/main.ts (replace full contents)
import { createApp } from "vue";
import "./style.css";
import App from "./App.vue";
import { router } from "./router";

createApp(App).use(router).mount("#app");
```

- [ ] **Step 7: Delete the starter-template leftovers**

```bash
rm src/components/HelloWorld.vue src/assets/hero.png src/assets/vite.svg src/assets/vue.svg
```

- [ ] **Step 8: Update the page title**

In `index.html`, change:

```html
<title>mypersonaldashboard</title>
```

to:

```html
<title>Nama Kamu — Web Developer & UI/UX Designer</title>
```

- [ ] **Step 9: Verify everything still builds and the dev server serves all three routes**

Run: `pnpm build`
Expected: PASS.

Run: `pnpm dev`, then open `http://localhost:5173/`, `http://localhost:5173/klien`, and `http://localhost:5173/recruiter`.
Expected: each shows its stub heading ("Landing Page" / "Klien Page" / "Recruiter Page") with no console errors. Stop the dev server after checking.

- [ ] **Step 10: Commit**

```bash
git add src/router src/pages src/App.vue src/main.ts index.html
git add -u src/components src/assets
git commit -m "feat: add vue-router with landing/klien/recruiter routes, remove starter template"
```

---

### Task 5: Static data layer (portfolio, services, profile)

**Files:**

- Create: `src/data/portfolio.ts`
- Create: `src/data/portfolio.test.ts`
- Create: `src/data/services.ts`
- Create: `src/data/services.test.ts`
- Create: `src/data/profile.ts`
- Create: `src/data/profile.test.ts`

- [ ] **Step 1: Write the failing tests**

```ts
// src/data/portfolio.test.ts
import { describe, expect, it } from "vitest";
import { portfolioItems } from "./portfolio";

describe("portfolioItems", () => {
  it("has exactly 3 items, each with a title and description", () => {
    expect(portfolioItems).toHaveLength(3);
    portfolioItems.forEach((item) => {
      expect(item.title.length).toBeGreaterThan(0);
      expect(item.description.length).toBeGreaterThan(0);
    });
  });
});
```

```ts
// src/data/services.test.ts
import { describe, expect, it } from "vitest";
import { servicePackages } from "./services";

describe("servicePackages", () => {
  it("has exactly 3 packages, each with a name and description", () => {
    expect(servicePackages).toHaveLength(3);
    servicePackages.forEach((service) => {
      expect(service.name.length).toBeGreaterThan(0);
      expect(service.description.length).toBeGreaterThan(0);
    });
  });
});
```

```ts
// src/data/profile.test.ts
import { describe, expect, it } from "vitest";
import { skillGroups } from "./profile";

describe("skillGroups", () => {
  it("has exactly 3 groups, each with a title and detail", () => {
    expect(skillGroups).toHaveLength(3);
    skillGroups.forEach((group) => {
      expect(group.title.length).toBeGreaterThan(0);
      expect(group.detail.length).toBeGreaterThan(0);
    });
  });
});
```

- [ ] **Step 2: Run them to see them fail**

Run: `pnpm test src/data`
Expected: FAIL — cannot find modules `./portfolio`, `./services`, `./profile`.

- [ ] **Step 3: Create the data files**

```ts
// src/data/portfolio.ts
export interface PortfolioItem {
  id: string;
  title: string;
  description: string;
}

export const portfolioItems: PortfolioItem[] = [
  {
    id: "umkm-landing-page",
    title: "Landing Page UMKM",
    description:
      "Redesign landing page untuk UMKM lokal di Yogyakarta — before/after, fokus pada konversi kontak WhatsApp.",
  },
  {
    id: "ux-case-study",
    title: "UX Case Study",
    description:
      "Studi kasus redesign alur aplikasi/portal yang sering dikeluhkan pengguna, lengkap dengan proses wireframe hingga prototype.",
  },
  {
    id: "this-dashboard",
    title: "Dashboard Ini Sendiri",
    description:
      "Portofolio yang sedang Anda lihat — dibangun dengan Vue, Tailwind, dan Supabase sebagai bukti kemampuan full-stack.",
  },
];
```

```ts
// src/data/services.ts
export interface ServicePackage {
  id: string;
  name: string;
  description: string;
}

export const servicePackages: ServicePackage[] = [
  {
    id: "landing",
    name: "Landing Page",
    description: "1 halaman, responsive, form kontak",
  },
  {
    id: "multi",
    name: "Multi-halaman",
    description: "Company profile, 3-5 halaman",
  },
  {
    id: "uiux",
    name: "UI/UX Only",
    description: "Wireframe + prototype Figma",
  },
];
```

```ts
// src/data/profile.ts
export interface SkillGroup {
  id: string;
  title: string;
  detail: string;
}

export const skillGroups: SkillGroup[] = [
  { id: "tech-stack", title: "Tech Stack", detail: "Vue, Tailwind, Supabase" },
  { id: "design-tools", title: "Design Tools", detail: "Figma, prototyping" },
  {
    id: "experience",
    title: "Organisasi / Magang",
    detail: "(isi pengalaman)",
  },
];
```

- [ ] **Step 4: Run the tests to see them pass**

Run: `pnpm test src/data`
Expected: PASS — 3 test files, 3 tests passed.

- [ ] **Step 5: Commit**

```bash
git add src/data
git commit -m "feat: add static data for portfolio, services, and profile"
```

---

### Task 6: Pricing calculator logic (`src/lib/pricing.ts`)

**Files:**

- Create: `src/lib/pricing.ts`
- Create: `src/lib/pricing.test.ts`

Pricing model (fixed here so there's no ambiguity for the component built in Task 12): base price by project type, plus a flat cost per page beyond the first, plus a flat cost per selected feature, then a 1.2x multiplier if speed is `'urgent'`, rounded to the nearest Rp10,000.

- [ ] **Step 1: Write the failing tests**

```ts
// src/lib/pricing.test.ts
import { describe, expect, it } from "vitest";
import { calculatePrice, formatRupiah } from "./pricing";

describe("calculatePrice", () => {
  it("returns the base price for a 1-page landing page, normal speed, no features", () => {
    expect(
      calculatePrice({
        projectType: "landing",
        pageCount: 1,
        features: [],
        speed: "normal",
      }),
    ).toBe(350_000);
  });

  it("adds a per-page cost for additional pages", () => {
    expect(
      calculatePrice({
        projectType: "multi",
        pageCount: 3,
        features: [],
        speed: "normal",
      }),
    ).toBe(1_100_000);
  });

  it("adds a flat cost per selected feature", () => {
    expect(
      calculatePrice({
        projectType: "landing",
        pageCount: 1,
        features: ["wa-integration", "animation"],
        speed: "normal",
      }),
    ).toBe(500_000);
  });

  it("applies a 1.2x multiplier for urgent speed", () => {
    expect(
      calculatePrice({
        projectType: "uiux",
        pageCount: 1,
        features: [],
        speed: "urgent",
      }),
    ).toBe(600_000);
  });

  it("combines pages, features, and urgent speed", () => {
    expect(
      calculatePrice({
        projectType: "multi",
        pageCount: 4,
        features: ["animation"],
        speed: "urgent",
      }),
    ).toBe(1_620_000);
  });
});

describe("formatRupiah", () => {
  it("formats whole thousands with dot separators and an Rp prefix", () => {
    expect(formatRupiah(350_000)).toBe("Rp350.000");
    expect(formatRupiah(1_100_000)).toBe("Rp1.100.000");
  });
});
```

- [ ] **Step 2: Run them to see them fail**

Run: `pnpm test src/lib/pricing`
Expected: FAIL — cannot find module `./pricing`.

- [ ] **Step 3: Implement the module**

```ts
// src/lib/pricing.ts
export type ProjectType = "landing" | "multi" | "uiux";
export type Speed = "normal" | "urgent";
export type Feature = "wa-integration" | "animation";

export interface PricingInput {
  projectType: ProjectType;
  pageCount: number;
  features: Feature[];
  speed: Speed;
}

const BASE_PRICE: Record<ProjectType, number> = {
  landing: 350_000,
  multi: 800_000,
  uiux: 500_000,
};

const PRICE_PER_EXTRA_PAGE = 150_000;

const FEATURE_PRICE: Record<Feature, number> = {
  "wa-integration": 50_000,
  animation: 100_000,
};

const URGENT_MULTIPLIER = 1.2;

export function calculatePrice(input: PricingInput): number {
  const extraPages = Math.max(0, input.pageCount - 1);
  const pagesCost = extraPages * PRICE_PER_EXTRA_PAGE;
  const featuresCost = input.features.reduce(
    (sum, feature) => sum + FEATURE_PRICE[feature],
    0,
  );

  const subtotal = BASE_PRICE[input.projectType] + pagesCost + featuresCost;
  const multiplier = input.speed === "urgent" ? URGENT_MULTIPLIER : 1;

  return Math.round((subtotal * multiplier) / 10_000) * 10_000;
}

export function formatRupiah(amount: number): string {
  return `Rp${amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")}`;
}
```

- [ ] **Step 4: Run the tests to see them pass**

Run: `pnpm test src/lib/pricing`
Expected: PASS — 6 tests passed.

- [ ] **Step 5: Commit**

```bash
git add src/lib/pricing.ts src/lib/pricing.test.ts
git commit -m "feat: add pricing calculator logic with tests"
```

---

### Task 7: Booking form schema (`src/lib/bookingSchema.ts`)

**Files:**

- Create: `src/lib/bookingSchema.ts`
- Create: `src/lib/bookingSchema.test.ts`

- [ ] **Step 1: Write the failing tests**

```ts
// src/lib/bookingSchema.test.ts
import { describe, expect, it } from "vitest";
import { bookingSchema } from "./bookingSchema";

describe("bookingSchema", () => {
  it("accepts a valid submission", () => {
    const result = bookingSchema.safeParse({
      name: "Budi",
      contact: "081234567890",
      message: "Butuh landing page untuk toko online saya",
    });
    expect(result.success).toBe(true);
  });

  it("rejects a name shorter than 2 characters", () => {
    const result = bookingSchema.safeParse({
      name: "B",
      contact: "081234567890",
      message: "Butuh landing page untuk toko online saya",
    });
    expect(result.success).toBe(false);
  });

  it("rejects a message shorter than 10 characters", () => {
    const result = bookingSchema.safeParse({
      name: "Budi",
      contact: "081234567890",
      message: "Halo",
    });
    expect(result.success).toBe(false);
  });
});
```

- [ ] **Step 2: Run them to see them fail**

Run: `pnpm test src/lib/bookingSchema`
Expected: FAIL — cannot find module `./bookingSchema`.

- [ ] **Step 3: Implement the schema**

```ts
// src/lib/bookingSchema.ts
import { z } from "zod";

export const bookingSchema = z.object({
  name: z.string().min(2, "Nama minimal 2 karakter"),
  contact: z.string().min(5, "Nomor WhatsApp atau email wajib diisi"),
  message: z
    .string()
    .min(10, "Ceritakan kebutuhan project minimal 10 karakter"),
});

export type BookingFormValues = z.infer<typeof bookingSchema>;
```

- [ ] **Step 4: Run the tests to see them pass**

Run: `pnpm test src/lib/bookingSchema`
Expected: PASS — 3 tests passed.

- [ ] **Step 5: Commit**

```bash
git add src/lib/bookingSchema.ts src/lib/bookingSchema.test.ts
git commit -m "feat: add booking form zod schema with tests"
```

---

### Task 8: `SiteFooter.vue`

**Files:**

- Create: `src/components/layout/SiteFooter.vue`
- Create: `src/components/layout/SiteFooter.test.ts`

- [ ] **Step 1: Write the failing test**

```ts
// src/components/layout/SiteFooter.test.ts
import { describe, expect, it } from "vitest";
import { mount } from "@vue/test-utils";
import SiteFooter from "./SiteFooter.vue";

describe("SiteFooter", () => {
  it("renders contact links", () => {
    const wrapper = mount(SiteFooter);
    expect(wrapper.text()).toContain("nama@email.com");
    expect(wrapper.text()).toContain("LinkedIn");
  });
});
```

- [ ] **Step 2: Run it to see it fail**

Run: `pnpm test src/components/layout/SiteFooter`
Expected: FAIL — cannot find module `./SiteFooter.vue`.

- [ ] **Step 3: Implement the component**

```vue
<!-- src/components/layout/SiteFooter.vue -->
<script setup lang="ts">
const contactEmail = "nama@email.com";
const linkedinUrl = "https://linkedin.com/in/nama-kamu";
const instagramUrl = "https://instagram.com/nama-kamu";
</script>

<template>
  <footer
    class="border-t border-border bg-background py-6 text-center text-sm text-muted-foreground"
  >
    <p>&copy; {{ new Date().getFullYear() }} Nama Kamu</p>
    <div class="mt-2 flex justify-center gap-4">
      <a :href="`mailto:${contactEmail}`" class="hover:text-primary">{{
        contactEmail
      }}</a>
      <a
        :href="linkedinUrl"
        target="_blank"
        rel="noopener"
        class="hover:text-primary"
        >LinkedIn</a
      >
      <a
        :href="instagramUrl"
        target="_blank"
        rel="noopener"
        class="hover:text-primary"
        >Instagram</a
      >
    </div>
  </footer>
</template>
```

- [ ] **Step 4: Run the test to see it pass**

Run: `pnpm test src/components/layout/SiteFooter`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/components/layout/SiteFooter.vue src/components/layout/SiteFooter.test.ts
git commit -m "feat: add SiteFooter component"
```

---

### Task 9: `NavBar.vue`

**Files:**

- Create: `src/components/layout/NavBar.vue`
- Create: `src/components/layout/NavBar.test.ts`

- [ ] **Step 1: Write the failing test**

```ts
// src/components/layout/NavBar.test.ts
import { describe, expect, it } from "vitest";
import { mount, RouterLinkStub } from "@vue/test-utils";
import NavBar from "./NavBar.vue";

describe("NavBar", () => {
  it("links to /recruiter when in klien mode", () => {
    const wrapper = mount(NavBar, {
      props: { mode: "klien" },
      global: { stubs: { RouterLink: RouterLinkStub } },
    });
    const modeLink = wrapper
      .findAllComponents(RouterLinkStub)
      .find((link) => link.props("to") === "/recruiter");
    expect(modeLink).toBeTruthy();
    expect(modeLink!.text()).toContain("Recruiter");
  });

  it("links to /klien when in recruiter mode", () => {
    const wrapper = mount(NavBar, {
      props: { mode: "recruiter" },
      global: { stubs: { RouterLink: RouterLinkStub } },
    });
    const modeLink = wrapper
      .findAllComponents(RouterLinkStub)
      .find((link) => link.props("to") === "/klien");
    expect(modeLink).toBeTruthy();
    expect(modeLink!.text()).toContain("Klien");
  });
});
```

- [ ] **Step 2: Run it to see it fail**

Run: `pnpm test src/components/layout/NavBar`
Expected: FAIL — cannot find module `./NavBar.vue`.

- [ ] **Step 3: Implement the component**

```vue
<!-- src/components/layout/NavBar.vue -->
<script setup lang="ts">
import { computed } from "vue";
import { RouterLink } from "vue-router";

const props = defineProps<{
  mode: "klien" | "recruiter";
}>();

const otherMode = computed(() =>
  props.mode === "klien"
    ? { to: "/recruiter", label: "ganti ke Recruiter" }
    : { to: "/klien", label: "ganti ke Klien" },
);

const modeLabel = computed(() =>
  props.mode === "klien" ? "Klien" : "Recruiter",
);
</script>

<template>
  <nav
    class="flex items-center justify-between border-b border-border px-6 py-3"
  >
    <RouterLink to="/" class="font-heading font-semibold text-foreground"
      >Nama Kamu</RouterLink
    >
    <RouterLink
      :to="otherMode.to"
      class="rounded-full border border-primary px-3 py-1 text-xs font-medium text-primary"
    >
      Mode: {{ modeLabel }} &middot; {{ otherMode.label }}
    </RouterLink>
  </nav>
</template>
```

- [ ] **Step 4: Run the test to see it pass**

Run: `pnpm test src/components/layout/NavBar`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/components/layout/NavBar.vue src/components/layout/NavBar.test.ts
git commit -m "feat: add NavBar component with klien/recruiter mode switch"
```

---

### Task 10: `ChapterSection.vue` (scrollytelling wrapper)

**Files:**

- Create: `src/components/story/ChapterSection.vue`
- Create: `src/components/story/ChapterSection.test.ts`

- [ ] **Step 1: Write the failing test**

```ts
// src/components/story/ChapterSection.test.ts
import { describe, expect, it } from "vitest";
import { mount } from "@vue/test-utils";
import ChapterSection from "./ChapterSection.vue";

describe("ChapterSection", () => {
  it("renders the chapter number, title, and slot content", () => {
    const wrapper = mount(ChapterSection, {
      props: { number: "BAB 01", title: "Kenali Saya" },
      slots: { default: "<p>Halo dunia</p>" },
    });
    expect(wrapper.text()).toContain("BAB 01");
    expect(wrapper.text()).toContain("Kenali Saya");
    expect(wrapper.text()).toContain("Halo dunia");
  });
});
```

- [ ] **Step 2: Run it to see it fail**

Run: `pnpm test src/components/story/ChapterSection`
Expected: FAIL — cannot find module `./ChapterSection.vue`.

- [ ] **Step 3: Implement the component**

```vue
<!-- src/components/story/ChapterSection.vue -->
<script setup lang="ts">
import { motion } from "motion-v";

defineProps<{
  number: string;
  title: string;
}>();
</script>

<template>
  <motion.section
    class="border-b border-dashed border-border px-6 py-10"
    :initial="{ opacity: 0, y: 24 }"
    :while-in-view="{ opacity: 1, y: 0 }"
    :transition="{ duration: 0.5, ease: 'easeOut' }"
    :in-view-options="{ once: true, amount: 0.3 }"
  >
    <p class="font-heading text-xs tracking-widest text-primary">
      {{ number }}
    </p>
    <h3 class="mt-1 text-lg font-semibold">{{ title }}</h3>
    <div class="mt-4">
      <slot />
    </div>
  </motion.section>
</template>
```

- [ ] **Step 4: Run the test to see it pass**

Run: `pnpm test src/components/story/ChapterSection`
Expected: PASS. (The jsdom `IntersectionObserver` mock from Task 2 is what makes this mount without throwing.)

- [ ] **Step 5: Commit**

```bash
git add src/components/story/ChapterSection.vue src/components/story/ChapterSection.test.ts
git commit -m "feat: add ChapterSection scrollytelling wrapper using motion-v"
```

---

### Task 11: `PortfolioGallery.vue`

**Files:**

- Create: `src/components/portfolio/PortfolioGallery.vue`
- Create: `src/components/portfolio/PortfolioGallery.test.ts`

- [ ] **Step 1: Write the failing test**

```ts
// src/components/portfolio/PortfolioGallery.test.ts
import { describe, expect, it } from "vitest";
import { mount } from "@vue/test-utils";
import PortfolioGallery from "./PortfolioGallery.vue";
import { portfolioItems } from "@/data/portfolio";

describe("PortfolioGallery", () => {
  it("renders one article per portfolio item", () => {
    const wrapper = mount(PortfolioGallery);
    expect(wrapper.findAll("article")).toHaveLength(portfolioItems.length);
    portfolioItems.forEach((item) => {
      expect(wrapper.text()).toContain(item.title);
    });
  });
});
```

- [ ] **Step 2: Run it to see it fail**

Run: `pnpm test src/components/portfolio/PortfolioGallery`
Expected: FAIL — cannot find module `./PortfolioGallery.vue`.

- [ ] **Step 3: Implement the component**

```vue
<!-- src/components/portfolio/PortfolioGallery.vue -->
<script setup lang="ts">
import { portfolioItems } from "@/data/portfolio";
</script>

<template>
  <div class="grid gap-4 sm:grid-cols-3">
    <article
      v-for="item in portfolioItems"
      :key="item.id"
      class="rounded-lg border border-border bg-card p-4 text-left"
    >
      <h4 class="font-heading font-semibold">{{ item.title }}</h4>
      <p class="mt-2 text-sm text-muted-foreground">{{ item.description }}</p>
    </article>
  </div>
</template>
```

- [ ] **Step 4: Run the test to see it pass**

Run: `pnpm test src/components/portfolio/PortfolioGallery`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/components/portfolio/PortfolioGallery.vue src/components/portfolio/PortfolioGallery.test.ts
git commit -m "feat: add shared PortfolioGallery component"
```

---

### Task 12: `PricingCalculator.vue`

**Files:**

- Create: `src/components/klien/PricingCalculator.vue`
- Create: `src/components/klien/PricingCalculator.test.ts`

- [ ] **Step 1: Write the failing tests**

```ts
// src/components/klien/PricingCalculator.test.ts
import { describe, expect, it } from "vitest";
import { mount } from "@vue/test-utils";
import PricingCalculator from "./PricingCalculator.vue";

describe("PricingCalculator", () => {
  it("shows the default landing page price", () => {
    const wrapper = mount(PricingCalculator);
    expect(wrapper.get('[data-testid="estimated-price"]').text()).toBe(
      "Rp350.000",
    );
  });

  it("recalculates when project type and page count change", async () => {
    const wrapper = mount(PricingCalculator);
    await wrapper.get('[data-testid="project-type"]').setValue("multi");
    await wrapper.get('[data-testid="increment-pages"]').trigger("click");
    await wrapper.get('[data-testid="increment-pages"]').trigger("click");
    expect(wrapper.get('[data-testid="estimated-price"]').text()).toBe(
      "Rp1.100.000",
    );
  });

  it("adds feature costs on top of the base price", async () => {
    const wrapper = mount(PricingCalculator);
    await wrapper.get('[data-testid="feature-wa"]').setValue(true);
    await wrapper.get('[data-testid="feature-animation"]').setValue(true);
    expect(wrapper.get('[data-testid="estimated-price"]').text()).toBe(
      "Rp500.000",
    );
  });
});
```

- [ ] **Step 2: Run them to see them fail**

Run: `pnpm test src/components/klien/PricingCalculator`
Expected: FAIL — cannot find module `./PricingCalculator.vue`.

- [ ] **Step 3: Implement the component**

```vue
<!-- src/components/klien/PricingCalculator.vue -->
<script setup lang="ts">
import { computed, ref } from "vue";
import {
  calculatePrice,
  formatRupiah,
  type Feature,
  type PricingInput,
  type ProjectType,
  type Speed,
} from "@/lib/pricing";

const projectType = ref<ProjectType>("landing");
const pageCount = ref(1);
const waIntegration = ref(false);
const animation = ref(false);
const speed = ref<Speed>("normal");

const selectedFeatures = computed<Feature[]>(() => [
  ...(waIntegration.value ? (["wa-integration"] as const) : []),
  ...(animation.value ? (["animation"] as const) : []),
]);

const estimatedPrice = computed(() => {
  const input: PricingInput = {
    projectType: projectType.value,
    pageCount: pageCount.value,
    features: selectedFeatures.value,
    speed: speed.value,
  };
  return calculatePrice(input);
});

const formattedPrice = computed(() => formatRupiah(estimatedPrice.value));

function incrementPages() {
  pageCount.value += 1;
}

function decrementPages() {
  pageCount.value = Math.max(1, pageCount.value - 1);
}
</script>

<template>
  <div class="rounded-lg border border-border bg-card p-5 text-left">
    <div class="grid gap-4 sm:grid-cols-2">
      <label class="flex flex-col gap-1 text-sm">
        Jenis project
        <select
          v-model="projectType"
          data-testid="project-type"
          class="rounded-md border border-input bg-background px-3 py-2"
        >
          <option value="landing">Landing Page</option>
          <option value="multi">Multi-halaman</option>
          <option value="uiux">UI/UX Only</option>
        </select>
      </label>

      <div class="flex flex-col gap-1 text-sm">
        Jumlah halaman
        <div class="flex items-center gap-2">
          <button
            type="button"
            data-testid="decrement-pages"
            class="rounded-md border border-input px-2"
            @click="decrementPages"
          >
            -
          </button>
          <span data-testid="page-count">{{ pageCount }}</span>
          <button
            type="button"
            data-testid="increment-pages"
            class="rounded-md border border-input px-2"
            @click="incrementPages"
          >
            +
          </button>
        </div>
      </div>

      <div class="flex flex-col gap-1 text-sm">
        Fitur tambahan
        <label class="flex items-center gap-2">
          <input
            v-model="waIntegration"
            type="checkbox"
            data-testid="feature-wa"
          />
          WA integrasi
        </label>
        <label class="flex items-center gap-2">
          <input
            v-model="animation"
            type="checkbox"
            data-testid="feature-animation"
          />
          Animasi
        </label>
      </div>

      <label class="flex flex-col gap-1 text-sm">
        Kecepatan
        <select
          v-model="speed"
          data-testid="speed"
          class="rounded-md border border-input bg-background px-3 py-2"
        >
          <option value="normal">Normal</option>
          <option value="urgent">Urgent</option>
        </select>
      </label>
    </div>

    <div
      class="mt-4 flex items-center justify-between rounded-md border border-primary/30 bg-secondary px-4 py-3"
    >
      <span class="text-sm">Estimasi harga</span>
      <span
        data-testid="estimated-price"
        class="font-heading font-bold text-primary"
        >{{ formattedPrice }}</span
      >
    </div>
  </div>
</template>
```

- [ ] **Step 4: Run the tests to see them pass**

Run: `pnpm test src/components/klien/PricingCalculator`
Expected: PASS — 3 tests passed.

- [ ] **Step 5: Commit**

```bash
git add src/components/klien/PricingCalculator.vue src/components/klien/PricingCalculator.test.ts
git commit -m "feat: add PricingCalculator component"
```

---

### Task 13: `BookingForm.vue`

**Files:**

- Create: `src/components/klien/BookingForm.vue`
- Create: `src/components/klien/BookingForm.test.ts`

- [ ] **Step 1: Write the failing tests**

```ts
// src/components/klien/BookingForm.test.ts
import { describe, expect, it } from "vitest";
import { mount, flushPromises } from "@vue/test-utils";
import BookingForm from "./BookingForm.vue";

describe("BookingForm", () => {
  it("shows a validation error when submitted empty", async () => {
    const wrapper = mount(BookingForm);
    await wrapper.get("form").trigger("submit");
    await flushPromises();
    expect(wrapper.text()).toContain("Nama minimal 2 karakter");
  });

  it("emits submitted with the form values when valid", async () => {
    const wrapper = mount(BookingForm);
    const textInputs = wrapper.findAll('input[type="text"]');
    await textInputs[0].setValue("Budi");
    await textInputs[1].setValue("081234567890");
    await wrapper
      .get("textarea")
      .setValue("Butuh landing page untuk toko online saya");
    await wrapper.get("form").trigger("submit");
    await flushPromises();

    expect(wrapper.emitted("submitted")?.[0]?.[0]).toEqual({
      name: "Budi",
      contact: "081234567890",
      message: "Butuh landing page untuk toko online saya",
    });
  });
});
```

- [ ] **Step 2: Run them to see them fail**

Run: `pnpm test src/components/klien/BookingForm`
Expected: FAIL — cannot find module `./BookingForm.vue`.

- [ ] **Step 3: Implement the component**

```vue
<!-- src/components/klien/BookingForm.vue -->
<script setup lang="ts">
import { toTypedSchema } from "@vee-validate/zod";
import { useForm } from "vee-validate";
import { bookingSchema, type BookingFormValues } from "@/lib/bookingSchema";

const emit = defineEmits<{
  submitted: [values: BookingFormValues];
}>();

const { errors, defineField, handleSubmit, resetForm } = useForm({
  validationSchema: toTypedSchema(bookingSchema),
});

const [name, nameAttrs] = defineField("name");
const [contact, contactAttrs] = defineField("contact");
const [message, messageAttrs] = defineField("message");

const onSubmit = handleSubmit((values) => {
  emit("submitted", values);
  resetForm();
});
</script>

<template>
  <form class="flex flex-col gap-4 text-left" @submit.prevent="onSubmit">
    <label class="flex flex-col gap-1 text-sm">
      Nama
      <input
        v-model="name"
        v-bind="nameAttrs"
        type="text"
        class="rounded-md border border-input px-3 py-2"
      />
      <span v-if="errors.name" class="text-xs text-destructive">{{
        errors.name
      }}</span>
    </label>

    <label class="flex flex-col gap-1 text-sm">
      WhatsApp / Email
      <input
        v-model="contact"
        v-bind="contactAttrs"
        type="text"
        class="rounded-md border border-input px-3 py-2"
      />
      <span v-if="errors.contact" class="text-xs text-destructive">{{
        errors.contact
      }}</span>
    </label>

    <label class="flex flex-col gap-1 text-sm">
      Ceritakan kebutuhan project
      <textarea
        v-model="message"
        v-bind="messageAttrs"
        rows="4"
        class="rounded-md border border-input px-3 py-2"
      />
      <span v-if="errors.message" class="text-xs text-destructive">{{
        errors.message
      }}</span>
    </label>

    <button
      type="submit"
      class="rounded-md bg-primary px-4 py-2 font-heading font-semibold text-primary-foreground"
    >
      Kirim &amp; Dapat Konfirmasi Email
    </button>
  </form>
</template>
```

- [ ] **Step 4: Run the tests to see them pass**

Run: `pnpm test src/components/klien/BookingForm`
Expected: PASS — 2 tests passed.

- [ ] **Step 5: Commit**

```bash
git add src/components/klien/BookingForm.vue src/components/klien/BookingForm.test.ts
git commit -m "feat: add BookingForm component with vee-validate + zod"
```

---

### Task 14: `LandingPage.vue` (real content)

**Files:**

- Modify: `src/pages/LandingPage.vue`
- Create: `src/pages/LandingPage.test.ts`

- [ ] **Step 1: Write the failing test**

```ts
// src/pages/LandingPage.test.ts
import { describe, expect, it } from "vitest";
import { mount, RouterLinkStub } from "@vue/test-utils";
import LandingPage from "./LandingPage.vue";

describe("LandingPage", () => {
  it("shows a name, tagline, and links to both /klien and /recruiter", () => {
    const wrapper = mount(LandingPage, {
      global: { stubs: { RouterLink: RouterLinkStub } },
    });
    expect(wrapper.text()).toContain("Web Developer & UI/UX Designer");

    const links = wrapper.findAllComponents(RouterLinkStub);
    expect(links.some((link) => link.props("to") === "/klien")).toBe(true);
    expect(links.some((link) => link.props("to") === "/recruiter")).toBe(true);
  });
});
```

- [ ] **Step 2: Run it to see it fail**

Run: `pnpm test src/pages/LandingPage`
Expected: FAIL — the stub page has none of this content.

- [ ] **Step 3: Replace the stub with the real content**

```vue
<!-- src/pages/LandingPage.vue (replace full contents) -->
<script setup lang="ts">
import { RouterLink } from "vue-router";
</script>

<template>
  <div
    class="flex min-h-screen flex-col items-center justify-center gap-4 px-6 text-center"
  >
    <div
      class="h-16 w-16 rounded-full bg-gradient-to-br from-primary to-teal-200"
    ></div>
    <h1 class="text-2xl font-bold">Nama Kamu</h1>
    <p class="text-muted-foreground">Web Developer &amp; UI/UX Designer</p>
    <div class="mt-4 flex flex-wrap justify-center gap-3">
      <RouterLink
        to="/klien"
        class="rounded-md bg-primary px-5 py-2 font-heading font-semibold text-primary-foreground"
      >
        Saya Klien, cari jasa &rarr;
      </RouterLink>
      <RouterLink
        to="/recruiter"
        class="rounded-md border border-primary px-5 py-2 font-heading font-semibold text-primary"
      >
        Saya Recruiter &rarr;
      </RouterLink>
    </div>
  </div>
</template>
```

- [ ] **Step 4: Run the test to see it pass**

Run: `pnpm test src/pages/LandingPage`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/pages/LandingPage.vue src/pages/LandingPage.test.ts
git commit -m "feat: build real LandingPage content"
```

---

### Task 15: `KlienPage.vue` (real content)

**Files:**

- Modify: `src/pages/KlienPage.vue`
- Create: `src/pages/KlienPage.test.ts`

- [ ] **Step 1: Write the failing test**

```ts
// src/pages/KlienPage.test.ts
import { describe, expect, it } from "vitest";
import { mount, RouterLinkStub } from "@vue/test-utils";
import KlienPage from "./KlienPage.vue";
import BookingForm from "@/components/klien/BookingForm.vue";

function mountPage() {
  return mount(KlienPage, {
    global: { stubs: { RouterLink: RouterLinkStub } },
  });
}

describe("KlienPage", () => {
  it("renders all five chapters, the services list, and the portfolio gallery", () => {
    const wrapper = mountPage();
    expect(wrapper.text()).toContain("BAB 01");
    expect(wrapper.text()).toContain("BAB 05");
    expect(wrapper.findAll("article")).toHaveLength(6); // 3 services + 3 portfolio items
  });

  it("shows a thank-you message after the booking form is submitted", async () => {
    const wrapper = mountPage();
    expect(wrapper.text()).not.toContain("sudah terkirim");

    await wrapper.findComponent(BookingForm).vm.$emit("submitted", {
      name: "Budi",
      contact: "0812",
      message: "test kebutuhan project",
    });

    expect(wrapper.text()).toContain("sudah terkirim");
  });
});
```

- [ ] **Step 2: Run it to see it fail**

Run: `pnpm test src/pages/KlienPage`
Expected: FAIL — the stub page has none of this content.

- [ ] **Step 3: Replace the stub with the real content**

```vue
<!-- src/pages/KlienPage.vue (replace full contents) -->
<script setup lang="ts">
import { ref } from "vue";
import NavBar from "@/components/layout/NavBar.vue";
import SiteFooter from "@/components/layout/SiteFooter.vue";
import ChapterSection from "@/components/story/ChapterSection.vue";
import PortfolioGallery from "@/components/portfolio/PortfolioGallery.vue";
import PricingCalculator from "@/components/klien/PricingCalculator.vue";
import BookingForm from "@/components/klien/BookingForm.vue";
import { servicePackages } from "@/data/services";
import type { BookingFormValues } from "@/lib/bookingSchema";

const inquirySent = ref(false);

function handleSubmitted(_values: BookingFormValues) {
  inquirySent.value = true;
}
</script>

<template>
  <div>
    <NavBar mode="klien" />

    <ChapterSection
      number="BAB 01"
      title="Bantu bisnis Anda punya web & tampilan yang menjual"
    >
      <p class="text-muted-foreground">
        Landing page, website, dan desain UI/UX untuk UMKM &amp; startup.
      </p>
    </ChapterSection>

    <ChapterSection number="BAB 02" title="Services">
      <div class="grid gap-4 sm:grid-cols-3">
        <article
          v-for="service in servicePackages"
          :key="service.id"
          class="rounded-lg border border-border bg-card p-4 text-left"
        >
          <h4 class="font-heading font-semibold">{{ service.name }}</h4>
          <p class="mt-2 text-sm text-muted-foreground">
            {{ service.description }}
          </p>
        </article>
      </div>
    </ChapterSection>

    <ChapterSection number="BAB 03" title="Kalkulator Estimasi Harga">
      <PricingCalculator />
    </ChapterSection>

    <ChapterSection number="BAB 04" title="Portfolio">
      <PortfolioGallery />
    </ChapterSection>

    <ChapterSection number="BAB 05" title="Booking / Contact">
      <p
        v-if="inquirySent"
        class="rounded-md bg-secondary p-4 text-sm text-foreground"
      >
        Terima kasih! Pesan Anda sudah terkirim, saya akan segera menghubungi
        Anda kembali.
      </p>
      <BookingForm v-else @submitted="handleSubmitted" />
    </ChapterSection>

    <SiteFooter />
  </div>
</template>
```

- [ ] **Step 4: Run the test to see it pass**

Run: `pnpm test src/pages/KlienPage`
Expected: PASS — 2 tests passed.

- [ ] **Step 5: Commit**

```bash
git add src/pages/KlienPage.vue src/pages/KlienPage.test.ts
git commit -m "feat: build real KlienPage content"
```

---

### Task 16: `RecruiterPage.vue` (real content)

**Files:**

- Modify: `src/pages/RecruiterPage.vue`
- Create: `src/pages/RecruiterPage.test.ts`

- [ ] **Step 1: Write the failing test**

```ts
// src/pages/RecruiterPage.test.ts
import { describe, expect, it } from "vitest";
import { mount, RouterLinkStub } from "@vue/test-utils";
import RecruiterPage from "./RecruiterPage.vue";

describe("RecruiterPage", () => {
  it("renders all five chapters, the skills list, and a CV download link", () => {
    const wrapper = mount(RecruiterPage, {
      global: { stubs: { RouterLink: RouterLinkStub } },
    });
    expect(wrapper.text()).toContain("BAB 01");
    expect(wrapper.text()).toContain("BAB 05");
    expect(wrapper.findAll("article")).toHaveLength(6); // 3 skill groups + 3 portfolio items

    const downloadLink = wrapper.get("a[download]");
    expect(downloadLink.text()).toContain("Download CV");
  });
});
```

- [ ] **Step 2: Run it to see it fail**

Run: `pnpm test src/pages/RecruiterPage`
Expected: FAIL — the stub page has none of this content.

- [ ] **Step 3: Replace the stub with the real content**

```vue
<!-- src/pages/RecruiterPage.vue (replace full contents) -->
<script setup lang="ts">
import NavBar from "@/components/layout/NavBar.vue";
import SiteFooter from "@/components/layout/SiteFooter.vue";
import ChapterSection from "@/components/story/ChapterSection.vue";
import PortfolioGallery from "@/components/portfolio/PortfolioGallery.vue";
import { skillGroups } from "@/data/profile";

const cvFileHref = "/cv-nama-kamu.pdf";
</script>

<template>
  <div>
    <NavBar mode="recruiter" />

    <ChapterSection number="BAB 01" title="Web Developer & UI/UX Designer">
      <p class="text-muted-foreground">
        Mahasiswa Informatika, semester akhir — siap kontribusi di tim
        engineering/produk.
      </p>
    </ChapterSection>

    <ChapterSection number="BAB 02" title="About">
      <ul class="space-y-1 text-sm text-muted-foreground">
        <li>
          <strong class="text-foreground">Pendidikan:</strong> S1 Informatika —
          Semester Akhir
        </li>
        <li>
          <strong class="text-foreground">Lokasi:</strong> Yogyakarta, Indonesia
        </li>
        <li>
          <strong class="text-foreground">Minat:</strong> Web Development, UI/UX
          Design
        </li>
      </ul>
    </ChapterSection>

    <ChapterSection number="BAB 03" title="Skills & Experience">
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

    <ChapterSection number="BAB 04" title="Portfolio">
      <PortfolioGallery />
    </ChapterSection>

    <ChapterSection number="BAB 05" title="Contact">
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

- [ ] **Step 4: Run the test to see it pass**

Run: `pnpm test src/pages/RecruiterPage`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/pages/RecruiterPage.vue src/pages/RecruiterPage.test.ts
git commit -m "feat: build real RecruiterPage content"
```

---

### Task 17: Final integration check

**Files:** none (verification only)

- [ ] **Step 1: Run the full test suite**

Run: `pnpm test`
Expected: PASS — every test file from Tasks 2–16 passes (router, data x3, lib x2, components x6, pages x3).

- [ ] **Step 2: Run the production build**

Run: `pnpm build`
Expected: PASS — `vue-tsc -b` reports no type errors, `vite build` completes and writes `dist/`.

- [ ] **Step 3: Manual smoke test in the browser**

Run: `pnpm dev`, then visit and check each:

- `http://localhost:5173/` — avatar circle, name, tagline, two buttons; clicking each navigates correctly.
- `http://localhost:5173/klien` — five "BAB" sections fade/slide in as you scroll; the calculator's price updates when you change inputs; submitting the booking form with valid data replaces the form with the thank-you message; submitting empty shows the Indonesian validation messages.
- `http://localhost:5173/recruiter` — five "BAB" sections render; "Download CV (PDF)" link is present (the actual PDF file doesn't exist yet — that's a known open item from the spec, not a bug in this plan).

Stop the dev server once confirmed.

- [ ] **Step 4: Commit (only if Step 1–3 required any fixes; otherwise nothing to commit)**

If any fixes were needed to get here, stage and commit them with a message describing what was fixed, e.g.:

```bash
git add -A
git commit -m "fix: resolve integration issues found during final verification"
```
