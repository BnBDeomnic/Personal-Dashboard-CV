// src/pages/RecruiterPage.test.ts
import { describe, expect, it } from 'vitest'
import { mount, RouterLinkStub } from '@vue/test-utils'
import RecruiterPage from './RecruiterPage.vue'

describe('RecruiterPage', () => {
  it('renders Portfolio as page 2 (no BAB number) directly before BAB 01-04, and a CV download link', () => {
    const wrapper = mount(RecruiterPage, {
      global: { stubs: { RouterLink: RouterLinkStub } },
    })
    const text = wrapper.text()

    expect(text).toContain('BAB 01')
    expect(text).toContain('BAB 02')
    expect(text).toContain('BAB 03')
    expect(text).toContain('BAB 04')
    expect(text).not.toContain('BAB 05')

    // Portfolio (page 2) appears before the BAB 01 intro chapter
    expect(text.indexOf('Portfolio')).toBeGreaterThan(-1)
    expect(text.indexOf('Portfolio')).toBeLessThan(text.indexOf('BAB 01'))

    expect(wrapper.findAll('article')).toHaveLength(6) // 3 skill groups + 3 portfolio items

    const downloadLink = wrapper.get('a[download]')
    expect(downloadLink.text()).toContain('Download CV')
  })
})
