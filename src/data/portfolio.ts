export interface PortfolioItem {
  id: string
  title: string
  description: string
  tags: string[]
}

export const portfolioItems: PortfolioItem[] = [
  {
    id: 'umkm-landing-page',
    title: 'Landing Page UMKM',
    description:
      'Redesign landing page untuk UMKM lokal di Yogyakarta — before/after, fokus pada konversi kontak WhatsApp.',
    tags: ['Vue 3', 'Tailwind', 'Figma'],
  },
  {
    id: 'ux-case-study',
    title: 'UX Case Study',
    description:
      'Studi kasus redesign alur aplikasi/portal yang sering dikeluhkan pengguna, lengkap dengan proses wireframe hingga prototype.',
    tags: ['Figma', 'UX Research', 'Prototyping'],
  },
  {
    id: 'this-dashboard',
    title: 'Dashboard Ini Sendiri',
    description:
      'Portofolio yang sedang Anda lihat — dibangun dengan Vue, Tailwind, dan Supabase sebagai bukti kemampuan full-stack.',
    tags: ['Vue 3', 'TypeScript', 'Tailwind', 'Supabase'],
  },
]
