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

  it('flows intro straight into the OnBoarding hero, then a split-panel About/Experience/Project section, in that order', () => {
    const wrapper = mountPage()
    const text = wrapper.text()

    expect(text).toContain('Saya bukan sekadar kode')
    expect(text).toContain('About')
    expect(text).toContain('Experience')
    expect(text).toContain('Project')
    // BAB numbering is gone -- replaced by the nav-driven split panel
    expect(text).not.toContain('BAB 01')
    expect(text).not.toContain('BAB 05')

    // Right column renders About, then Experience, then Project, in that order
    expect(text.indexOf('About')).toBeLessThan(text.indexOf('Experience'))
    expect(text.indexOf('Experience')).toBeLessThan(text.indexOf('Project'))

    expect(wrapper.findAll('article')).toHaveLength(6) // 3 skill groups + 3 portfolio items

    // CV download and email now live in the left panel, not a separate "Contact" chapter
    const downloadLink = wrapper.get('a[download]')
    expect(downloadLink.text()).toContain('Download CV')

    // Left panel nav links to each right-column section, in About/Experience/Project order
    const navLinks = wrapper.findAll('nav[aria-label="Section navigation"] a')
    expect(navLinks.map((link) => link.attributes('href'))).toEqual([
      '#about',
      '#experience',
      '#project',
    ])
  })

  it('uses a color grade + vignette overlay for Intro -> Hero, and a rounded curtain overlap for Hero -> Portfolio', () => {
    const wrapper = mountPage()

    const stickyLayers = wrapper.findAll('.sticky.h-screen')
    expect(stickyLayers).toHaveLength(2)

    // Intro and Hero sticky wrappers are both plain now -- no scroll-driven transform on them
    const introSticky = stickyLayers[0]!
    expect(introSticky.attributes('style')).toBeUndefined()
    const heroSticky = stickyLayers[1]!
    expect(heroSticky.attributes('style')).toBeUndefined()

    // A scroll-driven radial grade overlay fades in over the intro instead
    const gradeOverlay = wrapper.find('.landing-root > div[style*="radial-gradient"]')
    expect(gradeOverlay.exists()).toBe(true)
    expect(gradeOverlay.attributes('style')).toContain('opacity: 0')
    // Must outrank the z-10 main content div, or the logo/name/tagline never actually grade
    expect(gradeOverlay.classes()).toContain('z-20')

    // Portfolio is still the static rounded curtain -- no scroll-driven transform
    const portfolioSection = wrapper.find('section')
    expect(portfolioSection.classes()).toContain('rounded-t-[2.5rem]')
    expect(portfolioSection.attributes('style')).toBeUndefined()
  })
})
