import { describe, expect, it } from 'vitest'
import { servicePackages } from './services'

describe('servicePackages', () => {
  it('has exactly 3 packages, each with a name and description', () => {
    expect(servicePackages).toHaveLength(3)
    servicePackages.forEach((service) => {
      expect(service.name.length).toBeGreaterThan(0)
      expect(service.description.length).toBeGreaterThan(0)
    })
  })
})
