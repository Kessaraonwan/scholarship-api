# Service Landing - Landing Page & API Docs

หน้าแรกของระบบ + API Documentation + System Status Dashboard

> **Team Member**: ซี  
> **Port**: 3000  
> **Framework**: Next.js 14 + React 18 + TypeScript + Tailwind CSS

---

## 📄 Pages

### 1. **Landing Page** — `/`
หน้าแรกของทั้งระบบที่แนะนำ Product และแสดงแพลน
- ✨ Features showcase
- 💰 Pricing tiers (Free, Pro, Enterprise)
- 📚 Use cases สำหรับนักเรียน & Developers
- 🎯 Call-to-action buttons

### 2. **API Documentation** — `/docs`
เอกสาร API ที่สมบูรณ์ พร้อมตัวอย่าง
- 📝 All endpoints with methods
- 🔍 Search & filter by service
- 💻 Example requests & responses
- 🔐 Authentication & rate limiting info

### 3. **Quickstart Guide** — `/docs/quickstart`
Tutorial ใช้ API ครั้งแรกใน 5 ขั้นตอน
- ✍️ Sign up
- 🔑 Get API key
- 📤 Make first request (cURL, JS, Python)
- 📖 Parse response
- 🎯 Next steps

### 4. **System Status** — `/status`
Real-time monitoring ของทุก services
- 🔴🟢 Service health status
- ⏱️ Response times
- 📊 Uptime statistics
- 🔄 Auto-refresh every 10s

---

## 🚀 Getting Started

### Development

```bash
# 1. Install dependencies
npm install

# 2. Create .env.local
cp .env.example .env.local

# 3. Run development server
npm run dev

# 4. Open http://localhost:3000
```

### Production

```bash
# Build
npm run build

# Start
npm start
```

### Docker

```bash
# Build image
docker build -t service-landing .

# Run container
docker run -p 3000:3000 service-landing

# Or use docker-compose
docker-compose up service-landing
```

---

## 📁 Project Structure

```
src/
├── app/
│   ├── page.tsx                    # Landing page
│   ├── layout.tsx                  # Root layout
│   ├── globals.css                 # Global styles
│   ├── api/
│   │   └── health/route.ts         # Health check
│   ├── docs/
│   │   ├── page.tsx                # API docs
│   │   └── quickstart/page.tsx     # Quickstart
│   └── status/page.tsx             # Status page
├── components/
│   ├── Navbar.tsx                  # Navigation
│   └── Footer.tsx                  # Footer
└── lib/
    └── (utilities & helpers)
```

---

## 🔗 API Integration

### Health Check Endpoint

```bash
curl http://localhost:3000/api/health
```

Response:
```json
{
  "status": "healthy",
  "service": "service-landing",
  "timestamp": "2026-04-25T10:30:00Z",
  "version": "1.0.0"
}
```

### Status Page Health Checks

Status page ดึงข้อมูล health จาก:
- `http://localhost:3001/health` — Auth Service
- `http://localhost:3002/health` — Ingestion Service
- `http://localhost:3003/health` — Core Service
- `http://localhost:3004/health` — Analytics Service
- `http://localhost:3005/health` — Notification Service

---

## 🎨 Styling

- **Tailwind CSS**: Utility-first CSS framework
- **Lucide React**: Icon library
- **Custom styles**: `src/app/globals.css`

### Color Scheme

- **Primary**: `#3B82F6` (Blue)
- **Secondary**: `#1E293B` (Dark Slate)
- **Accent**: `#F59E0B` (Amber)

---

## 📦 Dependencies

```json
{
  "react": "^18.2.0",
  "next": "^14.0.0",
  "typescript": "^5.0.0",
  "tailwindcss": "^3.3.0",
  "lucide-react": "^0.263.0",
  "axios": "^1.6.0"
}
```

---

## 🔧 Scripts

```bash
npm run dev          # Start dev server
npm run build        # Build for production
npm start            # Start production server
npm run lint         # Run linter
npm run type-check   # TypeScript type checking
```

---

## 🌍 Environment Variables

```env
NEXT_PUBLIC_API_GATEWAY=http://localhost:3001
NEXT_PUBLIC_SERVICE_AUTH=http://localhost:3001
NEXT_PUBLIC_SERVICE_CORE=http://localhost:3003
NEXT_PUBLIC_SERVICE_ANALYTICS=http://localhost:3004
NEXT_PUBLIC_SERVICE_NOTIFICATION=http://localhost:3005
NEXT_PUBLIC_SERVICE_INGESTION=http://localhost:3002
```

---

## 🐛 Troubleshooting

### Port 3000 already in use

```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# macOS/Linux
lsof -i :3000
kill -9 <PID>
```

### Health check failures

Check if other services are running:
```bash
docker-compose ps
docker-compose logs
```

---

## 📝 Notes

- All pages are server-rendered by default
- Client components use `'use client'` directive
- API responses cached at build time where possible
- Status page polls `/health` every 10 seconds

---

## 🤝 Contributing

1. Create a branch: `git checkout -b feat/your-feature`
2. Commit changes: `git commit -m "feat: description"`
3. Push branch: `git push origin feat/your-feature`
4. Create pull request to `dev` branch

---

**Team**: ซี  
**Last Updated**: April 25, 2026
