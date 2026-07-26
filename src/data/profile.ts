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
