<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { motion } from 'motion-v'

const props = defineProps<{
  mode: 'klien' | 'recruiter'
}>()

// ─── Klien: Scroll Progress & Pinning Logic ──────────────────────────────────
const containerRef = ref<HTMLElement | null>(null)
const scrollProgress = ref(0)
const currentCardIndex = ref(0)
const isAnimating = ref(false)

function handleScroll() {
  const container = containerRef.value
  if (!container) return
  const rect = container.getBoundingClientRect()
  const totalScrollable = container.offsetHeight - window.innerHeight
  if (totalScrollable <= 0) return
  const scrolled = -rect.top
  scrollProgress.value = Math.max(0, Math.min(1, scrolled / totalScrollable))

  if (scrollProgress.value < 0.4) {
    currentCardIndex.value = 0
  } else if (scrollProgress.value < 0.8) {
    currentCardIndex.value = 1
  } else {
    currentCardIndex.value = 2
  }
}

function handleWheel(e: WheelEvent) {
  const container = containerRef.value
  if (!container) return

  const rect = container.getBoundingClientRect()
  const isPinned = rect.top <= 0 && rect.bottom >= window.innerHeight
  if (!isPinned) return

  const totalScrollable = container.offsetHeight - window.innerHeight
  const containerTop = window.pageYOffset + rect.top

  if (e.deltaY > 0) {
    if (currentCardIndex.value < 2) {
      e.preventDefault()
      if (!isAnimating.value) {
        isAnimating.value = true
        currentCardIndex.value++
        const targetScroll = containerTop + (currentCardIndex.value * 0.45) * totalScrollable
        window.scrollTo({
          top: targetScroll,
          behavior: 'smooth'
        })
        setTimeout(() => {
          isAnimating.value = false
        }, 750)
      }
    } else {
      // On the third card, scroll down immediately releases the stickiness
      e.preventDefault()
      if (!isAnimating.value) {
        isAnimating.value = true
        window.scrollTo({
          top: window.pageYOffset + rect.bottom + 10,
          behavior: 'smooth'
        })
        setTimeout(() => {
          isAnimating.value = false
        }, 750)
      }
    }
  } else if (e.deltaY < 0) {
    if (currentCardIndex.value > 0) {
      e.preventDefault()
      if (!isAnimating.value) {
        isAnimating.value = true
        currentCardIndex.value--
        const targetScroll = containerTop + (currentCardIndex.value * 0.45) * totalScrollable
        window.scrollTo({
          top: targetScroll,
          behavior: 'smooth'
        })
        setTimeout(() => {
          isAnimating.value = false
        }, 750)
      }
    }
  }
}

onMounted(() => {
  if (props.mode === 'klien') {
    window.addEventListener('scroll', handleScroll, { passive: true })
    window.addEventListener('wheel', handleWheel, { passive: false })
    handleScroll() // Initial call
  } else {
    window.addEventListener('scroll', handleHeroScroll, { passive: true })
    handleHeroScroll() // Initial call
  }
})

onUnmounted(() => {
  if (props.mode === 'klien') {
    window.removeEventListener('scroll', handleScroll)
    window.removeEventListener('wheel', handleWheel)
  } else {
    window.removeEventListener('scroll', handleHeroScroll)
  }
})

// ─── Recruiter: lightweight scroll-linked parallax (no pinning, no wheel-jacking) ──
const heroRef = ref<HTMLElement | null>(null)
const heroProgress = ref(0)

function handleHeroScroll() {
  const hero = heroRef.value
  if (!hero) return
  const rect = hero.getBoundingClientRect()
  const progress = 1 - (rect.top + rect.height) / (window.innerHeight + rect.height)
  heroProgress.value = Math.max(0, Math.min(1, progress))
}

function getKlienCardStyle(i: number) {
  // Targets for scroll progress where cards 0, 1, 2 should be fully active
  const targets = [0.15, 0.5, 0.85]
  const diff = scrollProgress.value - targets[i]

  // Parallax float direction (matches scroll flow)
  const translateY = -diff * 60

  // Dissolve opacity: fades out when moving away from the target scroll position
  const opacity = Math.max(0, 1 - Math.abs(diff) * 2.8)

  // Dissolve scale: subtle scaling from 0.96 to 1
  const scale = Math.max(0.96, 1 - Math.abs(diff) * 0.1)

  // Dissolve blur: blurs out up to 5px
  const blurVal = Math.min(5, Math.abs(diff) * 16)

  const isActive = Math.abs(diff) < 0.18
  const zIndex = isActive ? 20 : 10

  return {
    transform: `translate3d(0, ${translateY}px, 0) scale(${scale})`,
    opacity: opacity,
    filter: `blur(${blurVal}px)`,
    zIndex: zIndex,
    pointerEvents: (opacity > 0.45 ? 'auto' : 'none') as 'auto' | 'none',
    // Smooth transition catch-up when clicking indicator dots or scrolling wheels programmatically
    transition: isAnimating.value
      ? 'transform 0.75s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.75s cubic-bezier(0.16, 1, 0.3, 1), filter 0.75s ease-out'
      : 'transform 0.1s ease-out, opacity 0.15s ease-out, filter 0.15s ease-out'
  }
}

// Recruiter story beats static content
const recruiterBeats = [
  {
    icon: 'start',
    label: 'Awal Mula',
    text: 'Dulu, saya hanya anak kampus yang penasaran: kenapa website bisa terasa hidup dan yang lain terasa mati?',
  },
  {
    icon: 'light',
    label: 'Titik Nyala',
    text: 'Dari rasa penasaran itu, saya mulai belajar kode — bukan karena terpaksa, tapi karena setiap baris terasa seperti membangun sesuatu dari nol.',
  },
  {
    icon: 'design',
    label: 'Pertemuan dengan Desain',
    text: 'Kode saja tidak cukup. Saya jatuh cinta ke UI/UX — saat saya sadar bahwa teknologi terbaik adalah yang tidak terasa seperti teknologi.',
  },
  {
    icon: 'now',
    label: 'Sekarang',
    text: 'Hari ini saya membangun pengalaman digital yang cepat, indah, dan benar-benar berguna — baik untuk bisnis kecil maupun tim produk.',
  },
]

// Klien value cards static content
const klienCards = [
  {
    icon: 'target',
    num: '01',
    title: 'Tepat Sasaran',
    accent: 'from-teal-500 to-cyan-500',
    desc: 'Desain yang bukan sekadar cantik — tapi dirancang untuk mengubah pengunjung jadi pelanggan. Setiap elemen ada alasannya.',
  },
  {
    icon: 'lightning',
    num: '02',
    title: 'Cepat & Terstruktur',
    accent: 'from-sky-500 to-blue-500',
    desc: 'Dari brief ke live dalam hitungan hari. Prosesnya jelas, updatenya rutin, hasilnya on-time — tanpa tebak-tebakan.',
  },
  {
    icon: 'chat',
    num: '03',
    title: 'Selalu Bisa Dihubungi',
    accent: 'from-indigo-500 to-violet-500',
    desc: 'Saya ada di setiap langkah — dari diskusi awal sampai revisi terakhir. Proyek Anda bukan sekadar tiket, tapi komitmen.',
  },
]
</script>

<template>
  <!-- ═══════════════════════════════════════════════════════════════════════ -->
  <!--  RECRUITER MODE — normal-flow hero, scroll-linked parallax, no pinning  -->
  <!-- ═══════════════════════════════════════════════════════════════════════ -->
  <div
    v-if="props.mode === 'recruiter'"
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
        Saya bukan sekadar kode —<br />
        <span class="bg-gradient-to-r from-teal-400 via-sky-400 to-indigo-400 bg-clip-text text-transparent">
          saya membangun produk yang bermakna.
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

  <!-- ═══════════════════════════════════════════════════════════════════════ -->
  <!--  KLIEN MODE — smooth, premium value proposition card deck with DISSOLVE -->
  <!--  (unchanged — pinned scroll-jacking mechanic stays for now)             -->
  <!-- ═══════════════════════════════════════════════════════════════════════ -->
  <div v-else ref="containerRef" class="story-wrapper relative w-full h-[220vh]">
    <div class="sticky top-14 h-[calc(100vh-3.5rem)] w-full overflow-hidden flex items-center justify-center">
      <div class="relative w-full h-full bg-gradient-to-b from-teal-50/40 via-white to-white flex flex-col items-center justify-between px-6 py-8">
        <!-- Parallax Background Blobs -->
        <div class="absolute inset-0 pointer-events-none overflow-hidden">
          <div
            class="absolute -top-24 -right-24 h-96 w-96 rounded-full bg-teal-200/20 blur-[100px]"
            :style="{
              transform: `translate3d(${scrollProgress * -60}px, ${scrollProgress * -40}px, 0)`,
              transition: 'transform 0.15s ease-out'
            }"
          />
          <div
            class="absolute bottom-12 -left-20 h-72 w-72 rounded-full bg-sky-200/20 blur-[80px]"
            :style="{
              transform: `translate3d(${scrollProgress * 40}px, ${scrollProgress * 60}px, 0)`,
              transition: 'transform 0.15s ease-out'
            }"
          />
        </div>

        <div class="relative z-10 w-full max-w-xl text-center flex flex-col items-center justify-center my-auto">
          <!-- Static Header -->
          <div class="mb-6 sm:mb-8">
            <p class="mb-2 text-xs font-semibold tracking-[0.3em] uppercase text-teal-600">
              Tentang Saya · Untuk Klien
            </p>
            <h2 class="mb-2 font-heading text-2xl font-bold leading-snug text-foreground sm:text-3xl md:text-4xl">
              Website yang benar-benar<br />
              <span class="bg-gradient-to-r from-teal-600 to-sky-600 bg-clip-text text-transparent">
                bekerja untuk bisnis Anda.
              </span>
            </h2>
            <p class="text-xs sm:text-sm text-muted-foreground max-w-md mx-auto">
              Tiga pilar layanan saya yang akan membantu mempercepat pertumbuhan bisnis Anda.
            </p>
          </div>

          <!-- Cards container with DISSOLVE + PARALLAX transition -->
          <div class="relative w-full h-[260px] sm:h-[270px] flex items-center justify-center">
            <div
              v-for="(card, i) in klienCards"
              :key="card.title"
              class="absolute w-full max-w-md will-change-transform-opacity"
              :style="getKlienCardStyle(i)"
              @click="currentCardIndex = i"
            >
              <!-- Card Component -->
              <div class="relative overflow-hidden rounded-2xl border border-border bg-white p-6 sm:p-8 text-left shadow-sm">
                <!-- Color stripe at top -->
                <div :class="`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${card.accent}`" />

                <!-- Badges -->
                <div class="mb-4 flex items-center justify-between">
                  <span class="font-mono text-2xl sm:text-3xl font-black text-slate-200">{{ card.num }}</span>
                  <div :class="`flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-xl bg-gradient-to-br ${card.accent} text-white shadow-md`">
                    <!-- Render dynamic SVG icon -->
                    <template v-if="card.icon === 'target'">
                      <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                        <circle cx="12" cy="12" r="10" />
                        <circle cx="12" cy="12" r="6" />
                        <circle cx="12" cy="12" r="2" />
                      </svg>
                    </template>
                    <template v-else-if="card.icon === 'lightning'">
                      <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </template>
                    <template v-else-if="card.icon === 'chat'">
                      <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                      </svg>
                    </template>
                  </div>
                </div>

                <!-- Content -->
                <h3 class="mb-1.5 font-heading text-base sm:text-lg font-bold text-foreground">
                  {{ card.title }}
                </h3>
                <p class="text-xs sm:text-sm leading-relaxed text-muted-foreground">
                  {{ card.desc }}
                </p>

                <!-- Indicator Dot Grid -->
                <div class="mt-5 flex gap-2 justify-center">
                  <button
                    v-for="dotIdx in 3"
                    :key="dotIdx"
                    type="button"
                    class="h-1.5 rounded-full transition-all duration-300 focus:outline-none"
                    :class="[
                      dotIdx - 1 === i
                        ? 'w-6 bg-teal-500'
                        : 'w-1.5 bg-slate-200'
                    ]"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Bottom scroll indicator -->
        <div class="relative z-10 mt-4 text-[11px] text-muted-foreground flex flex-col items-center gap-1">
          <span>Scroll ke bawah untuk melihat layanan &amp; portfolio</span>
          <div class="w-1.5 h-1.5 bg-teal-500 rounded-full animate-bounce" />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* High performance transition properties to keep it buttery smooth */
.will-change-transform-opacity {
  will-change: transform, opacity;
}

.ease-out-quint {
  transition-timing-function: cubic-bezier(0.23, 1, 0.32, 1);
}
</style>
