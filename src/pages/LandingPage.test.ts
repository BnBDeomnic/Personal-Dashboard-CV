// src/pages/LandingPage.test.ts
import { describe, expect, it } from 'vitest'
import { mount, RouterLinkStub } from '@vue/test-utils'
import LandingPage from './LandingPage.vue'

describe('LandingPage', () => {
  it('shows the name, skill tags, and a single CTA link to /recruiter', () => {
    const wrapper = mount(LandingPage, {
      global: { stubs: { RouterLink: RouterLinkStub } },
    })
    // Name is always visible
    expect(wrapper.text()).toContain('Bagus Wikan')
    // Static intro text
    expect(wrapper.text()).toContain('Spesialisasi:')
    // Single navigation link to the recruiter page, no klien link
    const links = wrapper.findAllComponents(RouterLinkStub)
    const targets = links.map((link) => link.props('to'))
    expect(targets).toContain('/recruiter')
    expect(targets).not.toContain('/klien')
  })
})
