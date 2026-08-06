// src/components/portfolio/PortfolioGallery.test.ts
import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import PortfolioGallery from './PortfolioGallery.vue'
import { portfolioItems } from '@/data/portfolio'

describe('PortfolioGallery', () => {
  it('renders one article per portfolio item, as a stacked list (not a card grid)', () => {
    const wrapper = mount(PortfolioGallery)
    expect(wrapper.findAll('article')).toHaveLength(portfolioItems.length)
    portfolioItems.forEach((item) => {
      expect(wrapper.text()).toContain(item.title)
      expect(wrapper.text()).toContain(item.description)
      item.tags.forEach((tag) => {
        expect(wrapper.text()).toContain(tag)
      })
    })

    // No more 3-column card grid
    expect(wrapper.find('.grid').exists()).toBe(false)
  })

  it('links each project title to its GitHub repo, opening in a new tab', () => {
    const wrapper = mount(PortfolioGallery)
    portfolioItems.forEach((item) => {
      const link = wrapper.get(`a[href="${item.link}"]`)
      expect(link.text()).toContain(item.title)
      expect(link.attributes('target')).toBe('_blank')
      expect(link.attributes('rel')).toContain('noopener')
    })
  })
})
