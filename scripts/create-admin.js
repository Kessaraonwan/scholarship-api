const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')
require('dotenv').config()

const prisma = new PrismaClient()

async function createAdmin() {
  try {
    console.log('🚀 Creating admin user...')

    // ตรวจสอบว่ามี admin อยู่แล้วหรือไม่
    const existingAdmin = await prisma.user.findFirst({
      where: { role: 'admin' },
    })

    if (existingAdmin) {
      console.log('❌ Admin user already exists!')
      console.log('Email:', existingAdmin.email)
      return
    }

    // ข้อมูล admin เริ่มต้น
    const adminData = {
      email: 'admin@scholarship.com',
      password: 'admin123456',
      firstName: 'Admin',
      lastName: 'System',
      role: 'admin',
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(adminData.password, 12)

    // สร้าง admin user
    const admin = await prisma.user.create({
      data: {
        email: adminData.email,
        password: hashedPassword,
        firstName: adminData.firstName,
        lastName: adminData.lastName,
        role: adminData.role,
      },
    })

    console.log('✅ Admin user created successfully!')
    console.log('📧 Email:', admin.email)
    console.log('🔑 Password:', adminData.password)
    console.log('⚠️  Please change the password after first login!')

  } catch (error) {
    console.error('❌ Error creating admin user:', error)
  } finally {
    await prisma.$disconnect()
  }
}

createAdmin()