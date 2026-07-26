<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink } from 'vue-router'

const props = defineProps<{
  mode: 'klien' | 'recruiter'
}>()

const otherMode = computed(() =>
  props.mode === 'klien'
    ? { to: '/recruiter', label: 'ganti ke Recruiter' }
    : { to: '/klien', label: 'ganti ke Klien' },
)

const modeLabel = computed(() => (props.mode === 'klien' ? 'Klien' : 'Recruiter'))
</script>

<template>
  <nav class="flex items-center justify-between border-b border-border px-6 py-3">
    <RouterLink to="/" class="font-heading font-semibold text-foreground">Nama Kamu</RouterLink>
    <RouterLink
      :to="otherMode.to"
      class="rounded-full border border-primary px-3 py-1 text-xs font-medium text-primary"
    >
      Mode: {{ modeLabel }} &middot; {{ otherMode.label }}
    </RouterLink>
  </nav>
</template>
