const { PrismaClient } = require('@prisma/client')
require('dotenv').config()

const prisma = new PrismaClient()

async function fixAdminRole() {
  try {
    console.log('🔧 Fixing admin role...')

    // Update admin role
    const updatedUser = await prisma.user.updateMany({
      where: { email: 'admin@scholarship.com' },
      data: { role: 'admin' },
    })

    console.log('✅ Admin role updated successfully!')
    console.log('📧 Email: admin@scholarship.com')
    console.log('👑 Role: admin')

  } catch (error) {
    console.error('❌ Error updating role:', error)
  } finally {
    await prisma.$disconnect()
  }
}

fixAdminRole()