export interface ServicePackage {
  id: string
  name: string
  description: string
}

export const servicePackages: ServicePackage[] = [
  { id: 'landing', name: 'Landing Page', description: '1 halaman, responsive, form kontak' },
  { id: 'multi', name: 'Multi-halaman', description: 'Company profile, 3-5 halaman' },
  { id: 'uiux', name: 'UI/UX Only', description: 'Wireframe + prototype Figma' },
]
