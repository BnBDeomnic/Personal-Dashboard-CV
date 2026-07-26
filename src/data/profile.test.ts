import { describe, expect, it } from 'vitest'
import { skillGroups } from './profile'

describe('skillGroups', () => {
  it('has exactly 3 groups, each with a title and detail', () => {
    expect(skillGroups).toHaveLength(3)
    skillGroups.forEach((group) => {
      expect(group.title.length).toBeGreaterThan(0)
      expect(group.detail.length).toBeGreaterThan(0)
    })
  })
})
