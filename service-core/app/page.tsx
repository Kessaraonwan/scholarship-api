import Link from "next/link"
import { GraduationCap, Award, Users, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-blue-50 to-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            ค้นหาทุนการศึกษา
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            รวบรวมทุนการศึกษาจากทั่วทุกมุมโลก ช่วยให้คุณค้นพบโอกาสทางการศึกษาที่ดีที่สุด
          </p>
          <Link href="/scholarships">
            <Button size="lg" className="text-lg px-8">
              ค้นหาทุนการศึกษา <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            <Card>
              <CardHeader>
                <GraduationCap className="h-10 w-10 text-blue-600 mb-2" />
                <CardTitle>ทุนการศึกษาหลากหลาย</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  รวบรวมทุนจากทั่วโลก ครอบคลุมทุกระดับการศึกษา
                </CardDescription>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <Award className="h-10 w-10 text-blue-600 mb-2" />
                <CardTitle>อัพเดทล่าสุด</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  ข้อมูลทุนการศึกษาอัพเดทอยู่เสมอ ไม่พลาด deadline
                </CardDescription>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <Users className="h-10 w-10 text-blue-600 mb-2" />
                <CardTitle>ค้นหาง่าย</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  กรองทุนตามเงื่อนไขที่ต้องการได้สะดวก
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  )
}