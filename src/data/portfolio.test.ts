import { describe, expect, it } from 'vitest'
import { portfolioItems } from './portfolio'

describe('portfolioItems', () => {
  it('has exactly 3 items, each with a title, description, and at least one tech tag', () => {
    expect(portfolioItems).toHaveLength(3)
    portfolioItems.forEach((item) => {
      expect(item.title.length).toBeGreaterThan(0)
      expect(item.description.length).toBeGreaterThan(0)
      expect(item.tags.length).toBeGreaterThan(0)
    })
  })
})
