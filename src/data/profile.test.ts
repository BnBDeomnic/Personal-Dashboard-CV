import { describe, expect, it } from 'vitest'
import { educationPath, skillGroups } from './profile'

describe('skillGroups', () => {
  it('has exactly 3 groups, each with a title and detail', () => {
    expect(skillGroups).toHaveLength(3)
    skillGroups.forEach((group) => {
      expect(group.title.length).toBeGreaterThan(0)
      expect(group.detail.length).toBeGreaterThan(0)
    })
  })
})

describe('educationPath', () => {
  it('lists SMP, SMA, and Kuliah in that order, each with an institution name', () => {
    expect(educationPath.map((stage) => stage.level)).toEqual(['SMP', 'SMA', 'Kuliah'])
    educationPath.forEach((stage) => {
      expect(stage.institution.length).toBeGreaterThan(0)
    })
  })
})
