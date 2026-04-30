const fetch = require('node-fetch')

async function testLogin() {
  try {
    console.log('🧪 Testing login API...')

    const response = await fetch('http://localhost:3001/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'admin@scholarship.com',
        password: 'admin123',
      }),
    })

    console.log('📡 Response status:', response.status)
    console.log('📡 Response headers:', Object.fromEntries(response.headers.entries()))

    const result = await response.json()
    console.log('📡 Response body:', result)

  } catch (error) {
    console.error('❌ Error testing login:', error)
  }
}

testLogin()