export interface PortfolioItem {
  id: string
  title: string
  description: string
  tags: string[]
  link: string
}

export const portfolioItems: PortfolioItem[] = [
  {
    id: 'sky-vote',
    title: 'Sky Vote',
    description:
      'Aplikasi survei berbasis web untuk Angkasa Pura, dibangun dengan Vue 3 dan Vite, terhubung ke Supabase sebagai backend.',
    tags: ['Vue 3', 'Vite', 'Supabase'],
    link: 'https://github.com/SkyReport/SkyReport',
  },
  {
    id: 'sky-exercise',
    title: 'SkyExercise',
    description: '(deskripsi menyusul)',
    tags: ['TBD'],
    link: 'https://github.com/BnBDeomnic/SkyExercise',
  },
  {
    id: 'sky-inventory',
    title: 'SkyInventory',
    description: '(deskripsi menyusul)',
    tags: ['TBD'],
    link: 'https://github.com/YIA-TI/SkyInventory',
  },
  {
    id: 'aoch',
    title: 'AOCH',
    description: '(deskripsi menyusul)',
    tags: ['TBD'],
    link: 'https://github.com/YIA-TI/SkyReport',
  },
  {
    id: 'runera-arbitrum',
    title: 'Runera-Arbitrum',
    description:
      'Proyek Web3 di jaringan Arbitrum — terdiri dari frontend, backend, dan smart contracts.',
    tags: ['Solidity', 'TypeScript', 'JavaScript'],
    link: 'https://github.com/orgs/Runera-Arbitrum/repositories',
  },
  {
    id: 'aegisoe',
    title: 'Aegisoe',
    description: '(deskripsi menyusul)',
    tags: ['TBD'],
    link: 'https://github.com/orgs/Aegisoe/repositories',
  },
]
