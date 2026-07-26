import { z } from 'zod'

export const bookingSchema = z.object({
  name: z.string().min(2, 'Nama minimal 2 karakter'),
  contact: z.string().min(5, 'Nomor WhatsApp atau email wajib diisi'),
  message: z.string().min(10, 'Ceritakan kebutuhan project minimal 10 karakter'),
})

export type BookingFormValues = z.infer<typeof bookingSchema>
