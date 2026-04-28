import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, MapPin, GraduationCap, Briefcase } from "lucide-react"
import { prisma } from "@/lib/prisma"

function getDaysRemaining(deadline: string): number {
  return Math.ceil(
    (new Date(deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
  )
}

function getDeadlineBadgeColor(days: number): string {
  if (days <= 7) return "bg-red-500 text-white hover:bg-red-500"
  if (days <= 30) return "bg-orange-500 text-white hover:bg-orange-500"
  return "bg-green-500 text-white hover:bg-green-500"
}

export default async function UpcomingScholarshipsPage() {
  const today = new Date()
  const within90Days = new Date(today.getTime() + 90 * 24 * 60 * 60 * 1000)
  const upcomingScholarships = await prisma.scholarship.findMany({
    where: {
      deadline: {
        gte: today,
        lte: within90Days,
      },
    },
    orderBy: {
      deadline: "asc",
    },
  })

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          ทุนที่กำลังจะหมดเขต
        </h1>
        <p className="mt-2 text-muted-foreground">
          ทุนการศึกษาที่ใกล้หมดเขตรับสมัคร เรียงตามวันหมดเขต
        </p>
      </div>

      {upcomingScholarships.length === 0 ? (
        <div className="rounded-lg border border-border bg-card py-16 text-center">
          <p className="text-lg font-medium text-foreground">ไม่พบทุนที่กำลังจะหมดเขต</p>
          <p className="mt-2 text-muted-foreground">กรุณาตรวจสอบอีกครั้งในภายหลัง</p>
        </div>
      ) : (
        <div className="space-y-4">
          {upcomingScholarships.map((scholarship) => {
            const deadlineValue = scholarship.deadline ? scholarship.deadline.toISOString() : today.toISOString()
            const daysRemaining = getDaysRemaining(deadlineValue)
            return (
              <Link key={scholarship.id} href={`/scholarships/${scholarship.id}`}>
                <Card className="transition-shadow hover:shadow-lg">
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between">
                      <CardTitle className="text-lg text-foreground">
                        {scholarship.name}
                      </CardTitle>
                      <Badge className={getDeadlineBadgeColor(daysRemaining)}>
                        {daysRemaining <= 0 ? "หมดเขตแล้ว" : `${daysRemaining} วัน`}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap items-center gap-4 text-sm">
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <GraduationCap className="h-4 w-4" />
                        <span>{scholarship.level}</span>
                      </div>
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <Briefcase className="h-4 w-4" />
                        <span>{scholarship.field}</span>
                      </div>
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <MapPin className="h-4 w-4" />
                        <span>{scholarship.country}</span>
                      </div>
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        <span>หมดเขต: {scholarship.deadline ? scholarship.deadline.toLocaleDateString("th-TH") : "ไม่ระบุ"}</span>
                      </div>
                    </div>
                    {scholarship.amount && (
                      <p className="mt-3 font-medium text-primary">
                        {scholarship.amount.toLocaleString()} {scholarship.currency}
                      </p>
                    )}
                  </CardContent>
                </Card>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}
