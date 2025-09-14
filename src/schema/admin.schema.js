import { z } from 'zod'

// Schema para consultas de usuarios con paginación
export const getUsersQuerySchema = z.object({
  page: z.string().optional().transform(val => val ? parseInt(val, 10) : 1),
  limit: z.string().optional().transform(val => val ? parseInt(val, 10) : 10),
  search: z.string().optional().default(''),
  role: z.enum(['USER']).optional()
})

// Schema para consultas de notas con paginación
export const getNotesQuerySchema = z.object({
  page: z.string().optional().transform(val => val ? parseInt(val, 10) : 1),
  limit: z.string().optional().transform(val => val ? parseInt(val, 10) : 10),
  search: z.string().optional().default(''),
  userId: z.string().optional()
})

// Schema para parámetros de ID
export const idParamSchema = z.object({
  id: z.string().min(1, 'ID es requerido')
})

// Schema para registro de administrador
export const createAdminSchema = z.object({
  name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
  role: z.enum(['ADMIN', 'SUPER_ADMIN'], {
    required_error: 'Rol es requerido',
    invalid_type_error: 'Rol debe ser ADMIN o SUPER_ADMIN'
  })
})

// Schema para actualizar rol (solo para super admin)
export const updateUserRoleSchema = z.object({
  role: z.enum(['USER', 'ADMIN'], {
    required_error: 'Rol es requerido',
    invalid_type_error: 'Rol debe ser USER o ADMIN'
  })
})

// Schema para toggle de estado de usuario
export const toggleUserStatusSchema = z.object({
  // Los parámetros vienen en la URL, no necesitamos validar body aquí
  // Pero podemos validar que sea un request válido
}).optional()

// Schema para filtros de dashboard
export const dashboardFiltersSchema = z.object({
  period: z.enum(['7d', '30d', '90d', '1y']).optional().default('30d')
}).optional()
