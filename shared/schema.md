# Shared Schema — Scholarship API

> ไฟล์นี้คือข้อตกลงกลางของทีม ห้ามแก้โดยไม่แจ้งทุกคนใน group chat ก่อน

---

## Scholarship Object

```typescript
interface Scholarship {
  id: string;           // UUID
  name: string;         // ชื่อทุน
  level: ScholarshipLevel;
  field: string;        // สาขาวิชา เช่น "IT" | "ทุกสาขา" | "วิทยาศาสตร์"
  country: string;      // ประเทศ เช่น "ไทย" | "UK" | "US"
  deadline: string;     // ISO 8601 date: "YYYY-MM-DD"
  amount: number | null;
  currency: "THB" | "USD" | "GBP" | "EUR" | "JPY" | null;
  url: string;          // ลิงก์สมัครทุน
  source: string;       // แหล่งที่มา เช่น "กยศ." | "Chevening"
  description: string | null;
  createdAt: string;    // ISO 8601 datetime
  updatedAt: string;    // ISO 8601 datetime
}

type ScholarshipLevel =
  | "มัธยม"
  | "ปริญญาตรี"
  | "ปริญญาโท"
  | "ปริญญาเอก"
  | "ทุกระดับ";
```

---

## User Object

```typescript
interface User {
  id: string;           // UUID
  email: string;        // Unique email
  name: string;
  tier: "free" | "pro"; // User subscription tier
  createdAt: string;    // ISO 8601 datetime
  updatedAt: string;    // ISO 8601 datetime
}

// Note: password is stored separately in DB (bcrypt hash), never sent in API
```

---

## API Key Object

```typescript
interface ApiKey {
  id: string;              // UUID
  userId: string;          // Reference to User
  key: string;             // Format: sk-<16 hex chars> (e.g., sk-1234567890abcdef)
  name?: string;           // User-defined name for key
  isActive: boolean;
  lastUsed?: string;       // ISO 8601 datetime
  createdAt: string;       // ISO 8601 datetime
}

// Rate limits per tier
// FREE: 100 requests/hour, 1000/day
// PRO:  1000 requests/hour, 10000/day
```

---

## API Response Format

ทุก Service ต้องส่ง response หน้าตาแบบนี้เสมอ

### Success (list)
```json
{
  "data": [...],
  "meta": {
    "total": 100,
    "page": 1,
    "limit": 20
  }
}
```

### Success (single item)
```json
{
  "data": { ...scholarship object }
}
```

### Error
```json
{
  "error": "ข้อความอธิบาย error",
  "code": 400
}
```

### HTTP Status Codes ที่ใช้
| Code | ความหมาย |
|------|---------|
| 200 | สำเร็จ |
| 201 | สร้างข้อมูลใหม่สำเร็จ |
| 400 | ข้อมูลที่ส่งมาไม่ถูกต้อง |
| 401 | ไม่มี API Key หรือ Key ไม่ถูกต้อง |
| 403 | ไม่มีสิทธิ์ |
| 404 | ไม่พบข้อมูล |
| 429 | เกิน Rate Limit |
| 500 | Server Error |

---

## Auth Header

ทุก Request ที่ต้องการ Authentication ต้องส่ง header นี้มาด้วย

```
Authorization: Bearer <api_key>
```

Service แต่ละตัวไม่ต้องตรวจ key เอง — ส่ง request ไปให้ `service-auth` (port 3001) ตรวจแทน

---

## Notification Rule Object (service-notification)

```typescript
interface NotificationRule {
  id: string;
  userId: string;
  field: string | null;     // null = ทุกสาขา
  level: ScholarshipLevel | null; // null = ทุกระดับ
  country: string | null;   // null = ทุกประเทศ
  isActive: boolean;
  webhookUrl: string | null; // Pro tier เท่านั้น
  email: string | null;
  createdAt: string;
}
```

---

## Event ที่ Service ส่งหากัน

เมื่อ `service-ingestion` ดึงทุนใหม่เข้ามา จะเรียก `service-notification` ผ่าน HTTP POST

```
POST http://localhost:3005/internal/trigger
Body: {
  "newScholarships": [Scholarship, ...]
}
```

> ใช้ header `X-Internal-Secret: <secret>` เพื่อยืนยันว่าเป็น internal call ไม่ใช่ external request
