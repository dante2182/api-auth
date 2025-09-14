import { hash } from 'bcrypt'
import { prisma } from '../config/db.js'
import { getSession } from '@auth/express'
import { authConfig } from '../libs/auth.js'

export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({ error: 'Email y contraseña son requeridos' })
    }

    const existingUser = await prisma.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      return res.status(400).json({ error: 'El email ya esta registrado' })
    }

    const hashedPassword = await hash(password, 10)

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword
      }
    })

    const { password: _, ...userWithoutPassword } = user

    res.status(201).json(userWithoutPassword)
  } catch (error) {
    console.error('Error al registrar usuario:', error)
    res.status(500).json({ error: 'Error del servidor' })
  }
}

// Función para crear administradores (solo Super Admin puede crear)
export const createAdmin = async (req, res) => {
  try {
    const { name, email, password, role } = req.body

    // Verificar que el usuario que hace la petición sea Super Admin
    const session = await getSession(req, authConfig)
    if (!session?.user) {
      return res.status(401).json({ error: 'No autorizado' })
    }

    const currentUser = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { role: true, isActive: true }
    })

    if (!currentUser || currentUser.role !== 'SUPER_ADMIN' || !currentUser.isActive) {
      return res.status(403).json({ error: 'Solo Super Administradores pueden crear administradores' })
    }

    if (!email || !password || !role) {
      return res.status(400).json({ error: 'Email, contraseña y rol son requeridos' })
    }

    if (!['ADMIN', 'SUPER_ADMIN'].includes(role)) {
      return res.status(400).json({ error: 'Rol debe ser ADMIN o SUPER_ADMIN' })
    }

    const existingUser = await prisma.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      return res.status(400).json({ error: 'El email ya está registrado' })
    }

    const hashedPassword = await hash(password, 10)

    const admin = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role,
        isActive: true
      }
    })

    const { password: _, ...adminWithoutPassword } = admin

    res.status(201).json({
      message: `${role} creado correctamente`,
      admin: adminWithoutPassword
    })
  } catch (error) {
    console.error('Error al crear administrador:', error)
    res.status(500).json({ error: 'Error del servidor' })
  }
}

// Función para obtener información del usuario actual
export const getCurrentUser = async (req, res) => {
  try {
    const session = await getSession(req, authConfig)

    if (!session?.user) {
      return res.status(401).json({ error: 'No autorizado' })
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        role: true,
        isActive: true,
        createdAt: true,
        emailVerified: true
      }
    })

    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' })
    }

    if (!user.isActive) {
      return res.status(403).json({ error: 'Cuenta desactivada' })
    }

    res.json({ user })
  } catch (error) {
    console.error('Error obteniendo usuario actual:', error)
    res.status(500).json({ error: 'Error del servidor' })
  }
}
