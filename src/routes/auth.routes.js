import { Router } from 'express'
import { ExpressAuth } from '@auth/express'
import { authConfig } from '../libs/auth.js'
import { registerUser } from '../controller/auth.controller.js'
import { validate } from '../middlewares/validate.middleware.js'
import { registerSchema } from '../schema/auth.schema.js'

const routes = Router()

routes.post('/register', validate(registerSchema), registerUser)
routes.use('/', ExpressAuth(authConfig))

export default routes
