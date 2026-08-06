// src/pages/LandingPage.test.ts
import { describe, expect, it } from 'vitest'
import { mount, RouterLinkStub } from '@vue/test-utils'
import LandingPage from './LandingPage.vue'

function mountPage() {
  return mount(LandingPage, {
    global: { stubs: { RouterLink: RouterLinkStub } },
  })
}

describe('LandingPage', () => {
  it('shows the intro (name, skill tags) with no click-through CTA button', () => {
    const wrapper = mountPage()
    const text = wrapper.text()

    expect(text).toContain('Bagus Wikan')
    expect(text).toContain('Spesialisasi:')
    expect(text).not.toContain('Lihat Profil')

    // Only the NavBar's home logo link remains -- no CTA link to click through
    const links = wrapper.findAllComponents(RouterLinkStub)
    expect(links).toHaveLength(1)
    expect(links[0]!.props('to')).toBe('/')
  })

  it('flows intro straight into the OnBoarding hero, Portfolio (page 2), and BAB 01-04 on the same page', () => {
    const wrapper = mountPage()
    const text = wrapper.text()

    expect(text).toContain('Saya bukan sekadar kode')
    expect(text).toContain('Portfolio')
    expect(text).toContain('BAB 01')
    expect(text).toContain('BAB 02')
    expect(text).toContain('BAB 03')
    expect(text).toContain('BAB 04')
    expect(text).not.toContain('BAB 05')

    expect(wrapper.findAll('article')).toHaveLength(6) // 3 skill groups + 3 portfolio items

    const downloadLink = wrapper.get('a[download]')
    expect(downloadLink.text()).toContain('Download CV')
  })

  it('uses a zoom/depth transform for the Hero -> Portfolio transition, not the rounded curtain overlap', () => {
    const wrapper = mountPage()

    // The Hero's sticky wrapper is scroll-driven scale/brightness, not the old rounded-top curtain
    const heroSticky = wrapper.find('.sticky.h-screen.origin-top')
    expect(heroSticky.exists()).toBe(true)
    expect(heroSticky.classes()).not.toContain('rounded-t-[2.5rem]')
    expect(heroSticky.attributes('style')).toContain('scale(')

    // Portfolio scales in with its own scroll-driven transform
    const portfolioSection = wrapper.find('section')
    expect(portfolioSection.attributes('style')).toContain('scale(')
  })
})
