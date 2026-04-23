import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { prisma } from './prisma'

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12)
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword)
}

export function generateJWT(payload: object): string {
  return jwt.sign(payload, process.env.JWT_SECRET!, { expiresIn: '7d' })
}

export function generateRefreshToken(payload: object): string {
  return jwt.sign(payload, process.env.JWT_SECRET!, { expiresIn: '30d' })
}

export function verifyJWT(token: string): any {
  try {
    return jwt.verify(token, process.env.JWT_SECRET!)
  } catch (error) {
    console.error('JWT verification error:', error)
    return null
  }
}

export async function createUser(email: string, password: string, firstName: string, lastName: string, role: string = 'user') {
  const hashedPassword = await hashPassword(password)

  return prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      firstName,
      lastName,
      role,
    },
  })
}

export async function findUserByEmail(email: string) {
  return prisma.user.findUnique({
    where: { email },
  })
}

export async function createApiKey(userId: string, name: string) {
  const key = `sk_${Math.random().toString(36).substring(2)}${Date.now().toString(36)}`

  return prisma.apiKey.create({
    data: {
      userId,
      key,
      name,
    },
  })
}

export async function getUserApiKeys(userId: string) {
  return prisma.apiKey.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
  })
}

export async function createAdminUser(email: string, password: string, firstName: string, lastName: string) {
  return createUser(email, password, firstName, lastName, 'admin')
}

export async function isAdmin(userId: string): Promise<boolean> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { role: true },
  })
  return user?.role === 'admin'
}

export { prisma }