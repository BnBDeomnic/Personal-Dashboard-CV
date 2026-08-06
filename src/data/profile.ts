export interface SkillGroup {
  id: string
  title: string
  detail: string
}

export const skillGroups: SkillGroup[] = [
  { id: 'tech-stack', title: 'Tech Stack', detail: 'Vue, Tailwind, Supabase' },
  { id: 'design-tools', title: 'Design Tools', detail: 'Figma, prototyping' },
  { id: 'experience', title: 'Organisasi / Magang', detail: '(isi pengalaman)' },
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
