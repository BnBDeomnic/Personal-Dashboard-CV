import { describe, expect, it } from 'vitest'
import { calculatePrice, formatRupiah } from './pricing'

describe('calculatePrice', () => {
  it('returns the base price for a 1-page landing page, normal speed, no features', () => {
    expect(
      calculatePrice({ projectType: 'landing', pageCount: 1, features: [], speed: 'normal' }),
    ).toBe(350_000)
  })

  it('adds a per-page cost for additional pages', () => {
    expect(
      calculatePrice({ projectType: 'multi', pageCount: 3, features: [], speed: 'normal' }),
    ).toBe(1_100_000)
  })

  it('adds a flat cost per selected feature', () => {
    expect(
      calculatePrice({
        projectType: 'landing',
        pageCount: 1,
        features: ['wa-integration', 'animation'],
        speed: 'normal',
      }),
    ).toBe(500_000)
  })

  it('applies a 1.2x multiplier for urgent speed', () => {
    expect(
      calculatePrice({ projectType: 'uiux', pageCount: 1, features: [], speed: 'urgent' }),
    ).toBe(600_000)
  })

  it('combines pages, features, and urgent speed', () => {
    expect(
      calculatePrice({
        projectType: 'multi',
        pageCount: 4,
        features: ['animation'],
        speed: 'urgent',
      }),
    ).toBe(1_620_000)
  })
})

describe('formatRupiah', () => {
  it('formats whole thousands with dot separators and an Rp prefix', () => {
    expect(formatRupiah(350_000)).toBe('Rp350.000')
    expect(formatRupiah(1_100_000)).toBe('Rp1.100.000')
  })
})
