import { describe, expect, it } from 'vitest'
import { router } from './index'

describe('router', () => {
  it('maps each path to the expected route name', () => {
    expect(router.resolve('/').name).toBe('landing')
    expect(router.resolve('/klien').name).toBe('klien')
    expect(router.resolve('/recruiter').name).toBe('recruiter')
  })
})
