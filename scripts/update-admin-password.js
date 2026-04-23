const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')
require('dotenv').config()

const prisma = new PrismaClient()

async function updateAdminPassword() {
  try {
    console.log('🔄 Updating admin password...')

    // Hash new password
    const newPassword = 'admin123'
    const hashedPassword = await bcrypt.hash(newPassword, 12)

    // Update admin password
    const updatedUser = await prisma.user.updateMany({
      where: { email: 'admin@scholarship.com' },
      data: { password: hashedPassword },
    })

    console.log('✅ Admin password updated successfully!')
    console.log('📧 Email: admin@scholarship.com')
    console.log('🔑 New Password: admin123')

  } catch (error) {
    console.error('❌ Error updating password:', error)
  } finally {
    await prisma.$disconnect()
  }
}

updateAdminPassword()