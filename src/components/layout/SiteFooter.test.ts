import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import SiteFooter from './SiteFooter.vue'

describe('SiteFooter', () => {
  it('renders contact links', () => {
    const wrapper = mount(SiteFooter)
    expect(wrapper.text()).toContain('nama@email.com')
    expect(wrapper.text()).toContain('LinkedIn')
  })
})
