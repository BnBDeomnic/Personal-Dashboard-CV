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
    <NavBar />

    <!-- Page 1: Hero. Wrapper is taller than one viewport so the inner
         sticky Hero has room to stay pinned while the user scrolls,
         before Page 2 (Portfolio) rises to cover it. -->
    <div class="relative h-[160vh]">
      <div class="sticky top-0 h-screen overflow-hidden">
        <StoryHero />
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
