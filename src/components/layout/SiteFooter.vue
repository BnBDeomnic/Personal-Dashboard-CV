<script setup lang="ts">
const contactEmail = 'nama@email.com'
const linkedinUrl = 'https://linkedin.com/in/nama-kamu'
const instagramUrl = 'https://instagram.com/nama-kamu'
</script>

<template>
  <footer class="border-t border-border bg-background py-6 text-center text-sm text-muted-foreground">
    <p>&copy; {{ new Date().getFullYear() }} Nama Kamu</p>
    <div class="mt-2 flex justify-center gap-4">
      <a :href="`mailto:${contactEmail}`" class="hover:text-primary">{{ contactEmail }}</a>
      <a :href="linkedinUrl" target="_blank" rel="noopener" class="hover:text-primary">LinkedIn</a>
      <a :href="instagramUrl" target="_blank" rel="noopener" class="hover:text-primary">Instagram</a>
    </div>
  </footer>
</template>
