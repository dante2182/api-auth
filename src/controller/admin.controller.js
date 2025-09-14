import { prisma } from '../config/db.js'

// ============ GESTIÓN DE USUARIOS ============

export const getAllUsers = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = '', role } = req.query

    const skip = (parseInt(page) - 1) * parseInt(limit)
    const take = parseInt(limit)

    // Construcción del filtro WHERE
    const where = {
      AND: [
        // Excluir administradores de la lista para evitar eliminaciones accidentales
        {
          role: {
            not: 'ADMIN'
          }
        },
        {
          role: {
            not: 'SUPER_ADMIN'
          }
        },
        // Filtro de búsqueda por nombre o email
        search
          ? {
              OR: [
                { name: { contains: search, mode: 'insensitive' } },
                { email: { contains: search, mode: 'insensitive' } }
              ]
            }
          : {},
        // Filtro por rol específico
        role ? { role } : {}
      ]
    }

    const [users, totalCount] = await Promise.all([
      prisma.user.findMany({
        where,
        skip,
        take,
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          isActive: true,
          emailVerified: true,
          image: true,
          createdAt: true,
          updatedAt: true,
          _count: {
            select: {
              Note: true,
              accounts: true
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        }
      }),
      prisma.user.count({ where })
    ])

    const totalPages = Math.ceil(totalCount / take)

    res.json({
      users,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: totalCount,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1
      }
    })
  } catch (error) {
    console.error('Error al obtener usuarios:', error)
    res.status(500).json({ error: 'Error del servidor' })
  }
}

export const getUserById = async (req, res) => {
  try {
    const { id } = req.params

    const user = await prisma.user.findUnique({
      where: { id },
      include: {
        accounts: {
          select: {
            provider: true,
            providerAccountId: true
          }
        },
        Note: {
          select: {
            id: true,
            title: true,
            createdAt: true,
            updatedAt: true
          },
          orderBy: {
            createdAt: 'desc'
          }
        }
      }
    })

    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' })
    }

    // No mostrar información de administradores
    if (user.role === 'ADMIN' || user.role === 'SUPER_ADMIN') {
      return res.status(403).json({ error: 'Acceso denegado a información de administradores' })
    }

    const { password, ...userWithoutPassword } = user

    res.json(userWithoutPassword)
  } catch (error) {
    console.error('Error al obtener usuario:', error)
    res.status(500).json({ error: 'Error del servidor' })
  }
}

export const toggleUserStatus = async (req, res) => {
  try {
    const { id } = req.params

    const user = await prisma.user.findUnique({
      where: { id },
      select: { id: true, role: true, isActive: true, email: true, name: true }
    })

    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' })
    }

    // Prevenir desactivación de administradores
    if (user.role === 'ADMIN' || user.role === 'SUPER_ADMIN') {
      return res.status(403).json({ error: 'No se puede modificar el estado de un administrador' })
    }

    const updatedUser = await prisma.user.update({
      where: { id },
      data: { isActive: !user.isActive },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isActive: true,
        updatedAt: true
      }
    })

    res.json({
      message: `Usuario ${updatedUser.isActive ? 'activado' : 'desactivado'} correctamente`,
      user: updatedUser
    })
  } catch (error) {
    console.error('Error al cambiar estado del usuario:', error)
    res.status(500).json({ error: 'Error del servidor' })
  }
}

export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params

    const user = await prisma.user.findUnique({
      where: { id },
      select: { id: true, role: true, email: true, name: true }
    })

    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' })
    }

    // Prevenir eliminación de administradores
    if (user.role === 'ADMIN' || user.role === 'SUPER_ADMIN') {
      return res.status(403).json({ error: 'No se puede eliminar un administrador' })
    }

    await prisma.user.delete({
      where: { id }
    })

    res.json({
      message: 'Usuario eliminado correctamente',
      deletedUser: {
        id: user.id,
        name: user.name,
        email: user.email
      }
    })
  } catch (error) {
    console.error('Error al eliminar usuario:', error)
    res.status(500).json({ error: 'Error del servidor' })
  }
}

// ============ GESTIÓN DE NOTAS ============

export const getAllNotes = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = '', userId } = req.query

    const skip = (parseInt(page) - 1) * parseInt(limit)
    const take = parseInt(limit)

    const where = {
      AND: [
        // Excluir notas de administradores
        {
          user: {
            role: {
              not: 'ADMIN'
            }
          }
        },
        {
          user: {
            role: {
              not: 'SUPER_ADMIN'
            }
          }
        },
        // Filtro de búsqueda
        search
          ? {
              OR: [
                { title: { contains: search, mode: 'insensitive' } },
                { content: { contains: search, mode: 'insensitive' } }
              ]
            }
          : {},
        // Filtro por usuario específico
        userId ? { userId } : {}
      ]
    }

    const [notes, totalCount] = await Promise.all([
      prisma.note.findMany({
        where,
        skip,
        take,
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              image: true
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        }
      }),
      prisma.note.count({ where })
    ])

    const totalPages = Math.ceil(totalCount / take)

    res.json({
      notes,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: totalCount,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1
      }
    })
  } catch (error) {
    console.error('Error al obtener notas:', error)
    res.status(500).json({ error: 'Error del servidor' })
  }
}

export const deleteNote = async (req, res) => {
  try {
    const { id } = req.params

    const note = await prisma.note.findUnique({
      where: { id },
      include: {
        user: {
          select: { id: true, role: true, name: true, email: true }
        }
      }
    })

    if (!note) {
      return res.status(404).json({ error: 'Nota no encontrada' })
    }

    // Prevenir eliminación de notas de administradores
    if (note.user.role === 'ADMIN' || note.user.role === 'SUPER_ADMIN') {
      return res.status(403).json({ error: 'No se pueden eliminar notas de administradores' })
    }

    await prisma.note.delete({
      where: { id }
    })

    res.json({
      message: 'Nota eliminada correctamente',
      deletedNote: {
        id: note.id,
        title: note.title,
        user: note.user.name || note.user.email
      }
    })
  } catch (error) {
    console.error('Error al eliminar nota:', error)
    res.status(500).json({ error: 'Error del servidor' })
  }
}

// ============ ESTADÍSTICAS Y DASHBOARD ============

export const getDashboardStats = async (req, res) => {
  try {
    const [
      totalUsers,
      activeUsers,
      totalNotes,
      recentUsers,
      recentNotes,
      usersByRole
    ] = await Promise.all([
      // Total de usuarios (excluyendo administradores)
      prisma.user.count({
        where: {
          AND: [
            { role: { not: 'ADMIN' } },
            { role: { not: 'SUPER_ADMIN' } }
          ]
        }
      }),
      // Usuarios activos (excluyendo administradores)
      prisma.user.count({
        where: {
          AND: [
            { isActive: true },
            { role: { not: 'ADMIN' } },
            { role: { not: 'SUPER_ADMIN' } }
          ]
        }
      }),
      // Total de notas (excluyendo notas de administradores)
      prisma.note.count({
        where: {
          user: {
            AND: [
              { role: { not: 'ADMIN' } },
              { role: { not: 'SUPER_ADMIN' } }
            ]
          }
        }
      }),
      // Usuarios recientes (últimos 5)
      prisma.user.findMany({
        where: {
          AND: [
            { role: { not: 'ADMIN' } },
            { role: { not: 'SUPER_ADMIN' } }
          ]
        },
        take: 5,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
          createdAt: true,
          isActive: true
        }
      }),
      // Notas recientes (últimas 5)
      prisma.note.findMany({
        where: {
          user: {
            AND: [
              { role: { not: 'ADMIN' } },
              { role: { not: 'SUPER_ADMIN' } }
            ]
          }
        },
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              image: true
            }
          }
        }
      }),
      // Usuarios por rol (excluyendo administradores)
      prisma.user.groupBy({
        by: ['role'],
        where: {
          AND: [
            { role: { not: 'ADMIN' } },
            { role: { not: 'SUPER_ADMIN' } }
          ]
        },
        _count: {
          role: true
        }
      })
    ])

    res.json({
      stats: {
        totalUsers,
        activeUsers,
        inactiveUsers: totalUsers - activeUsers,
        totalNotes
      },
      recent: {
        users: recentUsers,
        notes: recentNotes
      },
      usersByRole: usersByRole.reduce((acc, item) => {
        acc[item.role] = item._count.role
        return acc
      }, {})
    })
  } catch (error) {
    console.error('Error al obtener estadísticas:', error)
    res.status(500).json({ error: 'Error del servidor' })
  }
}

// ============ GESTIÓN DE ADMINISTRADORES (Solo Super Admin) ============

export const getAdmins = async (req, res) => {
  try {
    const admins = await prisma.user.findMany({
      where: {
        OR: [
          { role: 'ADMIN' },
          { role: 'SUPER_ADMIN' }
        ]
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isActive: true,
        createdAt: true,
        emailVerified: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    res.json({ admins })
  } catch (error) {
    console.error('Error al obtener administradores:', error)
    res.status(500).json({ error: 'Error del servidor' })
  }
}
