# 🔐 API Key Verification Guide

## 📋 ภาพรวม

ระบบนี้ช่วยให้คุณสามารถตรวจสอบ API keys และติดตามการใช้งาน API ของทุกคน

### สิ่งที่เพิ่มเข้ามาใหม่

✅ **API Key Middleware** - ตรวจสอบ API key จาก request header  
✅ **Usage Logging** - บันทึกการใช้งาน API โดยอัตโนมัติ  
✅ **User Tracking** - รู้ว่า API ใช้โดยใคร  
✅ **API Key Status Check** - ตรวจสอบว่า key ยังใช้งานอยู่หรือเปิด/ปิด  

---

## 🚀 วิธีการใช้งาน

### 1️⃣ สร้าง API Key ก่อน

ต้องเข้าสู่ระบบก่อน ไปที่ Dashboard → API Keys → สร้าง Key

```
URL: http://localhost:3002/dashboard/keys
ตั้งชื่อ Key แล้วกด "สร้าง Key"
```

ระบบจะให้ key มาแบบนี้: `sk_abc123def456xyz`

⚠️ **สำคัญ:** คัดลอก key ไว้เพราะจะไม่โชว์อีก!

---

### 2️⃣ ใช้ API Key ในคำขอ

เมื่อต้องการเรียก API ให้ส่ง header ดังนี้:

```
Authorization: Bearer sk_abc123def456xyz
```

#### ตัวอย่างการส่ง GET request

**cURL:**
```bash
curl -X GET http://localhost:3002/api/example \
  -H "Authorization: Bearer sk_abc123def456xyz"
```

**JavaScript/Fetch:**
```javascript
const apiKey = 'sk_abc123def456xyz'

const response = await fetch('http://localhost:3002/api/example', {
  method: 'GET',
  headers: {
    'Authorization': `Bearer ${apiKey}`,
    'Content-Type': 'application/json'
  }
})

const data = await response.json()
console.log(data)
```

**JavaScript/Axios:**
```javascript
import axios from 'axios'

const apiKey = 'sk_abc123def456xyz'

const response = await axios.get('http://localhost:3002/api/example', {
  headers: {
    'Authorization': `Bearer ${apiKey}`
  }
})

console.log(response.data)
```

**Python/Requests:**
```python
import requests

api_key = 'sk_abc123def456xyz'

response = requests.get(
    'http://localhost:3002/api/example',
    headers={
        'Authorization': f'Bearer {api_key}'
    }
)

print(response.json())
```

#### ตัวอย่าง POST request

**cURL:**
```bash
curl -X POST http://localhost:3002/api/example \
  -H "Authorization: Bearer sk_abc123def456xyz" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "สมชาย",
    "email": "somchai@example.com"
  }'
```

**JavaScript/Fetch:**
```javascript
const apiKey = 'sk_abc123def456xyz'

const response = await fetch('http://localhost:3002/api/example', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${apiKey}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    name: 'สมชาย',
    email: 'somchai@example.com'
  })
})

const data = await response.json()
console.log(data)
```

---

## 📊 ตรวจสอบการใช้งาน (Usage Logs)

### ดู Usage Logs ของตัวเอง

```bash
curl -X GET "http://localhost:3002/api/usage-logs?limit=50&days=7" \
  -H "Authorization: Bearer sk_abc123def456xyz"
```

**Parameters:**
- `limit` - จำนวน logs ที่แสดง (default: 50)
- `days` - ระยะเวลา (default: 7 วัน)

**Response Example:**
```json
{
  "userId": "user_123",
  "userName": "สมชาย ใจดี",
  "stats": {
    "totalRequests": 45,
    "successRequests": 43,
    "errorRequests": 2,
    "averageResponseTime": 125,
    "endpoints": {
      "/api/example": 23,
      "/api/data": 22
    },
    "methods": {
      "GET": 30,
      "POST": 15
    },
    "statusCodes": {
      "200": 40,
      "201": 3,
      "400": 2
    }
  },
  "logs": [
    {
      "id": "log_001",
      "endpoint": "/api/example",
      "method": "GET",
      "statusCode": 200,
      "responseTime": "125ms",
      "ipAddress": "192.168.1.1",
      "timestamp": "2024-04-25T10:30:00.000Z"
    }
  ],
  "pagination": {
    "limit": 50,
    "returned": 45,
    "period": "7 วันที่ผ่านมา"
  }
}
```

---

## 🔒 ตรวจสอบสิทธิ์ (Verification Process)

### ขั้นตอนที่เกิดขึ้น

```
1. ส่ง API key ใน Header
   ↓
2. ระบบค้นหา API key ในฐานข้อมูล
   ↓
3. ตรวจสอบว่า API key ถูกต้อง
   ✓ ถ้าหาเจอ → ต่อไป
   ✗ ถ้าหาไม่เจอ → ส่ง 401 Unauthorized
   ↓
4. ตรวจสอบว่า API key เปิดใช้งาน (isActive = true)
   ✓ ถ้าใช้งาน → ต่อไป
   ✗ ถ้าปิด → ส่ง 403 Forbidden
   ↓
5. ตรวจสอบว่าบัญชีผู้ใช้ยังเปิด (user.isActive = true)
   ✓ ถ้าเปิด → ต่อไป
   ✗ ถ้าปิด → ส่ง 403 Forbidden
   ↓
6. อัปเดต lastUsedAt ในฐานข้อมูล
   ↓
7. บันทึก usage log (endpoint, method, status, response time)
   ↓
8. ส่ง response กลับ
```

---

## ❌ Error Responses

### 401 - Unauthorized (ไม่ได้รับสิทธิ์)

**ไม่ส่ง API key:**
```json
{
  "error": "ไม่พบ API key - ส่ง Authorization header พร้อม Bearer token"
}
```

**รูปแบบ header ผิด:**
```json
{
  "error": "รูปแบบ Authorization header ไม่ถูกต้อง - ใช้ \"Bearer sk_xxxxx\""
}
```

**API key ไม่ถูกต้อง:**
```json
{
  "error": "API key ไม่ถูกต้อง"
}
```

### 403 - Forbidden (ห้ามเข้า)

**API key ปิดใช้งาน:**
```json
{
  "error": "API key ปิดใช้งานแล้ว"
}
```

**บัญชีผู้ใช้ปิด:**
```json
{
  "error": "บัญชีผู้ใช้ปิดใช้งานแล้ว"
}
```

---

## 📝 Database Schema

### ตาราง `api_keys`

| Column | Type | คำอธิบาย |
|--------|------|---------|
| `id` | String | ID เฉพาะของ key |
| `userId` | String | ID ของผู้ใช้ที่เป็นเจ้าของ |
| `key` | String (Unique) | API key จริง (sk_xxxxx) |
| `name` | String | ชื่อ key ที่ผู้ใช้ตั้ง |
| `isActive` | Boolean | สถานะ (true/false) |
| `lastUsedAt` | DateTime | ใช้ล่าสุดเมื่อ |
| `createdAt` | DateTime | สร้างเมื่อ |

### ตาราง `usage_logs`

| Column | Type | คำอธิบาย |
|--------|------|---------|
| `id` | String | ID เฉพาะของ log |
| `userId` | String | ID ผู้ใช้ |
| `apiKeyId` | String | ID ของ API key ที่ใช้ |
| `endpoint` | String | URL endpoint ที่เรียก |
| `method` | String | HTTP method (GET, POST, etc) |
| `statusCode` | Int | HTTP status code |
| `responseTime` | Int | เวลาตอบสนอง (milliseconds) |
| `ipAddress` | String | IP address ของผู้ส่ง |
| `createdAt` | DateTime | เวลาที่บันทึก |

---

## 🧪 ทดสอบจริง

### ตัวอย่างที่สมบูรณ์

#### 1. สร้าง API key ก่อน

ไป http://localhost:3002/dashboard/keys

ตั้งชื่อว่า "test-key" แล้วกด สร้าง Key

ได้ key มาเป็น: `sk_1a2b3c4d5e6f7g8h`

#### 2. ทดสอบ GET request

```bash
curl -X GET http://localhost:3002/api/example \
  -H "Authorization: Bearer sk_1a2b3c4d5e6f7g8h"
```

**ผลลัพธ์ที่คาดหวัง:**
```json
{
  "message": "สำเร็จ - API key verified",
  "data": {
    "userId": "user_123",
    "userEmail": "somchai@example.com",
    "userName": "สมชาย ใจดี",
    "apiKeyName": "test-key",
    "timestamp": "2024-04-25T10:30:00.000Z"
  }
}
```

#### 3. ทดสอบ POST request

```bash
curl -X POST http://localhost:3002/api/example \
  -H "Authorization: Bearer sk_1a2b3c4d5e6f7g8h" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "สมชาย",
    "age": 30
  }'
```

**ผลลัพธ์:**
```json
{
  "message": "รับข้อมูลแล้ว",
  "received": {
    "name": "สมชาย",
    "age": 30
  },
  "userId": "user_123"
}
```

#### 4. ดู Usage Logs

```bash
curl -X GET "http://localhost:3002/api/usage-logs?limit=10&days=7" \
  -H "Authorization: Bearer sk_1a2b3c4d5e6f7g8h"
```

จะได้ logs ของการใช้งาน API ในช่วง 7 วันที่ผ่านมา

---

## 💡 Tips

✅ API key ควรจัดเก็บในตัวแปรสภาพแวดล้อม ไม่ใช่ hardcode ในโค้ด

```javascript
// ❌ ไม่ดี
const apiKey = 'sk_1a2b3c4d5e6f7g8h'

// ✅ ดี
const apiKey = process.env.API_KEY
```

✅ ใช้ HTTPS ในการผลิต เพื่อป้องกัน key ถูกดักจับ

✅ หมุนเวียน API key ครั้งคราว (ลบ key เก่า สร้าง key ใหม่)

✅ ติดตามการใช้งาน ถ้าเห็นการใช้งานแปลก ให้ลบ key ทันที

---

## 📚 Middleware Code

ถ้าต้องการใช้ verification ในสถานที่อื่น:

```typescript
import { requireApiKey, logApiUsage } from '@/lib/api-key-middleware'

export async function GET(request: NextRequest) {
  // ตรวจสอบ API key
  const { user, error } = await requireApiKey(request)
  if (error) return error

  // ตอนนี้มี user พร้อมใช้
  console.log(`User: ${user.userName}`)
  
  // ทำสิ่งที่ต้องการ
  const result = { success: true }
  
  // บันทึก usage
  const startTime = Date.now()
  const responseTime = Date.now() - startTime
  const ipAddress = request.headers.get('x-forwarded-for') || 'unknown'
  
  logApiUsage(
    user.userId,
    user.apiKeyId,
    '/api/my-endpoint',
    'GET',
    200,
    responseTime,
    ipAddress
  )
  
  return NextResponse.json(result)
}
```

---

## 🔧 เพิ่มเติม

เสร็จแล้ว! สามารถใช้ API key verification ได้แล้ว ทุก endpoint ที่ใช้ `requireApiKey` จะ:

1. ตรวจสอบ API key โดยอัตโนมัติ
2. บันทึกการใช้งาน
3. รู้ว่าใคร (userId) เรียก API
4. รู้ว่าเรียก endpoint ไหน
5. รู้ว่าใช้เวลานานเท่าไหร่
