<script setup lang="ts">
import { motion } from 'motion-v'

defineProps<{
  number: string
  title: string
}>()
</script>

<template>
  <motion.section
    class="border-b border-dashed border-border px-6 py-10"
    :initial="{ opacity: 0, y: 24 }"
    :while-in-view="{ opacity: 1, y: 0 }"
    :transition="{ duration: 0.5, ease: 'easeOut' }"
    :in-view-options="{ once: true, amount: 0.3 }"
  >
    <p class="font-heading text-xs tracking-widest text-primary">{{ number }}</p>
    <h3 class="mt-1 text-lg font-semibold">{{ title }}</h3>
    <div class="mt-4">
      <slot />
    </div>
  </motion.section>
</template>
