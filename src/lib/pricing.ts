export type ProjectType = 'landing' | 'multi' | 'uiux'
export type Speed = 'normal' | 'urgent'
export type Feature = 'wa-integration' | 'animation'

export interface PricingInput {
  projectType: ProjectType
  pageCount: number
  features: Feature[]
  speed: Speed
}

const BASE_PRICE: Record<ProjectType, number> = {
  landing: 350_000,
  multi: 800_000,
  uiux: 500_000,
}

const PRICE_PER_EXTRA_PAGE = 150_000

const FEATURE_PRICE: Record<Feature, number> = {
  'wa-integration': 50_000,
  animation: 100_000,
}

const URGENT_MULTIPLIER = 1.2

export function calculatePrice(input: PricingInput): number {
  const extraPages = Math.max(0, input.pageCount - 1)
  const pagesCost = extraPages * PRICE_PER_EXTRA_PAGE
  const featuresCost = input.features.reduce((sum, feature) => sum + FEATURE_PRICE[feature], 0)

  const subtotal = BASE_PRICE[input.projectType] + pagesCost + featuresCost
  const multiplier = input.speed === 'urgent' ? URGENT_MULTIPLIER : 1

  return Math.round((subtotal * multiplier) / 10_000) * 10_000
}

export function formatRupiah(amount: number): string {
  return `Rp${amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')}`
}
