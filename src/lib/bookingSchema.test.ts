import { describe, expect, it } from 'vitest'
import { bookingSchema } from './bookingSchema'

describe('bookingSchema', () => {
  it('accepts a valid submission', () => {
    const result = bookingSchema.safeParse({
      name: 'Budi',
      contact: '081234567890',
      message: 'Butuh landing page untuk toko online saya',
    })
    expect(result.success).toBe(true)
  })

  it('rejects a name shorter than 2 characters', () => {
    const result = bookingSchema.safeParse({
      name: 'B',
      contact: '081234567890',
      message: 'Butuh landing page untuk toko online saya',
    })
    expect(result.success).toBe(false)
  })

  it('rejects a message shorter than 10 characters', () => {
    const result = bookingSchema.safeParse({
      name: 'Budi',
      contact: '081234567890',
      message: 'Halo',
    })
    expect(result.success).toBe(false)
  })
})
