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
        <h4 class="font-heading font-semibold text-foreground">{{ item.title }}</h4>
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
