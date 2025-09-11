import { hash } from 'bcrypt'
import { prisma } from '../config/db.js'

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
