"use client"

import { useState, useEffect, useCallback } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Calendar, MapPin, GraduationCap, Briefcase, Key, RefreshCw, BarChart3, Bell } from "lucide-react"
import { type Scholarship } from "@/lib/scholarships-data"

const levels = ["ทุกระดับ", "มัธยม", "ปริญญาตรี", "ปริญญาโท", "ปริญญาเอก"]
const fields = ["ทุกสาขา", "IT", "วิทยาศาสตร์", "เศรษฐศาสตร์"]
const countries = ["ทุกประเทศ", "ไทย", "UK", "US", "Japan", "Germany"]

// ... (ScholarshipCard และ ScholarshipSkeleton เหมือนเดิม)
function ScholarshipCard({ scholarship }: { scholarship: Scholarship }) {
  // 🛡️ กันพัง: เช็คก่อนว่ามี deadline ไหม ถ้าไม่มีให้เป็น 0
  const daysUntilDeadline = scholarship.deadline
    ? Math.ceil((new Date(scholarship.deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
    : null;

  return (
    <a href={`http://localhost:3003/scholarships/${scholarship.id}`} target="_blank" rel="noopener noreferrer">
      <Card className="h-full transition-shadow hover:shadow-lg">
        <CardHeader>
          <div className="flex items-start justify-between">
            <CardTitle className="text-lg text-foreground">{scholarship.name || "ไม่มีชื่อทุน"}</CardTitle>
            {daysUntilDeadline !== null && daysUntilDeadline <= 30 && daysUntilDeadline > 0 && (
              <Badge className={daysUntilDeadline <= 7 ? "bg-red-500 text-white" : "bg-orange-500 text-white"}>
                {daysUntilDeadline} วัน
              </Badge>
            )}
          </div>
          <CardDescription className="line-clamp-2">{scholarship.description || "ไม่มีรายละเอียด"}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary" className="flex items-center gap-1"><GraduationCap className="h-3 w-3" />{scholarship.level || "ไม่ระบุ"}</Badge>
            <Badge variant="secondary" className="flex items-center gap-1"><Briefcase className="h-3 w-3" />{scholarship.field || "ไม่ระบุ"}</Badge>
            <Badge variant="secondary" className="flex items-center gap-1"><MapPin className="h-3 w-3" />{scholarship.country || "ไม่ระบุ"}</Badge>
          </div>
          <div className="mt-4 flex items-center justify-between text-sm">
            <div className="flex items-center gap-1 text-muted-foreground">
              <Calendar className="h-4 w-4" />
              {/* 🛡️ กันพัง: ถ้าไม่มีวันหมดเขตให้โชว์ว่า "ไม่ระบุ" */}
              <span>หมดเขต: {scholarship.deadline ? new Date(scholarship.deadline).toLocaleDateString('th-TH') : "ไม่ระบุ"}</span>
            </div>
            {scholarship.amount && (
              <span className="font-medium text-primary">
                {Number(scholarship.amount).toLocaleString()} {scholarship.currency || "THB"}
              </span>
            )}
          </div>
        </CardContent>
      </Card>
    </a> 
  )
}

function ScholarshipSkeleton() {
  return (
    <Card className="h-full">
      <CardHeader><div className="h-6 w-3/4 animate-pulse rounded bg-muted" /><div className="mt-2 h-4 w-full animate-pulse rounded bg-muted" /></CardHeader>
      <CardContent><div className="flex gap-2"><div className="h-6 w-20 animate-pulse rounded bg-muted" /><div className="h-6 w-16 animate-pulse rounded bg-muted" /><div className="h-6 w-16 animate-pulse rounded bg-muted" /></div><div className="mt-4 flex justify-between"><div className="h-4 w-32 animate-pulse rounded bg-muted" /><div className="h-4 w-20 animate-pulse rounded bg-muted" /></div></CardContent>
    </Card>
  )
}

export default function ScholarshipsPage() {
  const [search, setSearch] = useState("")
  const [level, setLevel] = useState("ทุกระดับ")
  const [field, setField] = useState("ทุกสาขา")
  const [country, setCountry] = useState("ทุกประเทศ")
  const [isLoading, setIsLoading] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 6

  const [apiKey, setApiKey] = useState("")
  const [scholarships, setScholarships] = useState<Scholarship[]>([])
  const [totalPages, setTotalPages] = useState(1)

  // 1. โหลดคีย์จากเครื่อง
  //useEffect(() => {
  //  const savedKey = localStorage.getItem("user_api_key")
  //  if (savedKey) setApiKey(savedKey)
  //}, [])

  // 2. ฟังก์ชันดึงข้อมูล (แยกออกมาเพื่อเรียกใช้ซ้ำได้)
  const fetchScholarships = useCallback(async () => {
    if (!apiKey) return; // 🛑 ถ้าไม่มีคีย์ ไม่ต้องยิงให้เปลืองแรงและ Error

    setIsLoading(true)
    const params = new URLSearchParams();

    if (search) params.append("keyword", search);

    // 🛡️ ถ้าเลือก "ทุกระดับ" ไม่ต้องส่งค่าไป ให้หลังบ้านดึงมาทั้งหมด
    if (level !== "ทุกระดับ") params.append("level", level);
    if (field !== "ทุกสาขา") params.append("field", field);
    if (country !== "ทุกประเทศ") params.append("country", country);

    params.append("page", String(currentPage));
    params.append("limit", String(itemsPerPage));

    try {
      const response = await fetch(`/api/scholarships?${params.toString()}`, {
        method: 'GET',
        headers: {
          // ✅ ส่งแค่ API Key อย่างเดียว ป้องกันภาษาไทยหลุดเข้า Header
          "x-api-key": apiKey.trim()
        }
      })

      const data = await response.json()

      if (response.ok) {
        setScholarships(data.data || [])
        setTotalPages(data.pagination?.totalPages || 1)
      } else {
        console.error("API Error:", data.error)
        setScholarships([])
      }
    } catch (error) {
      console.error("Fetch Failed:", error)
      setScholarships([])
    } finally {
      setIsLoading(false)
    }
  }, [search, level, field, country, currentPage, apiKey])

  // 3. รัน Fetch เมื่อค่าเปลี่ยน
  useEffect(() => {
    fetchScholarships()
  }, [fetchScholarships])

  const handleKeyChange = (newKey: string) => {
    const cleanKey = newKey.trim()
    setApiKey(cleanKey)
    localStorage.setItem("user_api_key", cleanKey)
    setCurrentPage(1)
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">

      {/* 🔑 API Key Gateway */}
      <div className="mb-10 p-6 border-2 border-indigo-200 rounded-2xl bg-white shadow-sm ring-1 ring-indigo-50">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-indigo-600 rounded-lg shadow-md"><Key className="h-5 w-5 text-white" /></div>
          <div>
            <h2 className="text-lg font-bold text-gray-900">API Gateway Authentication</h2>
            <p className="text-sm text-gray-500">ใส่ API Key เพื่อดึงข้อมูล</p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <Input
            placeholder="ใส่ API Key ของคุณที่นี่..."
            value={apiKey}
            onChange={(e) => handleKeyChange(e.target.value)}
            className="flex-1 h-12 font-mono border-gray-300 focus:ring-indigo-500"
          />
          <Button
            onClick={fetchScholarships}
            disabled={isLoading || !apiKey}
            className="h-12 px-8 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold"
          >
            {isLoading ? <RefreshCw className="mr-2 h-4 w-4 animate-spin" /> : null}
            ดึงข้อมูลใหม่
          </Button>
        </div>

        {!apiKey && <p className="mt-3 text-xs text-amber-600 font-medium animate-bounce">⚠️ กรุณาใส่ API Key ก่อนเริ่มค้นหา</p>}
      </div>

      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">ค้นหาทุนการศึกษา</h1>
        <p className="mt-2 text-muted-foreground">ระบบกำลังเรียกข้อมูลจากฐานข้อมูลผ่าน API Gateway</p>
      </div>

      {/* Search & Filters */}
      <div className="mb-8 space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="ค้นหาชื่อทุน..." value={search} onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }} className="pl-10 h-11" />
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <Select value={level} onValueChange={(v) => { setLevel(v); setCurrentPage(1); }}>
            <SelectTrigger className="h-11"><SelectValue placeholder="ระดับการศึกษา" /></SelectTrigger>
            <SelectContent>{levels.map((l) => (<SelectItem key={l} value={l}>{l}</SelectItem>))}</SelectContent>
          </Select>

          <Select value={field} onValueChange={(v) => { setField(v); setCurrentPage(1); }}>
            <SelectTrigger className="h-11"><SelectValue placeholder="สาขาวิชา" /></SelectTrigger>
            <SelectContent>{fields.map((f) => (<SelectItem key={f} value={f}>{f}</SelectItem>))}</SelectContent>
          </Select>

          <Select value={country} onValueChange={(v) => { setCountry(v); setCurrentPage(1); }}>
            <SelectTrigger className="h-11"><SelectValue placeholder="ประเทศ" /></SelectTrigger>
            <SelectContent>{countries.map((c) => (<SelectItem key={c} value={c}>{c}</SelectItem>))}</SelectContent>
          </Select>
        </div>
      </div>

      {/* Results */}
      {isLoading ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (<ScholarshipSkeleton key={i} />))}
        </div>
      ) : !apiKey ? (
        <div className="rounded-lg border border-dashed border-gray-300 py-20 text-center bg-gray-50">
          <Key className="mx-auto h-12 w-12 text-gray-300 mb-4" />
          <p className="text-gray-500">รอการระบุ API Key เพื่อเชื่อมต่อระบบ...</p>
        </div>
      ) : scholarships.length === 0 ? (
        <div className="rounded-lg border border-border bg-card py-20 text-center shadow-inner">
          <GraduationCap className="mx-auto h-12 w-12 text-muted-foreground/30 mb-4" />
          <p className="text-lg font-medium">ไม่พบข้อมูล</p>
          <p className="mt-2 text-muted-foreground">ลองกดปุ่ม "ดึงข้อมูลใหม่" หรือเช็ค API Key อีกครั้ง</p>
        </div>
      ) : (
        <>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {scholarships.map((s) => <ScholarshipCard key={s.id} scholarship={s} />)}
          </div>
          {totalPages > 1 && (
            <div className="mt-12 flex items-center justify-center gap-4">
              <Button variant="outline" size="sm" onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1}>ก่อนหน้า</Button>
              <span className="text-sm font-medium">หน้า {currentPage} จาก {totalPages}</span>
              <Button variant="outline" size="sm" onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}>ถัดไป</Button>
            </div>
          )}

          {/* Next Steps CTA Section */}
          <div className="mt-16 p-10 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl border border-indigo-100 shadow-lg">
            <h2 className="text-2xl font-bold text-slate-900 mb-2">📌 ขั้นตอนถัดไป</h2>
            <p className="text-slate-600 mb-8">เพิ่มเติมคุณสมบัติให้กับแอปของคุณ</p>
            
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {/* CTA 1: View Analytics */}
              <a 
                href="http://localhost:3004/analytics" 
                target="_blank" 
                rel="noopener noreferrer"
                className="p-6 bg-white rounded-xl border border-slate-200 hover:border-indigo-300 hover:shadow-md transition-all group"
              >
                <BarChart3 className="h-8 w-8 text-indigo-600 mb-3 group-hover:scale-110 transition-transform" />
                <h3 className="font-semibold text-slate-900 mb-1">View Analytics</h3>
                <p className="text-sm text-slate-500 mb-3">วิเคราะห์แนวโน้มและคู่เทพทุนที่เหมาะสม</p>
                <span className="text-xs font-medium text-indigo-600">→ ไป Analytics</span>
              </a>

              {/* CTA 2: Setup Webhooks */}
              <a 
                href="http://localhost:3005/dashboard/webhooks" 
                target="_blank" 
                rel="noopener noreferrer"
                className="p-6 bg-white rounded-xl border border-slate-200 hover:border-purple-300 hover:shadow-md transition-all group"
              >
                <Bell className="h-8 w-8 text-purple-600 mb-3 group-hover:scale-110 transition-transform" />
                <h3 className="font-semibold text-slate-900 mb-1">Setup Webhooks</h3>
                <p className="text-sm text-slate-500 mb-3">รับแจ้งเตือนเมื่อมีทุนใหม่ (Pro only)</p>
                <span className="text-xs font-medium text-purple-600">→ ไป Webhooks</span>
              </a>

              {/* CTA 3: Manage API Keys */}
              <a 
                href="http://localhost:3001/dashboard/keys" 
                target="_blank" 
                rel="noopener noreferrer"
                className="p-6 bg-white rounded-xl border border-slate-200 hover:border-amber-300 hover:shadow-md transition-all group"
              >
                <Key className="h-8 w-8 text-amber-600 mb-3 group-hover:scale-110 transition-transform" />
                <h3 className="font-semibold text-slate-900 mb-1">Manage API Keys</h3>
                <p className="text-sm text-slate-500 mb-3">สร้าง ดู และลบ API Keys ของคุณ</p>
                <span className="text-xs font-medium text-amber-600">→ ไป Dashboard</span>
              </a>

              {/* CTA 4: Upgrade to Pro */}
              <a 
                href="http://localhost:3005/dashboard/billing" 
                target="_blank" 
                rel="noopener noreferrer"
                className="p-6 bg-white rounded-xl border border-slate-200 hover:border-rose-300 hover:shadow-md transition-all group"
              >
                <Briefcase className="h-8 w-8 text-rose-600 mb-3 group-hover:scale-110 transition-transform" />
                <h3 className="font-semibold text-slate-900 mb-1">Upgrade to Pro</h3>
                <p className="text-sm text-slate-500 mb-3">ปลดล็อก Webhooks และ Analytics</p>
                <span className="text-xs font-medium text-rose-600">→ ไป Billing</span>
              </a>
            </div>
          </div>
        </>
      )}
    </div>
  )
}