<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { motion } from 'motion-v'

// ─── Lightweight scroll-linked parallax (no pinning, no wheel-jacking) ──
const heroRef = ref<HTMLElement | null>(null)
const heroProgress = ref(0)

function handleHeroScroll() {
  const hero = heroRef.value
  if (!hero) return
  const rect = hero.getBoundingClientRect()
  const progress = 1 - (rect.top + rect.height) / (window.innerHeight + rect.height)
  heroProgress.value = Math.max(0, Math.min(1, progress))
}

onMounted(() => {
  window.addEventListener('scroll', handleHeroScroll, { passive: true })
  handleHeroScroll() // Initial call
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleHeroScroll)
})

// Recruiter story beats static content
const recruiterBeats = [
  {
    icon: 'start',
    label: 'Awal Mula',
    text: 'Dulu, aku cuma anak kampus biasa yang penasaran — kenapa ya, ada website yang berasa "hidup", sementara yang lain berasa kaku dan mati?',
  },
  {
    icon: 'light',
    label: 'Titik Nyala',
    text: 'Dari rasa penasaran itu, aku mulai belajar coding. Bukan karena kepaksa tugas kuliah, tapi karena tiap baris kode yang aku tulis berasa kayak lagi membangun sesuatu dari nol — dan itu bikin ketagihan.',
  },
  {
    icon: 'design',
    label: 'Pertemuan dengan Desain',
    text: 'Tapi ternyata, coding aja nggak cukup buat aku. Aku jatuh cinta sama UI/UX — di titik itu aku sadar, teknologi terbaik itu justru yang nggak berasa kayak teknologi sama sekali.',
  },
  {
    icon: 'now',
    label: 'Sekarang',
    text: 'Sekarang, aku fokus membangun pengalaman digital yang cepat, enak dipakai, dan beneran berguna — buat bisnis kecil maupun tim produk yang butuh partner yang paham dua sisi: coding dan desain.',
  },
]
</script>

<template>
  <div
    ref="heroRef"
    class="relative w-full min-h-screen overflow-hidden bg-gradient-to-br from-[#0F172A] via-[#0D2235] to-[#0B1E3A] flex flex-col items-center justify-center sm:justify-between px-6 py-2 sm:py-14"
  >
    <!-- Parallax Background Elements -->
    <div class="absolute inset-0 pointer-events-none overflow-hidden">
      <div
        class="absolute -top-40 -left-32 h-[520px] w-[520px] rounded-full bg-teal-500/10 blur-[130px] transition-transform duration-700 ease-out"
        :style="{ transform: `translate3d(${heroProgress * -50}px, ${heroProgress * -80}px, 0)` }"
      />
      <div
        class="absolute top-[40%] -right-20 h-[380px] w-[380px] rounded-full bg-indigo-600/15 blur-[110px] transition-transform duration-700 ease-out"
        :style="{ transform: `translate3d(${heroProgress * 40}px, ${heroProgress * 60}px, 0)` }"
      />
      <div
        class="absolute inset-0 opacity-[0.03]"
        style="background-image:url('data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22n%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.85%22 numOctaves=%224%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23n)%22/%3E%3C/svg%3E');background-size:180px"
      />
    </div>

    <div class="relative z-10 w-full max-w-2xl text-left my-auto pt-4 sm:pt-6">
      <!-- Label -->
      <div class="mb-1.5 text-[10px] sm:text-[11px] font-semibold tracking-[0.3em] uppercase text-teal-400">
        Tentang Saya · Untuk Recruiter
      </div>

      <!-- Headline -->
      <h2 class="mb-2 sm:mb-6 font-heading text-lg sm:text-2xl md:text-3xl font-bold leading-snug text-white">
        Haii, perkenalkan aku Bagus —<br />
        <span class="bg-gradient-to-r from-teal-400 via-sky-400 to-indigo-400 bg-clip-text text-transparent">
          And this is my story.
        </span>
      </h2>

      <!-- Narrative timeline — all beats shown together, revealed on scroll-into-view -->
      <div class="relative pl-4 sm:pl-5 border-l border-teal-500/20">
        <div class="absolute left-0 top-0 bottom-0 w-px bg-gradient-to-b from-teal-500/50 via-indigo-500/20 to-transparent" />

        <div class="space-y-1.5 sm:space-y-4">
          <motion.div
            v-for="(beat, i) in recruiterBeats"
            :key="beat.label"
            :initial="{ opacity: 0, x: -16 }"
            :while-in-view="{ opacity: 1, x: 0 }"
            :transition="{ duration: 0.5, ease: 'easeOut', delay: i * 0.1 }"
            :in-view-options="{ once: true, amount: 0.6 }"
            class="text-white"
          >
            <div class="flex gap-3 sm:gap-4 items-start">
              <!-- Icon Bubble -->
              <div class="flex h-7 w-7 sm:h-8 sm:w-8 shrink-0 items-center justify-center rounded-full border border-teal-400 bg-teal-500/20 text-white shadow-[0_0_15px_rgba(20,184,166,0.4)] mt-0.5">
                <!-- Render dynamic SVG icon -->
                <template v-if="beat.icon === 'start'">
                  <svg class="h-3.5 w-3.5 sm:h-4 sm:w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 19l9-2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                </template>
                <template v-else-if="beat.icon === 'light'">
                  <svg class="h-3.5 w-3.5 sm:h-4 sm:w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M9.663 17h4.673M12 3v1m6.364.364l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 113.536 0V21h-2v-3.7z" />
                  </svg>
                </template>
                <template v-else-if="beat.icon === 'design'">
                  <svg class="h-3.5 w-3.5 sm:h-4 sm:w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                  </svg>
                </template>
                <template v-else-if="beat.icon === 'now'">
                  <svg class="h-3.5 w-3.5 sm:h-4 sm:w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </template>
              </div>

              <!-- Text -->
              <div>
                <p class="mb-0.5 text-[9px] sm:text-[10px] font-bold uppercase tracking-[0.25em] text-teal-400">
                  {{ beat.label }}
                </p>
                <p class="text-[11px] sm:text-sm leading-snug sm:leading-relaxed">
                  {{ beat.text }}
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <!-- Bottom CTA -->
      <div class="mt-2 sm:mt-5 flex flex-col gap-1.5 sm:gap-2">
        <div class="h-px w-full bg-gradient-to-r from-teal-500/30 to-transparent" />
        <p class="font-heading text-[11px] sm:text-sm italic text-teal-300/80">— Mari bangun sesuatu yang berarti, bersama.</p>
      </div>
    </div>

    <!-- Scroll indicator (hidden on very short mobile viewports to avoid clipping) -->
    <div class="relative z-10 mt-1 sm:mt-2 hidden sm:flex flex-col items-center text-[10px] sm:text-[11px] text-slate-500 gap-1 shrink-0">
      <span>Scroll untuk melanjutkan cerita</span>
      <div class="w-1.5 h-1.5 bg-teal-400 rounded-full animate-bounce" />
    </div>
  </div>
</template>
