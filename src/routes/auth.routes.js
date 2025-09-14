import { Router } from 'express'
import { ExpressAuth } from '@auth/express'
import { authConfig } from '../libs/auth.js'
import { registerUser, createAdmin, getCurrentUser } from '../controller/auth.controller.js'
import { validate } from '../middlewares/validate.middleware.js'
import { registerSchema } from '../schema/auth.schema.js'
import { createAdminSchema } from '../schema/admin.schema.js'
import { requireAuth, requireSuperAdmin } from '../middlewares/admin.middleware.js'

const routes = Router()

routes.post('/register', validate(registerSchema), registerUser)

// Ruta para obtener información del usuario actual
routes.get('/me', requireAuth, getCurrentUser)

// Ruta para crear administradores (solo Super Admin)
routes.post('/admin/create', requireAuth, requireSuperAdmin, validate(createAdminSchema), createAdmin)

routes.use('/', ExpressAuth(authConfig))

export default routes
