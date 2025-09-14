import { Router } from 'express'
import noteRoutes from './note.routes.js'
import authRoutes from './auth.routes.js'
import userRoutes from './user.routes.js'
import adminRoutes from './admin.routes.js'

const routes = Router()

routes.use('/auth', authRoutes)
routes.use('/admin', adminRoutes)
routes.use('/user', userRoutes)
routes.use('/notes', noteRoutes)

export default routes
