import { hash } from 'bcrypt'
import { PrismaClient } from './src/generated/prisma/client.js'

const prisma = new PrismaClient()

async function createSuperAdmin () {
  try {
    console.log('🔧 Creando Super Administrador...')

    // Datos del Super Admin (puedes cambiar estos valores)
    const superAdminData = {
      name: 'Super Admin',
      email: 'admin@example.com', // ¡CAMBIA ESTE EMAIL!
      password: 'admin123456', // ¡CAMBIA ESTA CONTRASEÑA!
      role: 'SUPER_ADMIN'
    }

    // Verificar si ya existe un super admin
    const existingSuperAdmin = await prisma.user.findFirst({
      where: { role: 'SUPER_ADMIN' }
    })

    if (existingSuperAdmin) {
      console.log('❌ Ya existe un Super Administrador en el sistema')
      console.log('📧 Email:', existingSuperAdmin.email)
      return
    }

    // Verificar si el email ya está registrado
    const existingUser = await prisma.user.findUnique({
      where: { email: superAdminData.email }
    })

    if (existingUser) {
      console.log('❌ El email ya está registrado con otro usuario')
      console.log('📧 Email conflictivo:', superAdminData.email)
      return
    }

    // Crear hash de la contraseña
    const hashedPassword = await hash(superAdminData.password, 10)

    // Crear el Super Admin
    const superAdmin = await prisma.user.create({
      data: {
        name: superAdminData.name,
        email: superAdminData.email,
        password: hashedPassword,
        role: superAdminData.role,
        isActive: true,
        emailVerified: new Date() // Marcar como verificado
      }
    })

    console.log('✅ Super Administrador creado exitosamente!')
    console.log('📧 Email:', superAdmin.email)
    console.log('👤 Nombre:', superAdmin.name)
    console.log('🔑 Rol:', superAdmin.role)
    console.log('')
    console.log('⚠️  IMPORTANTE: Cambia la contraseña después del primer login')
    console.log('🔐 Contraseña temporal:', superAdminData.password)
    console.log('')
    console.log('📝 Puedes iniciar sesión en:')
    console.log('   - POST /api/auth/signin/credentials')
    console.log('   - Email:', superAdmin.email)
    console.log('   - Password:', superAdminData.password)
  } catch (error) {
    console.error('❌ Error al crear Super Administrador:', error)
  } finally {
    await prisma.$disconnect()
  }
}

createSuperAdmin()
