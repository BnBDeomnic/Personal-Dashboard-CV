import { describe, expect, it } from 'vitest'
import { portfolioItems } from './portfolio'

describe('portfolioItems', () => {
  it('has exactly 6 items, each with a title, description, at least one tag, and a GitHub link', () => {
    expect(portfolioItems).toHaveLength(6)
    portfolioItems.forEach((item) => {
      expect(item.title.length).toBeGreaterThan(0)
      expect(item.description.length).toBeGreaterThan(0)
      expect(item.tags.length).toBeGreaterThan(0)
      expect(item.link).toMatch(/^https:\/\/github\.com\//)
    })
  })
})
