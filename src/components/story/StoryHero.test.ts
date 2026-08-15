import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import StoryHero from './StoryHero.vue'

describe('StoryHero', () => {
  it('renders as a normal-flow section without the pinned/sticky scroll-jacking wrapper', () => {
    const wrapper = mount(StoryHero)
    expect(wrapper.find('.sticky').exists()).toBe(false)
  })

  it('renders all four narrative beats together, not gated by scroll step', () => {
    const wrapper = mount(StoryHero)
    expect(wrapper.text()).toContain('Awal Mula')
    expect(wrapper.text()).toContain('Titik Nyala')
    expect(wrapper.text()).toContain('Pertemuan dengan Desain')
    expect(wrapper.text()).toContain('Sekarang')
  })

  it('greets the visitor with a casual intro line before the headline', () => {
    const wrapper = mount(StoryHero)
    expect(wrapper.text()).toContain('Haii, perkenalkan aku Bagus')
    expect(wrapper.text()).toContain('this is my story')
  })
})
