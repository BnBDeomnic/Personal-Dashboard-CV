import { describe, expect, it } from 'vitest'
import { mount, RouterLinkStub } from '@vue/test-utils'
import NavBar from './NavBar.vue'

describe('NavBar', () => {
  it('links to /recruiter when in klien mode', () => {
    const wrapper = mount(NavBar, {
      props: { mode: 'klien' },
      global: { stubs: { RouterLink: RouterLinkStub } },
    })
    const modeLink = wrapper
      .findAllComponents(RouterLinkStub)
      .find((link) => link.props('to') === '/recruiter')
    expect(modeLink).toBeTruthy()
    expect(modeLink!.text()).toContain('Recruiter')
  })

  it('links to /klien when in recruiter mode', () => {
    const wrapper = mount(NavBar, {
      props: { mode: 'recruiter' },
      global: { stubs: { RouterLink: RouterLinkStub } },
    })
    const modeLink = wrapper
      .findAllComponents(RouterLinkStub)
      .find((link) => link.props('to') === '/klien')
    expect(modeLink).toBeTruthy()
    expect(modeLink!.text()).toContain('Klien')
  })
})
