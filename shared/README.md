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

## เริ่มต้นใช้งาน (ทำครั้งเดียวหลัง clone)

```bash
# 1. Clone repo
git clone https://github.com/ทีม/scholarship-api.git
cd scholarship-api

# 2. รัน setup script ระบุชื่อ service ของตัวเอง
bash setup.sh notification   # เปลี่ยนเป็นชื่อ service ของตัวเอง

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

---

## กฎการทำงานร่วมกัน

1. Standup ทุกวัน 10 นาที — เมื่อวานทำอะไร / วันนี้จะทำอะไร / ติดปัญหาไหม
2. ติดปัญหา — ลองแก้เอง 30 นาที ถ้าไม่ได้โพสใน group chat เลย
3. แก้ `shared/schema.md` — แจ้งทีมก่อนเสมอ
4. ห้าม commit `.env` — ใช้ `.env.example` แทน
