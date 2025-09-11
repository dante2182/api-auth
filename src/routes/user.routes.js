import { Router } from 'express'
import { getUserProfile } from '../controller/user.controller.js'
import { requireAuth } from '../middlewares/auth.middleware.js'

const routes = Router()

routes.get('/profile', requireAuth, getUserProfile)

export default routes
