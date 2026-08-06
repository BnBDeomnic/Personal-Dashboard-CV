import { describe, expect, it } from 'vitest'
import { educationPath, skillGroups } from './profile'

describe('skillGroups', () => {
  it('has exactly 3 groups, each with a title, detail, and category', () => {
    expect(skillGroups).toHaveLength(3)
    skillGroups.forEach((group) => {
      expect(group.title.length).toBeGreaterThan(0)
      expect(group.detail.length).toBeGreaterThan(0)
    })
  })

  it('categorizes Tech Stack and Design Tools as skills, and Organisasi/Magang as experience', () => {
    const byTitle = Object.fromEntries(skillGroups.map((group) => [group.title, group.category]))
    expect(byTitle['Tech Stack']).toBe('skill')
    expect(byTitle['Design Tools']).toBe('skill')
    expect(byTitle['Organisasi / Magang']).toBe('experience')
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
