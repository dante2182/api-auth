import { Router } from 'express'
import { requireAuth, requireAdmin, requireSuperAdmin } from '../middlewares/admin.middleware.js'
import { validate } from '../middlewares/validate.middleware.js'
import {
  getAllUsers,
  getUserById,
  toggleUserStatus,
  deleteUser,
  getAllNotes,
  deleteNote,
  getDashboardStats,
  getAdmins
} from '../controller/admin.controller.js'
import {
  getUsersQuerySchema,
  getNotesQuerySchema,
  idParamSchema,
  dashboardFiltersSchema
} from '../schema/admin.schema.js'

const routes = Router()

// Aplicar autenticación a todas las rutas de admin
routes.use(requireAuth)
routes.use(requireAdmin)

// ============ DASHBOARD Y ESTADÍSTICAS ============
routes.get('/dashboard', validate(dashboardFiltersSchema, 'query'), getDashboardStats)

// ============ GESTIÓN DE USUARIOS ============
// Obtener todos los usuarios (excluye administradores)
routes.get('/users', validate(getUsersQuerySchema, 'query'), getAllUsers)

// Obtener usuario por ID (excluye administradores)
routes.get('/users/:id', validate(idParamSchema, 'params'), getUserById)

// Activar/desactivar usuario
routes.patch('/users/:id/toggle-status', validate(idParamSchema, 'params'), toggleUserStatus)

// Eliminar usuario (no puede eliminar administradores)
routes.delete('/users/:id', validate(idParamSchema, 'params'), deleteUser)

// ============ GESTIÓN DE NOTAS ============
// Obtener todas las notas (excluye notas de administradores)
routes.get('/notes', validate(getNotesQuerySchema, 'query'), getAllNotes)

// Eliminar nota (no puede eliminar notas de administradores)
routes.delete('/notes/:id', validate(idParamSchema, 'params'), deleteNote)

// ============ GESTIÓN DE ADMINISTRADORES (Solo Super Admin) ============
// Obtener lista de administradores - Solo Super Admin
routes.get('/admins', requireSuperAdmin, getAdmins)

export default routes
