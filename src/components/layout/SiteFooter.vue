<script setup lang="ts">
const contactEmail = 'baguswikan@email.com'
const linkedinUrl = 'https://linkedin.com/in/bagus-wikan'
const instagramUrl = 'https://instagram.com/bagus-wikan'
</script>

<template>
  <footer class="border-t border-border bg-background py-6 text-center text-sm text-muted-foreground">
    <p>&copy; {{ new Date().getFullYear() }} Bagus Wikan</p>
    <div class="mt-2 flex justify-center gap-4">
      <a :href="`mailto:${contactEmail}`" class="hover:text-primary">{{ contactEmail }}</a>
      <a :href="linkedinUrl" target="_blank" rel="noopener" class="hover:text-primary">LinkedIn</a>
      <a :href="instagramUrl" target="_blank" rel="noopener" class="hover:text-primary">Instagram</a>
    </div>
  </footer>
</template>
