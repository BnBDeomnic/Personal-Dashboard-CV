<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { RouterLink } from 'vue-router'
import { motion, useMotionValue, useTransform } from 'motion-v'
import logoUrl from '@/assets/LogoPortoTrnsp.png'

// Mouse parallax tracking
const mouseX = useMotionValue(0)
const mouseY = useMotionValue(0)

const orb1X = useTransform(mouseX, [-1, 1], [-30, 30])
const orb1Y = useTransform(mouseY, [-1, 1], [-20, 20])
const orb2X = useTransform(mouseX, [-1, 1], [20, -20])
const orb2Y = useTransform(mouseY, [-1, 1], [15, -15])
const orb3X = useTransform(mouseX, [-1, 1], [-15, 15])
const orb3Y = useTransform(mouseY, [-1, 1], [-25, 25])

function handleMouseMove(e: MouseEvent) {
  const { innerWidth, innerHeight } = window
  mouseX.set((e.clientX / innerWidth - 0.5) * 2)
  mouseY.set((e.clientY / innerHeight - 0.5) * 2)
}

onMounted(() => window.addEventListener('mousemove', handleMouseMove))
onUnmounted(() => window.removeEventListener('mousemove', handleMouseMove))

// Typing effect
const displayedText = ref('')
const phrases = ['Web Developer', 'UI/UX Designer', 'Creative Coder', 'Problem Solver']
let phraseIndex = 0
let charIndex = 0
let isDeleting = false
let typingTimer: ReturnType<typeof setTimeout>

function typeEffect() {
  const current = phrases[phraseIndex]
  if (!isDeleting) {
    displayedText.value = current.slice(0, charIndex + 1)
    charIndex++
    if (charIndex === current.length) {
      isDeleting = true
      typingTimer = setTimeout(typeEffect, 1800)
      return
    }
  } else {
    displayedText.value = current.slice(0, charIndex - 1)
    charIndex--
    if (charIndex === 0) {
      isDeleting = false
      phraseIndex = (phraseIndex + 1) % phrases.length
    }
  }
  typingTimer = setTimeout(typeEffect, isDeleting ? 60 : 90)
}

onMounted(() => { typingTimer = setTimeout(typeEffect, 600) })
onUnmounted(() => clearTimeout(typingTimer))

// Hover state for the CTA button
const recruiterHovered = ref(false)

// Skill tags
const skills = ['Vue 3', 'TypeScript', 'Tailwind', 'Figma', 'Supabase', 'Next.js', 'React']
</script>

<template>
  <div class="landing-root relative min-h-screen overflow-hidden bg-gradient-to-br from-teal-50/40 via-[#F8FAFC] to-sky-50/40 flex flex-col items-center justify-center">

    <!-- Ambient background orbs (parallax) -->
    <motion.div
      class="pointer-events-none absolute inset-0"
      :initial="{ opacity: 0 }"
      :animate="{ opacity: 1 }"
      :transition="{ duration: 1.2 }"
    >
      <!-- Primary teal orb -->
      <motion.div
        class="absolute top-[10%] left-[15%] h-72 w-72 rounded-full bg-teal-300/25 blur-3xl"
        :style="{ x: orb1X, y: orb1Y }"
        :animate="{ scale: [1, 1.15, 1], opacity: [0.25, 0.4, 0.25] }"
        :transition="{ duration: 5, repeat: Infinity, ease: 'easeInOut' }"
      />
      <!-- Sky blue orb -->
      <motion.div
        class="absolute bottom-[15%] right-[10%] h-96 w-96 rounded-full bg-sky-300/20 blur-3xl"
        :style="{ x: orb2X, y: orb2Y }"
        :animate="{ scale: [1, 1.2, 1], opacity: [0.2, 0.35, 0.2] }"
        :transition="{ duration: 7, repeat: Infinity, ease: 'easeInOut', delay: 1 }"
      />
      <!-- Indigo accent orb -->
      <motion.div
        class="absolute top-[55%] left-[60%] h-56 w-56 rounded-full bg-indigo-300/15 blur-3xl"
        :style="{ x: orb3X, y: orb3Y }"
        :animate="{ scale: [1, 1.1, 1], opacity: [0.15, 0.28, 0.15] }"
        :transition="{ duration: 6, repeat: Infinity, ease: 'easeInOut', delay: 2 }"
      />

      <!-- Subtle grid pattern -->
      <div
        class="absolute inset-0 opacity-[0.03]"
        style="background-image: linear-gradient(#0F172A 1px, transparent 1px), linear-gradient(90deg, #0F172A 1px, transparent 1px); background-size: 48px 48px"
      />
    </motion.div>

    <!-- Main content -->
    <div class="relative z-10 flex flex-col items-center gap-6 px-6 text-center max-w-2xl mx-auto">

      <!-- Avatar / Logo -->
      <motion.div
        :initial="{ opacity: 0, scale: 0.5, rotate: -10 }"
        :animate="{ opacity: 1, scale: 1, rotate: 0 }"
        :transition="{ duration: 0.7, ease: [0.34, 1.56, 0.64, 1] }"
      >
        <motion.div
          class="avatar-ring relative flex h-24 w-24 items-center justify-center rounded-full"
          :animate="{ rotate: 360 }"
          :transition="{ duration: 20, repeat: Infinity, ease: 'linear' }"
        >
          <!-- Spinning gradient ring -->
          <div class="absolute inset-0 rounded-full p-[2px]" style="background: conic-gradient(from 0deg, #14B8A6, #0EA5E9, #6366F1, #14B8A6)">
            <div class="h-full w-full rounded-full bg-slate-50" />
          </div>
          <!-- Inner avatar content -->
          <motion.div
            class="relative z-10 flex h-[90px] w-[90px] items-center justify-center rounded-full overflow-hidden shadow-lg bg-transparent"
            :animate="{ y: [0, -4, 0] }"
            :transition="{ duration: 3, repeat: Infinity, ease: 'easeInOut' }"
          >
            <img
              :src="logoUrl"
              alt="Logo"
              class="h-full w-full object-contain scale-[1.16]"
            />
          </motion.div>
        </motion.div>
      </motion.div>

      <!-- Name -->
      <motion.div
        :initial="{ opacity: 0, y: 20 }"
        :animate="{ opacity: 1, y: 0 }"
        :transition="{ duration: 0.6, delay: 0.3 }"
      >
        <h1 class="text-4xl font-bold tracking-tight sm:text-5xl bg-gradient-to-r from-teal-600 via-sky-600 to-indigo-600 bg-clip-text text-transparent pb-1">
          Bagus Wikan
        </h1>
      </motion.div>

      <!-- Typewriter tagline -->
      <motion.div
        class="flex items-center gap-2 min-h-[2rem]"
        :initial="{ opacity: 0, y: 16 }"
        :animate="{ opacity: 1, y: 0 }"
        :transition="{ duration: 0.6, delay: 0.5 }"
      >
        <span class="text-muted-foreground text-lg font-medium">Spesialisasi:</span>
        <span class="text-lg font-semibold text-primary min-w-[10rem] text-left">
          {{ displayedText }}<motion.span
            class="inline-block w-[2px] h-5 bg-primary align-middle ml-0.5"
            :animate="{ opacity: [1, 0, 1] }"
            :transition="{ duration: 0.9, repeat: Infinity }"
          />
        </span>
      </motion.div>

      <!-- Skill tags -->
      <motion.div
        class="flex flex-wrap justify-center gap-2"
        :initial="{ opacity: 0 }"
        :animate="{ opacity: 1 }"
        :transition="{ duration: 0.4, delay: 0.7 }"
      >
        <motion.span
          v-for="(skill, i) in skills"
          :key="skill"
          class="skill-tag rounded-full border border-border bg-white/80 px-3 py-1 text-xs font-medium text-muted-foreground backdrop-blur-sm cursor-default select-none"
          :initial="{ opacity: 0, y: 12, scale: 0.9 }"
          :animate="{ opacity: 1, y: 0, scale: 1 }"
          :transition="{ duration: 0.4, delay: 0.75 + i * 0.07, ease: 'easeOut' }"
          :while-hover="{ scale: 1.08, backgroundColor: '#F0FDFA', borderColor: '#14B8A6', color: '#0F172A', y: -2 }"
        >
          {{ skill }}
        </motion.span>
      </motion.div>

      <!-- CTA Button -->
      <motion.div
        class="mt-2 flex flex-col items-center gap-3 sm:flex-row"
        :initial="{ opacity: 0, y: 20 }"
        :animate="{ opacity: 1, y: 0 }"
        :transition="{ duration: 0.6, delay: 1.1 }"
      >
        <!-- Recruiter button -->
        <RouterLink to="/recruiter" class="block">
          <motion.div
            class="recruiter-btn relative overflow-hidden rounded-xl px-7 py-3 font-heading font-semibold text-white shadow-lg"
            style="background: linear-gradient(135deg, #14B8A6 0%, #0EA5E9 100%)"
            :while-hover="{ scale: 1.04, y: -2 }"
            :while-tap="{ scale: 0.97 }"
            :transition="{ type: 'spring', stiffness: 400, damping: 20 }"
            @mouseenter="recruiterHovered = true"
            @mouseleave="recruiterHovered = false"
          >
            <!-- Shimmer overlay -->
            <motion.div
              class="absolute inset-0 bg-white/20"
              :animate="recruiterHovered ? { x: ['-100%', '200%'] } : { x: '-100%' }"
              :transition="{ duration: 0.5, ease: 'easeInOut' }"
            />
            <span class="relative z-10 flex items-center gap-2">
              <svg class="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              Lihat Profil &amp; Portfolio
              <motion.span
                :animate="recruiterHovered ? { x: 4 } : { x: 0 }"
                :transition="{ type: 'spring', stiffness: 300 }"
              >→</motion.span>
            </span>
          </motion.div>
        </RouterLink>
      </motion.div>

      <!-- Scroll hint -->
      <motion.div
        class="mt-6 flex flex-col items-center gap-1 text-muted-foreground"
        :initial="{ opacity: 0 }"
        :animate="{ opacity: 0.6 }"
        :transition="{ duration: 0.6, delay: 1.6 }"
      >
        <span class="text-xs tracking-widest uppercase font-medium">Mulai Jelajahi</span>
        <motion.div
          class="flex gap-4 mt-1"
          :animate="{ y: [0, 6, 0] }"
          :transition="{ duration: 2, repeat: Infinity, ease: 'easeInOut' }"
        >
          <svg class="h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </motion.div>
      </motion.div>
    </div>

    <!-- Corner decorations -->
    <motion.div
      class="pointer-events-none absolute bottom-6 left-6 text-[10px] font-mono text-muted-foreground/40 tracking-widest"
      :initial="{ opacity: 0 }"
      :animate="{ opacity: 1 }"
      :transition="{ duration: 1, delay: 2 }"
    >
      v1.0 &middot; Built with Vue 3 &amp; TypeScript
    </motion.div>

    <motion.div
      class="pointer-events-none absolute bottom-6 right-6 text-[10px] font-mono text-muted-foreground/40 tracking-widest"
      :initial="{ opacity: 0 }"
      :animate="{ opacity: 1 }"
      :transition="{ duration: 1, delay: 2 }"
    >
      Yogyakarta, Indonesia
    </motion.div>

    <!-- Floating accent dots -->
    <motion.div
      v-for="n in 6"
      :key="n"
      class="pointer-events-none absolute h-1.5 w-1.5 rounded-full bg-primary/40"
      :style="{
        top: `${[15, 75, 35, 85, 20, 60][n-1]}%`,
        left: `${[8, 90, 92, 5, 50, 30][n-1]}%`,
      }"
      :animate="{
        y: [0, n % 2 === 0 ? -12 : 12, 0],
        opacity: [0.4, 0.8, 0.4],
        scale: [1, 1.3, 1],
      }"
      :transition="{
        duration: 3 + n * 0.7,
        repeat: Infinity,
        ease: 'easeInOut',
        delay: n * 0.4,
      }"
    />
  </div>
</template>

<style scoped>
.landing-root {
  min-height: 100dvh;
}

.skill-tag {
  transition-property: box-shadow;
  transition-duration: 200ms;
}

.skill-tag:hover {
  box-shadow: 0 4px 12px rgba(20, 184, 166, 0.2);
}

.recruiter-btn {
  box-shadow: 0 8px 32px rgba(20, 184, 166, 0.35);
}

.recruiter-btn:hover {
  box-shadow: 0 12px 40px rgba(20, 184, 166, 0.45);
}
</style>
