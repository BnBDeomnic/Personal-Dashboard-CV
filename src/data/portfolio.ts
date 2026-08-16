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
    image: '/skyvote.png',
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
    description:
      'Dashboard manajemen inventaris dan rekap operasional untuk PT Angkasa Pura Indonesia (InJourney Airports) — autentikasi role-based (Officer & Supervisor) dengan akses halaman berbeda, manajemen stok (Stock In, Stock Out, Stock Opname khusus Supervisor), rekap transaksi dengan filter & pagination, insight efisiensi stok, serta ekspor laporan ke Excel & PDF.',
    tags: ['Vue 3', 'TypeScript', 'Vite', 'Pinia', 'Vue Router'],
    link: 'https://github.com/YIA-TI/SkyInventory',
    image: '/Sky Inventory.png',
  },
  {
    id: 'sky-report',
    title: 'SkyReport',
    description:
      'Dashboard AOCH (Airport Operation Control Hub) — dashboard internal untuk memantau operasional Bandara YIA (Yogyakarta International Airport), mencakup kegiatan harian, program kerja & anggaran tahunan, kesiapan unit, dan SDM secara real-time. Menerapkan 4 role hierarki (Admin, GM, Div Head, Dep Head) dengan keamanan berlapis di level database (Row Level Security, bcrypt, SECURITY DEFINER) serta update realtime via WebSocket. Proyek internal PT Angkasa Pura, tidak untuk distribusi publik.',
    tags: ['Vue 3', 'Pinia', 'TypeScript', 'Express', 'PostgreSQL', 'WebSocket'],
    link: 'https://github.com/YIA-TI/SkyReport',
    image: '/sky report.png',
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
