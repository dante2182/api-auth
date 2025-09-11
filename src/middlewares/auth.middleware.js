import { getSession } from '@auth/express'
import { authConfig } from '../libs/auth.js'

export const requireAuth = async (req, res, next) => {
  try {
    const session = await getSession(req, authConfig)
    if (!session || !session.user) {
      return res.status(401).json({
        message: 'No autorizado'
      })
    }

    req.user = session.user
    next()
  } catch (error) {
    console.error('Error en middleware de Auth:', error)
    return res.status(500).json({
      error: 'Error del servidor',
      message: 'Error al verificar la autenticación'
    })
  }
}

export const optionalAuth = async (req, res, next) => {
  try {
    const session = await getSession(req, authConfig)
    req.user = session?.user || null
    next()
  } catch (error) {
    console.error('Error en middleware de auth opcional:', error)
    req.user = null
    next()
  }
}
