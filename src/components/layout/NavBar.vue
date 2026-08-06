<script setup lang="ts">
import { RouterLink } from 'vue-router'
</script>

<template>
  <nav class="sticky top-0 z-50 flex items-center justify-between border-b border-border bg-background/90 px-6 py-3 backdrop-blur-sm">
    <RouterLink to="/" class="font-heading font-semibold text-foreground">Bagus Wikan</RouterLink>
    <span class="rounded-full border border-border px-3 py-1 text-xs font-medium text-muted-foreground">
      OnBoarding
    </span>
  </nav>
</template>
