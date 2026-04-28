# Cross-Service Integration Status Report
**Date:** April 29, 2026

---

## Service Health Endpoints

ทุก service มี `GET /api/health` แล้ว:

- `service-landing` → `http://localhost:3000/api/health`
- `service-auth` → `http://localhost:3001/api/health`
- `service-ingestion` → `http://localhost:3002/api/health`
- `service-core` → `http://localhost:3003/api/health`
- `service-analytics` → `http://localhost:3004/api/health`
- `service-notification` → `http://localhost:3005/api/health`

และ `service-landing` มี `GET /api/status` สำหรับ aggregate health จากทุก service

---

## Cross-Service Data Flow

### 1) API key verification
- `service-core` และ `service-analytics` เรียก `POST service-auth /api/keys/verify`
- ใช้มาตรฐานเดียวกันทั้งระบบในการตรวจ key

### 2) Ingestion → Core
- `service-ingestion` sync ข้อมูลแล้วเรียก `POST service-core /api/scholarships/batch`
- ใช้ header `X-Internal-Secret` เพื่อยืนยัน internal request

### 3) Core → Notification
- `service-core` สร้าง/อัปเดตทุนแบบ batch แล้ว trigger `POST service-notification /api/internal/trigger`
- ฝั่ง notification ตรวจ `X-Internal-Secret` ก่อนทำงาน

### 4) Notification delivery
- `service-notification` บันทึก rules/webhooks/logs ลง DB (Prisma)
- trigger endpoint ส่ง webhook HTTP จริงตามรายการ webhook ที่ active

---

## API Coverage (Current)

- `service-auth`: register/login, keys, key verify, usage logs, health
- `service-core`: scholarships list/detail/upcoming, scholarships batch (internal), health
- `service-ingestion`: ingest, admin ingestion/sync/logs, health
- `service-notification`: notifications CRUD, webhooks CRUD, logs, internal trigger, health
- `service-analytics`: analytics overview, match, health
- `service-landing`: health, status

---

## Remaining Gaps

- Notification channel `email` ยังเป็น placeholder (log ลง DB แต่ยังไม่ส่ง SMTP จริง)
- Pro tier ยังผูกกับ role ใน auth แบบง่าย (`admin -> pro`) เพื่อ unblock integration; billing tiers ยังต้องแยกจริง
- ควรเพิ่ม integration tests อัตโนมัติใน CI (ตอนนี้มี smoke test commands ใน README)

