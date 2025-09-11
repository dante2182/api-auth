import { z } from 'zod'

export const noteSchema = z.object({
  title: z.string().min(1, 'El titulo es requerido').max(100),
  content: z.string().min(1, 'El contenido es requerido')
})
