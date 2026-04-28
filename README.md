# Scholarship API

ระบบ API สำหรับข้อมูลทุนการศึกษา — Web Service Management System

---

## ทีม

| Service | หน้าที่ | คนดูแล | Port |
|---------|---------|--------|------|
| `service-auth` | API Gateway & Auth | แบงค์ | 3001 |
| `service-ingestion` | Data Ingestion & Scraper | มิก | 3002 |
| `service-core` | Core API ค้นหาทุน | อีฟ | 3003 |
| `service-analytics` | Analytics & Dashboard | ภู | 3004 |
| `service-notification` | Notification & Webhook | ปิ่น | 3005 |
| `service-landing` | Landing Page & Docs | ซี | 3000 |

---

## ภาพรวมระบบ

ระบบนี้มี 2 โหมดพร้อมกัน
- Website สำหรับ End User ค้นหาทุนและตั้งแจ้งเตือน
- API Platform สำหรับ Developer สมัครสมาชิก รับ API Key และเรียก REST API

---

## Role และสิทธิ์เข้าถึงหน้า

| Role | หน้า |
|------|------|
| Guest | `/`, `/docs`, `/docs/quickstart`, `/register`, `/login` |
| Free User | สิทธิ์ของ Guest + `/scholarships`, `/scholarships/:id`, `/scholarships/upcoming`, `/dashboard/keys`, `/dashboard/usage`, `/dashboard/notifications`, `/dashboard/notifications/logs` |
| Pro User | สิทธิ์ของ Free User + `/analytics`, `/match` และเปิดใช้ Webhook URL ได้ |
| Admin | `/admin/ingestion` (ทีมดูแลระบบเท่านั้น) |

---

## Route Ownership

| Route | Owner |
|------|------|
| `/register` | แบงค์ |
| `/login` | แบงค์ |
| `/dashboard/keys` | แบงค์ |
| `/dashboard/usage` | แบงค์ |
| `/admin/ingestion` | มิก |
| `/scholarships` | อีฟ |
| `/scholarships/:id` | อีฟ |
| `/scholarships/upcoming` | อีฟ |
| `/analytics` | ภู |
| `/match` | ภู |
| `/dashboard/notifications` | ปิ่น |
| `/dashboard/notifications/logs` | ปิ่น |
| `/` | ซี |
| `/docs` | ซี |
| `/docs/quickstart` | ซี |
| `/status` | ซี |

---

## เริ่มต้นใช้งาน (ทำครั้งเดียวหลัง clone)

```bash
# 1. Clone repo
git clone https://github.com/ทีม/scholarship-api.git
cd scholarship-api

# 2. รัน setup script ระบุชื่อ service ของตัวเอง
setup.bat notification   # เปลี่ยนเป็นชื่อ service ของตัวเอง

# 3. เข้าโฟลเดอร์ service ของตัวเอง
cd service-notification

# 4. ติดตั้ง dependencies
npm install

# 5. รัน dev server
npm run dev
```

> script จะสร้าง `.env` และ git branch ให้อัตโนมัติ

---

## รันทุก Service พร้อมกัน (Docker)

```bash
docker-compose up
```

จากนั้นเข้าที่:
- **Landing Page**: http://localhost:3000
- **API Docs**: http://localhost:3000/docs
- **Quickstart**: http://localhost:3000/docs/quickstart
- **System Status**: http://localhost:3000/status

---

## API Health Checklist

ทุก service ต้องมี:

- `GET /api/health`

และ `service-landing` ต้องมี:

- `GET /api/status` (aggregate health จากทุก service)

---

## โครงสร้าง

```
scholarship-api/
├── service-auth/
├── service-ingestion/
├── service-core/
├── service-analytics/
├── service-notification/
├── service-landing/
├── shared/
│   ├── schema.md       ← Schema กลาง — อ่านก่อนเริ่มทำงาน
│   ├── mockData.js     ← Mock data ใช้ระหว่าง dev
│   └── README.md
├── .env.example
├── .gitignore
├── docker-compose.yml
├── setup.sh
└── README.md
```

---

## Git Workflow

```bash
main   ← production, ห้าม push ตรง
dev    ← staging, รวม code ก่อน merge ขึ้น main
feat/auth | feat/ingestion | feat/core | feat/analytics | feat/notification | feat/landing
```

**กฎสำคัญ**
- ห้าม push ตรง `main` เด็ดขาด
- ห้าม merge PR ของตัวเอง — ให้คนอื่น review ก่อน
- ทำงานบน `feat/ชื่อservice` เสมอ

```bash
# flow ทำงานทุกวัน
git pull origin dev          # ดึง code ล่าสุดก่อนเสมอ
# ... ทำงาน ...
git add .
git commit -m "feat: add webhook endpoint"
git push origin feat/notification
# เปิด Pull Request → dev บน GitHub
```

---

## Schema กลาง

ดูรายละเอียดทั้งหมดได้ที่ [shared/schema.md](./shared/schema.md)

**Auth Header ที่ทุก Service ใช้**
```
Authorization: Bearer <api_key>
```

**Response Format**
```json
{ "data": ..., "meta": { "total": 0, "page": 1, "limit": 20 } }
{ "error": "message", "code": 400 }
```

**มาตรฐานข้อมูลกลาง**
- ชื่อ field ใช้ `camelCase` ทั้งระบบ
- วันเวลาใช้รูปแบบ `ISO 8601`
- Pagination มาตรฐาน: `page`, `limit`, `total`

---

## API ขั้นต่ำที่ต้องมี (MVP)

| Service | Endpoint ขั้นต่ำ |
|---------|------------------|
| service-auth | `POST /api/auth/register`, `POST /api/auth/login`, `POST /api/keys/verify`, `GET /api/keys`, `POST /api/keys`, `GET /api/usage-logs` |
| service-core | `GET /api/scholarships`, `GET /api/scholarships/:id`, `GET /api/scholarships/upcoming`, `POST /api/scholarships/batch` (internal) |
| service-notification | `GET /api/notifications`, `POST /api/notifications`, `PUT /api/notifications/:id`, `GET /api/notifications/logs`, `POST /api/internal/trigger` (internal) |
| service-analytics | `GET /api/analytics/overview`, `POST /api/match` |
| service-ingestion | `GET /api/admin/ingestion`, `POST /api/admin/ingestion/sync`, `GET /api/admin/ingestion/logs`, `POST /api/ingest` |
| service-landing | `GET /api/status` |

---

## Smoke Test (cURL)

> หลังจาก `docker-compose up` ให้ใช้ชุดคำสั่งนี้เช็กว่า cross-service ใช้งานได้

```bash
# 1) Health ทุก service
curl http://localhost:3000/api/health
curl http://localhost:3001/api/health
curl http://localhost:3002/api/health
curl http://localhost:3003/api/health
curl http://localhost:3004/api/health
curl http://localhost:3005/api/health

# 2) Landing aggregate status
curl http://localhost:3000/api/status

# 3) Register + Login (auth)
curl -X POST http://localhost:3001/api/auth/register -H "Content-Type: application/json" -d "{\"email\":\"demo@example.com\",\"password\":\"12345678\",\"firstName\":\"Demo\",\"lastName\":\"User\"}"
curl -X POST http://localhost:3001/api/auth/login -H "Content-Type: application/json" -d "{\"email\":\"demo@example.com\",\"password\":\"12345678\"}"

# 4) Verify API key (แทนค่า <API_KEY>)
curl -X POST http://localhost:3001/api/keys/verify -H "Content-Type: application/json" -d "{\"key\":\"<API_KEY>\"}"

# 5) Core endpoints (แทนค่า <API_KEY>)
curl "http://localhost:3003/api/scholarships?page=1&limit=10" -H "x-api-key: <API_KEY>"
curl "http://localhost:3003/api/scholarships/upcoming?page=1&limit=10&days=90" -H "x-api-key: <API_KEY>"

# 6) Analytics (ต้องเป็น Pro tier)
curl "http://localhost:3004/api/analytics/overview" -H "x-api-key: <API_KEY>"
curl -X POST http://localhost:3004/api/match -H "Content-Type: application/json" -H "x-api-key: <API_KEY>" -d "{\"level\":\"ปริญญาโท\",\"fields\":[\"IT\"],\"countries\":[\"Japan\"]}"

# 7) Internal trigger (ใช้ secret)
curl -X POST http://localhost:3005/api/internal/trigger -H "Content-Type: application/json" -H "X-Internal-Secret: internal-secret-key" -d "{\"newScholarships\":[{\"id\":\"sch_test_1\",\"name\":\"Test Scholarship\",\"level\":\"ปริญญาโท\",\"field\":\"IT\",\"country\":\"Japan\"}]}"
```

---

## Plan และ Rate Limit

| Plan | Limit | หมายเหตุ |
|------|-------|----------|
| Free | 1000 requests/day | ใช้ API Key ได้ตามโควตาพื้นฐาน |
| Pro | 10000 requests/day | ใช้ Analytics, Match และ Webhook URL |

เมื่อเกินโควตา ให้ตอบ `429 Too Many Requests`

---

## Definition of Done (ทุกหน้า)

ก่อนเปิด PR หน้าใดก็ตาม ต้องมีครบ
1. ทำงานได้ตาม route ที่รับผิดชอบ
2. มี `loading`, `empty`, `error`, `success` state
3. รองรับ mobile และ desktop
4. ผูก mock data หรือ API ได้จริง
5. แนบ screenshot หรือ short clip ใน PR

---

## กฎการทำงานร่วมกัน

1. Standup ทุกวัน 10 นาที — เมื่อวานทำอะไร / วันนี้จะทำอะไร / ติดปัญหาไหม
2. ติดปัญหา — ลองแก้เอง 30 นาที ถ้าไม่ได้โพสใน group chat เลย
3. แก้ `shared/schema.md` — แจ้งทีมก่อนเสมอ
4. ห้าม commit `.env` — ใช้ `.env.example` แทน
5. การเปลี่ยน API contract หรือ role access ต้องแจ้งทีมและได้ confirm ก่อน
