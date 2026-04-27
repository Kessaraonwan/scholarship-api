# Development Guide 🚀

บทแนะนำสำหรับการพัฒนา Scholarship API ทั้งระบบ

---

## ✅ ความต้องการเบื้องต้น

- **Node.js**: v18 หรือสูงกว่า ([ดาวน์โหลด](https://nodejs.org/))
- **Docker & Docker Compose**: สำหรับรัน Services ทั้งหมดพร้อมกัน
- **Git**: สำหรับ Version Control

---

## 🏃 เริ่มต้นอย่างรวดเร็ว

### วิธีที่ 1: รัน Services ทั้งหมด (แนะนำ)

```bash
# 1. Clone repository
git clone https://github.com/your-org/scholarship-api.git
cd scholarship-api

# 2. รัน docker-compose (ตัวแรกจะใช้เวลาหน่อย)
docker-compose up

# 3. เข้าเว็บไซต์
# Landing Page: http://localhost:3000
# API Docs:     http://localhost:3000/docs
# Status:       http://localhost:3000/status
```

### วิธีที่ 2: รัน Service เดียว (สำหรับการพัฒนา)

```bash
# เช่น การพัฒนา service-landing
cd service-landing

# ติดตั้ง dependencies
npm install

# รัน development server
npm run dev

# เข้าที่ http://localhost:3000
```

---

## 📚 Pages ของ Service Landing

### 1. **Landing Page** — `/`
หน้าแรกของทั้งระบบ แสดง:
- ✨ Features ของ API
- 💰 Pricing Tiers (Free, Pro, Enterprise)
- 📚 Use Cases สำหรับนักเรียนและ Developers
- CTA (Call To Action) เชื่อมไปยัง Sign Up

**Files**: [`src/app/page.tsx`](./src/app/page.tsx)

### 2. **API Documentation** — `/docs`
เอกสารครบถ้วนของทุก API Endpoint:
- 📝 List ของทุก endpoint พร้อม method (GET, POST, etc.)
- 🔍 ค้นหา endpoint โดยชื่อ
- 🏷️ Filter by service
- 📤 Response example สำหรับแต่ละ endpoint
- 🔐 Authentication & Rate Limiting info

**Features**:
- Click เพื่อดูรายละเอียด
- Collapsible section แสดง JSON response
- Search functionality
- Service filter

**Files**: [`src/app/docs/page.tsx`](./src/app/docs/page.tsx)

### 3. **Quickstart Guide** — `/docs/quickstart`
Tutorial ใช้ API ครั้งแรกใน 5 ขั้นตอน:
1. ✍️ สมัครสมาชิก
2. 🔑 Get API Key
3. 📤 Make First Request (cURL, JavaScript, Python)
4. 📖 Parse Response
5. 🎯 Next Steps

**Files**: [`src/app/docs/quickstart/page.tsx`](./src/app/docs/quickstart/page.tsx)

### 4. **System Status Page** — `/status`
Monitor สถานะของทุก Service ในแบบ Real-time:
- 🔴🟢 Status indicator (Green/Red)
- ⏱️ Response time สำหรับแต่ละ service
- 📊 Uptime statistics
- 📞 Service description และ owner
- 🔄 Auto-refresh ทุก 10 วินาที

**Features**:
- Polling every 10 seconds
- Health check จากแต่ละ service's `/health` endpoint
- Visual status badges
- Service details

**Files**: [`src/app/status/page.tsx`](./src/app/status/page.tsx)

---

## 🏗️ Architecture

### Services Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                      CLIENT (Browser)                            │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│ SERVICE-LANDING (Port 3000) - Landing Page, Docs, Status       │
│ ├─ Pages: /, /docs, /docs/quickstart, /status                 │
│ ├─ API: /api/health                                            │
│ └─ Components: Navbar, Footer, Status Dashboard               │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌──────────────────────────────────────────────────────────────────┐
│                    API GATEWAY LAYER                             │
├────────────────┬────────────────┬──────────────┬─────────────────┤
│ AUTH SERVICE   │ CORE SERVICE   │ ANALYTICS    │ NOTIFICATION   │
│ (Port 3001)    │ (Port 3003)    │ (Port 3004)  │ (Port 3005)    │
├────────────────┼────────────────┼──────────────┼─────────────────┤
│ • Login        │ • Search       │ • Dashboard  │ • Webhooks     │
│ • Register     │ • Filter       │ • Matching   │ • Email        │
│ • API Keys     │ • Details      │ • Analytics  │ • SMS          │
│ • Usage        │ • Upcoming     │              │                │
└────────────────┴────────────────┴──────────────┴─────────────────┘
                              ↓
┌──────────────────────────────────────────────────────────────────┐
│                   INFRASTRUCTURE                                 │
├──────────────────────────┬──────────────────────┬────────────────┤
│ PostgreSQL Database      │ Redis Cache          │ File Storage   │
│ (Port 5432)             │ (Port 6379)          │                │
└──────────────────────────┴──────────────────────┴────────────────┘
```

### Component Structure (service-landing)

```
src/
├── app/
│   ├── page.tsx                    # Landing page (/)
│   ├── layout.tsx                  # Root layout
│   ├── globals.css                 # Global styles
│   ├── api/
│   │   └── health/
│   │       └── route.ts            # Health check endpoint
│   ├── docs/
│   │   ├── page.tsx                # API Docs (/docs)
│   │   └── quickstart/
│   │       └── page.tsx            # Quickstart (/docs/quickstart)
│   └── status/
│       └── page.tsx                # Status page (/status)
├── components/
│   ├── Navbar.tsx                  # Navigation bar
│   └── Footer.tsx                  # Footer
└── lib/
    └── (API helpers, constants, etc.)
```

---

## 🐳 Docker & Docker Compose

### Build Images

```bash
# Build ทั้งหมด
docker-compose build

# Build เฉพาะ service
docker-compose build service-landing
docker-compose build service-auth
```

### Run Services

```bash
# Run ทั้งหมด (detached mode)
docker-compose up -d

# View logs
docker-compose logs -f service-landing
docker-compose logs -f service-auth

# Stop services
docker-compose down

# Remove volumes (รีเซ็ต database)
docker-compose down -v
```

### Health Checks

ทุก service มี `/health` endpoint สำหรับ monitoring:

```bash
curl http://localhost:3000/health
curl http://localhost:3001/health
curl http://localhost:3003/health
```

---

## 🚀 CI/CD Pipeline

GitHub Actions workflow ทำงานอัตโนมัติเมื่อ:
- Push ไปยัง `main` หรือ `develop` branch
- Pull Request

### Workflow Steps

1. **Lint & Test**
   - ติดตั้ง dependencies
   - รัน linter (ESLint, TypeScript)
   - รัน unit tests

2. **Docker Build**
   - Build Docker images สำหรับทุก service
   - Push ไปยัง GitHub Container Registry

3. **Integration Test** (เฉพาะ main branch)
   - Start docker-compose
   - Wait for health checks
   - รัน integration tests

4. **Deploy** (เฉพาะ main branch)
   - Push images ไปยัง production registry
   - Deploy ไปยัง production environment

### View Workflow Status

```bash
# ดู workflow runs
gh run list

# ดู logs ของ specific run
gh run view <RUN_ID> --log
```

---

## 🔧 Configuration

### Environment Variables

#### service-landing

```env
NEXT_PUBLIC_API_GATEWAY=http://localhost:3001
NEXT_PUBLIC_SERVICE_AUTH=http://localhost:3001
NEXT_PUBLIC_SERVICE_CORE=http://localhost:3003
NEXT_PUBLIC_SERVICE_ANALYTICS=http://localhost:3004
NEXT_PUBLIC_SERVICE_NOTIFICATION=http://localhost:3005
NEXT_PUBLIC_SERVICE_INGESTION=http://localhost:3002
```

#### docker-compose

```env
NODE_ENV=development
DATABASE_URL=postgresql://postgres:postgres@postgres:5432/scholarship_db
REDIS_URL=redis://redis:6379
JWT_SECRET=your-secret-key
INTERNAL_SECRET=internal-secret-key
```

---

## 📊 API Status Monitoring

Status page ดึงข้อมูล health จาก:

```
GET http://localhost:3000/health   → Landing
GET http://localhost:3001/health   → Auth
GET http://localhost:3002/health   → Ingestion
GET http://localhost:3003/health   → Core
GET http://localhost:3004/health   → Analytics
GET http://localhost:3005/health   → Notification
```

Response format:

```json
{
  "status": "healthy",
  "service": "service-landing",
  "timestamp": "2026-04-25T10:30:00Z",
  "version": "1.0.0"
}
```

---

## 🐛 Troubleshooting

### Problem: Port Already in Use

```bash
# Find process using port
lsof -i :3000

# Kill process
kill -9 <PID>

# Or change port in docker-compose.yml
```

### Problem: Database Connection Error

```bash
# Check PostgreSQL is running
docker-compose ps postgres

# Restart database
docker-compose restart postgres

# Check logs
docker-compose logs postgres
```

### Problem: Services Not Starting

```bash
# Check all services
docker-compose ps

# View logs
docker-compose logs

# Rebuild and start
docker-compose down
docker-compose up --build
```

---

## 📚 Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Docker Documentation](https://docs.docker.com/)
- [GitHub Actions Docs](https://docs.github.com/en/actions)
- [Tailwind CSS](https://tailwindcss.com/docs)

---

## 🤝 Contributing

ดูรายละเอียดที่ [CONTRIBUTING.md](./CONTRIBUTING.md)

```bash
# ลำดับการพัฒนา
1. สร้าง branch: git checkout -b feat/your-feature
2. ทำการเปลี่ยนแปลง
3. Commit: git commit -m "feat: describe change"
4. Push: git push origin feat/your-feature
5. Open Pull Request ไปยัง `dev` branch
```

---

## 📞 Support

ติดต่อ: support@scholarship-api.com

---

**Last Updated**: April 25, 2026
**Maintained by**: Team ซี
