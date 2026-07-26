import { createRouter, createWebHistory } from 'vue-router'
import LandingPage from '@/pages/LandingPage.vue'
import KlienPage from '@/pages/KlienPage.vue'
import RecruiterPage from '@/pages/RecruiterPage.vue'

export const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', name: 'landing', component: LandingPage },
    { path: '/klien', name: 'klien', component: KlienPage },
    { path: '/recruiter', name: 'recruiter', component: RecruiterPage },
  ],
})
