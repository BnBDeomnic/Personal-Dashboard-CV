import { describe, expect, it } from 'vitest'
import { mount, RouterLinkStub } from '@vue/test-utils'
import NavBar from './NavBar.vue'

describe('NavBar', () => {
  it('does not show a clickable mode-switch link', () => {
    const wrapper = mount(NavBar, {
      global: { stubs: { RouterLink: RouterLinkStub } },
    })

    const linkTargets = wrapper.findAllComponents(RouterLinkStub).map((link) => link.props('to'))
    expect(linkTargets).not.toContain('/klien')
    expect(linkTargets).not.toContain('/recruiter')
  })
})
