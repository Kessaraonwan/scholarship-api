import Link from "next/link"
import { GraduationCap, Award, Users, ArrowRight, ShieldCheck, Zap, Globe } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section - ปรับเป็น Indigo Gradient และเพิ่มลูกเล่น */}
      <section className="relative bg-gradient-to-b from-indigo-50 via-white to-white py-24 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full opacity-10 pointer-events-none">
          <div className="absolute top-10 left-10 w-72 h-72 bg-indigo-400 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-purple-400 rounded-full blur-3xl" />
        </div>

        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-100 text-indigo-700 text-sm font-bold mb-6">
            <Zap className="w-4 h-4" />
            Powered by Scholarship API Gateway
          </div>
          
          <h1 className="text-5xl md:text-7xl font-extrabold text-slate-900 mb-6 tracking-tight">
            ค้นพบโอกาส <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">ทางการศึกษา</span> ไร้พรมแดน
          </h1>
          
          <p className="text-xl text-slate-600 mb-10 max-w-2xl mx-auto leading-relaxed">
            เชื่อมต่อข้อมูลทุนการศึกษาจากทั่วโลกผ่านระบบ API Gateway ที่รวดเร็ว ปลอดภัย 
            และแม่นยำที่สุดสำหรับนักศึกษาไทย
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/scholarships">
              <Button size="lg" className="text-lg px-10 h-14 bg-indigo-600 hover:bg-indigo-700 shadow-xl shadow-indigo-200 rounded-2xl transition-all hover:-translate-y-1">
                เริ่มค้นหาทุน <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <a href="http://localhost:3001">
              <Button size="lg" variant="outline" className="text-lg px-10 h-14 border-slate-200 hover:bg-slate-50 rounded-2xl transition-all">
                ขอ API Key
              </Button>
            </a>
          </div>
        </div>
      </section>

      {/* Features Section - ปรับ Card ให้สวยขึ้น */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900">ทำไมต้องใช้ Scholarship API?</h2>
            <p className="text-slate-500 mt-4">ระบบของเราออกแบบมาเพื่อประสิทธิภาพสูงสุดในทุกด้าน</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-none shadow-xl shadow-slate-200/50 rounded-[2rem] hover:shadow-indigo-500/10 transition-all group">
              <CardHeader className="pt-8 px-8">
                <div className="h-14 w-14 bg-indigo-50 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Globe className="h-8 w-8 text-indigo-600" />
                </div>
                <CardTitle className="text-xl font-bold">ทุนการศึกษาทั่วโลก</CardTitle>
              </CardHeader>
              <CardContent className="px-8 pb-8">
                <CardDescription className="text-base text-slate-600 leading-relaxed">
                  รวบรวมทุนจากทุกทวีป ครอบคลุมทุกสาขาวิชา 
                  ตั้งแต่ระดับมัธยมจนถึงปริญญาเอก ผ่านระบบ Ingestion อัตโนมัติ
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="border-none shadow-xl shadow-slate-200/50 rounded-[2rem] hover:shadow-indigo-500/10 transition-all group">
              <CardHeader className="pt-8 px-8">
                <div className="h-14 w-14 bg-rose-50 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Award className="h-8 w-8 text-rose-600" />
                </div>
                <CardTitle className="text-xl font-bold">ข้อมูล Real-time</CardTitle>
              </CardHeader>
              <CardContent className="px-8 pb-8">
                <CardDescription className="text-base text-slate-600 leading-relaxed">
                  เชื่อมต่อตรงกับฐานข้อมูลหลัก อัปเดตสถานะทุนทันทีที่การเปลี่ยนแปลง 
                  ทำให้คุณไม่พลาดวันปิดรับสมัครที่สำคัญ
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="border-none shadow-xl shadow-slate-200/50 rounded-[2rem] hover:shadow-indigo-500/10 transition-all group">
              <CardHeader className="pt-8 px-8">
                <div className="h-14 w-14 bg-emerald-50 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <ShieldCheck className="h-8 w-8 text-emerald-600" />
                </div>
                <CardTitle className="text-xl font-bold">ปลอดภัยด้วย API Key</CardTitle>
              </CardHeader>
              <CardContent className="px-8 pb-8">
                <CardDescription className="text-base text-slate-600 leading-relaxed">
                  ปกป้องข้อมูลและการใช้งานด้วยระบบ API Key ผ่าน Gateway 
                  จากหน้า Dashboard ส่วนตัวของคุณเอง
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Stats Mini Section (โชว์ความโปร) */}
      <section className="pb-24">
        <div className="container mx-auto px-4">
          <div className="bg-slate-900 rounded-[3rem] p-12 text-white flex flex-col md:flex-row justify-around items-center gap-8 text-center">
            <div>
              <p className="text-4xl font-bold text-indigo-400">1,000+</p>
              <p className="text-slate-400 mt-2">Scholarships Available</p>
            </div>
            <div className="w-px h-12 bg-slate-800 hidden md:block" />
            <div>
              <p className="text-4xl font-bold text-indigo-400">99.9%</p>
              <p className="text-slate-400 mt-2">API Uptime</p>
            </div>
            <div className="w-px h-12 bg-slate-800 hidden md:block" />
            <div>
              <p className="text-4xl font-bold text-indigo-400">50ms</p>
              <p className="text-slate-400 mt-2">Avg. Response Time</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}