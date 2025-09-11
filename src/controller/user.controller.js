import { prisma } from '../config/db.js'
import { getSession } from '@auth/express'
import { authConfig } from '../libs/auth.js'

export const getUserProfile = async (req, res) => {
  try {
    const session = await getSession(req, authConfig)

    if (!session?.user) {
      return res.status(401).json({ error: 'No autorizado' })
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: {
        accounts: {
          select: {
            provider: true,
            providerAccountId: true
          }
        }
      }
    })

    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' })
    }

    res.json(user)
  } catch (error) {
    console.error('Error obteniendo perfil:', error)
    res.status(500).json({ error: 'Error del servidor' })
  }
}
