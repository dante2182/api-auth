import { Router } from 'express'
import { ExpressAuth } from '@auth/express'
import { authConfig } from '../libs/auth.js'
import { registerUser } from '../controller/auth.controller.js'

const routes = Router()

routes.post('/register', registerUser)
routes.use('/', ExpressAuth(authConfig))

export default routes
