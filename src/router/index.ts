import { createRouter, createWebHistory } from 'vue-router'
import LandingPage from '@/pages/LandingPage.vue'
import RecruiterPage from '@/pages/RecruiterPage.vue'

export const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', name: 'landing', component: LandingPage },
    { path: '/recruiter', name: 'recruiter', component: RecruiterPage },
  ],
})
