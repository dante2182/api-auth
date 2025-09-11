import { z } from 'zod'

export const registerSchema = z.object({
  name: z.string()
    .min(6, { message: 'El nombre de usuario debe tener al menos 6 caracteres' })
    .max(20, { message: 'El nombre de usuario no puede exceder los 20 caracteres' })
    .regex(
      /^[a-z0-9]{6,20}$/,
      'El nombre de usuario no puede contener caracteres especiales o mayúsculas'
    ),
  email: z.string().email({ message: 'El email no es válido' }),
  password: z
    .string()
    .min(6, { message: 'La contraseña debe tener al menos 6 caracteres' })
    .max(15, { message: 'La contraseña es demasiado larga' })
    .regex(/^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9]).{8,}$/, {
      message: 'Debe contener al menos una letra mayúscula, una letra minúscula y un número y tener una longitud minima de 8 caracteres'
    })
})
