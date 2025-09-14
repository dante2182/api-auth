import { getSession } from '@auth/express'
import { authConfig } from '../libs/auth.js'
import { prisma } from '../config/db.js'

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

export const requireAdmin = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        message: 'No autorizado - Sesión requerida'
      })
    }

    // Obtener información completa del usuario desde la base de datos
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: { id: true, email: true, name: true, role: true, isActive: true }
    })

    if (!user) {
      return res.status(404).json({
        message: 'Usuario no encontrado'
      })
    }

    if (!user.isActive) {
      return res.status(403).json({
        message: 'Cuenta desactivada'
      })
    }

    if (user.role !== 'ADMIN' && user.role !== 'SUPER_ADMIN') {
      return res.status(403).json({
        message: 'Acceso denegado: Se requieren permisos de administrador'
      })
    }

    // Agregar información de rol al request
    req.user.role = user.role
    req.user.isActive = user.isActive

    next()
  } catch (error) {
    console.error('Error en middleware de Admin:', error)
    return res.status(500).json({
      error: 'Error del servidor',
      message: 'Error al verificar permisos de administrador'
    })
  }
}

export const requireSuperAdmin = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        message: 'No autorizado - Sesión requerida'
      })
    }

    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: { id: true, role: true, isActive: true }
    })

    if (!user || !user.isActive) {
      return res.status(403).json({
        message: 'Acceso denegado'
      })
    }

    if (user.role !== 'SUPER_ADMIN') {
      return res.status(403).json({
        message: 'Acceso denegado: Se requieren permisos de Super Administrador'
      })
    }

    next()
  } catch (error) {
    console.error('Error en middleware de SuperAdmin:', error)
    return res.status(500).json({
      error: 'Error del servidor',
      message: 'Error al verificar permisos de super administrador'
    })
  }
}
