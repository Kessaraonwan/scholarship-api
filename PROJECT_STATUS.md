# Project Status - Scholarship API

Last updated: 2026-04-29 (night pass)
Scope update: cross-service integration + frontend visual consistency pass

---

## 1) ภาพรวมโปรเจค

`scholarship-api` คือระบบข้อมูลทุนแบบแยกบริการ (microservices) มี 6 services หลัก:

- `service-landing` (3000): landing/docs/status dashboard
- `service-auth` (3001): register/login/API key/usage/verify
- `service-ingestion` (3002): ดึงข้อมูลและ sync ไป core
- `service-core` (3003): API หลัก scholarships list/detail/upcoming
- `service-analytics` (3004): overview + matching (Pro-gated)
- `service-notification` (3005): rules/webhooks/logs/trigger

DB หลักคือ PostgreSQL และใช้ Redis ในบางบริการตามเดิม

---

## 2) สถานะรวมตอนนี้

### สถานะความพร้อม

- **Code integration:** DONE (เชื่อมข้าม service ตาม flow หลักครบ)
- **Frontend consistency:** DONE ระดับ MVP ส่งงาน (Guest/Free/Pro/Admin theme ใกล้เคียงกันแล้ว)
- **Real data on frontend:** DONE ในหน้าหลักของแต่ละ role (ไม่มี mock สำคัญค้างใน flow หลักแล้ว)
- **Runtime verification บนเครื่องจริง:** PENDING (ต้องรัน Docker + smoke test จริง)

### สรุปพร้อมส่ง

- **พร้อมส่งเชิงโค้ด:** YES
- **พร้อมส่งเชิงหลักฐานการรันจริง:** PENDING 1 รอบสุดท้าย

---

## 3) สิ่งที่แก้เพิ่มในรอบคุยล่าสุด (รอบนี้)

### Frontend

- ปิด mock ฝั่ง `service-notification` dashboard ให้เป็น API จริงทั้งหมด:
  - `app/dashboard/notifications/page.tsx`
  - `app/dashboard/notifications/logs/page.tsx`
  - `app/dashboard/webhooks/page.tsx`
- ปรับหน้า `service-auth`:
  - `app/dashboard/keys/page.tsx` ให้ visual tone ไปทางเดียวกับระบบ
- ปรับหน้า Admin ของ `service-ingestion` จาก inline styles เป็น Tailwind + card layout:
  - `app/admin/ingestion/page.tsx`
  - `app/components/ingestion/Navbar.tsx`
  - `app/components/ingestion/StatCards.tsx`
  - `app/components/ingestion/AutoRefresh.tsx`
  - `app/components/ingestion/LogTable.tsx`

### Backend/API support

- เพิ่ม endpoint ที่ขาดเพื่อรองรับ FE ใหม่:
  - `service-notification/app/api/webhooks/[id]/route.ts`
  - เพิ่ม `PATCH /api/webhooks/:id` (toggle/update webhook)

---

## 4) สถานะแยกตาม Service

### `service-landing`

- **BE:** พร้อมใช้งาน (`/api/health`, `/api/status`)
- **FE:** หน้า docs/quickstart/status ใช้งานได้
- **เหลือ:** optional polish UX

### `service-auth`

- **BE:** auth + key verify flow ใช้งานได้
- **FE:** login/register/dashboard/keys/usage ใช้ข้อมูลจริงใน flow หลัก
- **เหลือ:** ผูก plan/tier กับ billing จริงแทน mapping ชั่วคราว

### `service-core`

- **BE:** scholarships list/detail/upcoming + batch internal พร้อม
- **FE:** scholarships pages ใช้ข้อมูลจริงแล้ว
- **เหลือ:** hardening validation/observability เพิ่มเติม (ไม่บล็อก release MVP)

### `service-ingestion`

- **BE:** sync pipeline ไป core ทำงานตาม flow
- **FE:** admin ingestion หน้าเดียว style consistency pass เสร็จ
- **เหลือ:** retry/dead-letter policy ระดับ production

### `service-notification`

- **BE:** DB-backed rules/webhooks/logs + internal trigger + webhook delivery พร้อม
- **FE:** dashboard notifications/logs/webhooks ใช้ API จริงครบ
- **เหลือ:** SMTP email delivery จริง และ migration run บน env จริง

### `service-analytics`

- **BE:** overview + match + pro gating พร้อม
- **FE:** analytics/match pages ใช้ real API แล้ว
- **เหลือ:** tuning logic ความแม่น matching (non-blocking)

### `shared`

- **เอกสาร schema/contract:** ใช้งานได้
- **เหลือ:** sync เอกสารกับ implementation ต่อเนื่อง

---

## 5) สรุปงานคงค้างแยก BE / FE / DB + เจ้าของงาน

## BE (Backend) เหลืออะไร

- ผูก tier/plan จาก billing จริงใน `service-auth` (Owner: BE/Auth)
- เพิ่ม retry policy สำหรับ ingestion push fail (Owner: BE/Ingestion)
- เพิ่ม observability/log correlation ใน `core` และ `notification` (Owner: BE/Platform)

## FE (Frontend) เหลืออะไร

- Optional polish:
  - micro-copy ภาษาไทย/อังกฤษให้คงที่ทุกบริการ
  - responsive fine-tune บางจอเล็ก
  - loading/empty/error states ให้มี pattern เดียว 100%
  (Owner: FE)

## DB / Infra เหลืออะไร

- รัน Prisma migration + generate สำหรับ `service-notification` บนเครื่องทีม
- ยืนยัน PostgreSQL/Redis ผ่าน Docker Compose ทุกคนในทีม
- เก็บหลักฐาน smoke test pass/fail
  (Owner: DevOps/BE ร่วมกัน)

---

## 6) Blockers ก่อนประกาศ “พร้อมส่ง 100%”

1. รัน `docker compose up -d --build` สำเร็จบนเครื่องจริง
2. รัน migration ของ `service-notification` สำเร็จ
3. smoke test ตาม `README.md` ผ่านครบทุกข้อ
4. capture ผลลัพธ์ไว้ในเอกสาร/PR comment

---

## 7) Definition of Done (รอบส่งทีม)

- [ ] ทุก service health ผ่าน (`GET /api/health`)
- [ ] `service-landing /api/status` เห็นครบทุก service
- [ ] Auth flow (register/login/verify) ผ่าน
- [ ] Core list/detail/upcoming ผ่าน
- [ ] Ingestion sync -> Core batch ผ่าน
- [ ] Core -> Notification trigger/log/webhook ผ่าน
- [ ] Analytics overview/match (Pro) ผ่าน
- [ ] Frontend role pages แสดงข้อมูลจริงครบ
- [ ] แนบหลักฐาน smoke test เรียบร้อย

---

## 8) ข้อเสนอการส่งมอบ

เมื่อ checklist ผ่านครบ ให้ประกาศสถานะ:

- `Release Candidate (RC1)` สำหรับ UAT
- หาก UAT ผ่าน ค่อย promote production

