const jwt = require('jsonwebtoken')
require('dotenv').config()

const JWT_SECRET = process.env.JWT_SECRET
console.log('JWT_SECRET:', JWT_SECRET)

const payload = {
  userId: 'test-user-id',
  email: 'test@example.com',
  firstName: 'Test',
  lastName: 'User',
}

const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' })
console.log('Generated token:', token)

const decoded = jwt.verify(token, JWT_SECRET)
console.log('Decoded token:', decoded)

console.log('Token valid:', !!decoded)