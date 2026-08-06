<script setup lang="ts">
import { portfolioItems } from '@/data/portfolio'

const accents = [
  'from-teal-500 to-cyan-500',
  'from-sky-500 to-blue-500',
  'from-indigo-500 to-violet-500',
]
</script>

<template>
  <div class="divide-y divide-border text-left">
    <article
      v-for="(item, i) in portfolioItems"
      :key="item.id"
      class="flex gap-4 py-5 sm:gap-6 sm:py-6"
    >
      <div
        :class="`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br text-lg font-bold text-white shadow-md sm:h-14 sm:w-14 ${accents[i % accents.length]}`"
      >
        {{ item.title.charAt(0) }}
      </div>

      <div class="min-w-0">
        <h4 class="font-heading font-semibold text-foreground">
          <a
            :href="item.link"
            target="_blank"
            rel="noopener noreferrer"
            class="inline-flex items-center gap-1.5 hover:text-primary"
          >
            {{ item.title }}
            <svg class="h-3.5 w-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>
        </h4>
        <p class="mt-1 text-sm text-muted-foreground">{{ item.description }}</p>
        <div class="mt-3 flex flex-wrap gap-2">
          <span
            v-for="tag in item.tags"
            :key="tag"
            class="rounded-full bg-secondary px-2.5 py-1 font-mono text-[11px] text-primary"
          >
            {{ tag }}
          </span>
        </div>
      </div>
    </article>
  </div>
</template>
