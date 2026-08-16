export interface PortfolioItem {
  id: string
  title: string
  description: string
  tags: string[]
  link: string
  image?: string
}

export const portfolioItems: PortfolioItem[] = [
  {
    id: 'sky-vote',
    title: 'SkyVote',
    description:
      'Aplikasi tracking partisipasi survei untuk InJourney Airports — karyawan memilih survei aktif, mengikuti link, dan mengunggah bukti pengisian (nama, NIP, departemen, gambar bukti); admin membuat/mengelola survei dengan periode & kuota, meninjau submission per departemen, mengekspor laporan PDF, dan mengelola gambar bukti yang diunggah.',
    tags: ['Vue 3', 'Vite', 'Pinia', 'Vue Router', 'Supabase'],
    link: 'https://github.com/SkyReport/SkyReport',
  },
  {
    id: 'sky-exercise',
    title: 'SkyExercise',
    description:
      'Dashboard monitoring aktivitas terhubung Strava untuk program lari & gym — anggota menghubungkan akun Strava sekali (via OAuth + webhook sync), admin memantau aktivitas, ranking, dan quest seluruh peserta secara real-time.',
    tags: ['Vue 3', 'Vite', 'Supabase', 'Strava API'],
    link: 'https://github.com/BnBDeomnic/SkyExercise',
    image: '/SkyExcercise.png',
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
