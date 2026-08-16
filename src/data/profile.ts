export interface SkillGroup {
  id: string
  title: string
  detail: string
  category: 'skill' | 'experience'
}

export const skillGroups: SkillGroup[] = [
  { id: 'tech-stack', title: 'Tech Stack', detail: 'React.js, Next.js, Vue.js, Tailwind, Supabase, MySQL, PostgreSQL', category: 'skill' },
  { id: 'design-tools', title: 'Design Tools', detail: 'Figma, prototyping', category: 'skill' },
  { id: 'experience', title: 'Organisasi / Magang', detail: '(isi pengalaman)', category: 'experience' },
]

export interface EducationStage {
  level: string
  institution: string
}

export const educationPath: EducationStage[] = [
  { level: 'SMP', institution: 'SMP Negeri 15 Yogyakarta' },
  { level: 'SMA', institution: 'SMA Negeri 11 Yogyakarta' },
  { level: 'Kuliah', institution: 'Universitas Kristen Duta Wacana' },
]
