import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import ChapterSection from './ChapterSection.vue'

describe('ChapterSection', () => {
  it('renders the chapter number, title, and slot content', () => {
    const wrapper = mount(ChapterSection, {
      props: { number: 'BAB 01', title: 'Kenali Saya' },
      slots: { default: '<p>Halo dunia</p>' },
    })
    expect(wrapper.text()).toContain('BAB 01')
    expect(wrapper.text()).toContain('Kenali Saya')
    expect(wrapper.text()).toContain('Halo dunia')
  })
})
