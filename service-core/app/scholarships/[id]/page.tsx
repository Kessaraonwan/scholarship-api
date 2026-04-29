import Link from "next/link"
import { notFound } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  ArrowLeft,
  Calendar,
  MapPin,
  GraduationCap,
  Briefcase,
  ExternalLink,
  Clock,
} from "lucide-react"
import { prisma } from "@/lib/prisma"

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function ScholarshipDetailPage({ params }: PageProps) {
  const { id } = await params
  const scholarship = await prisma.scholarship.findUnique({
    where: { id },
  })

  if (!scholarship) {
    notFound()
  }

  const relatedScholarships = await prisma.scholarship.findMany({
    where: {
      NOT: { id: scholarship.id },
      OR: [{ level: scholarship.level }, { field: scholarship.field }],
    },
    take: 3,
    orderBy: { createdAt: "desc" },
  })

  const daysUntilDeadline = scholarship.deadline
    ? Math.ceil((new Date(scholarship.deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
    : null

  const isUrgent = daysUntilDeadline !== null && daysUntilDeadline <= 30 && daysUntilDeadline > 0

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
      {/* Back Button */}
      <Link
        href="/scholarships"
        className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        กลับ
      </Link>

      {/* Header */}
      <div className="mb-8">
        <div className="flex items-start justify-between">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            {scholarship.name}
          </h1>
          {isUrgent && (
            <Badge className={daysUntilDeadline <= 7 ? "bg-red-500 text-white" : "bg-orange-500 text-white"}>
              <Clock className="mr-1 h-3 w-3" />
              เหลืออีก {daysUntilDeadline} วัน
            </Badge>
          )}
        </div>
      </div>

      {/* Details Cards */}
      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="flex items-center gap-3 py-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <GraduationCap className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">ระดับการศึกษา</p>
              <p className="font-medium text-foreground">{scholarship.level}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center gap-3 py-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <Briefcase className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">สาขาวิชา</p>
              <p className="font-medium text-foreground">{scholarship.field}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center gap-3 py-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <MapPin className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">ประเทศ</p>
              <p className="font-medium text-foreground">{scholarship.country}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center gap-3 py-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <Calendar className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">หมดเขต</p>
              <p className="font-medium text-foreground">
                {scholarship.deadline ? scholarship.deadline.toLocaleDateString("th-TH") : "ไม่ระบุ"}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Amount */}
      {scholarship.amount && (
        <Card className="mb-8">
          <CardContent className="py-6 text-center">
            <p className="text-sm text-muted-foreground">มูลค่าทุน</p>
            <p className="text-3xl font-bold text-primary">{scholarship.amount.toLocaleString()} {scholarship.currency}</p>
          </CardContent>
        </Card>
      )}

      {/* Description */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>รายละเอียดทุน</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="leading-relaxed text-muted-foreground">{scholarship.description || "ไม่มีรายละเอียด"}</p>
        </CardContent>
      </Card>

      {/* CTA Button */}
      <div className="mb-12">
        <Button size="lg" className="w-full sm:w-auto" asChild>
          <a href={scholarship.url} target="_blank" rel="noopener noreferrer">
            สมัครทุนนี้
            <ExternalLink className="ml-2 h-4 w-4" />
          </a>
        </Button>
      </div>

      {/* Related Scholarships */}
      {relatedScholarships.length > 0 && (
        <div>
          <h2 className="mb-6 text-2xl font-bold text-foreground">ทุนที่เกี่ยวข้อง</h2>
          <div className="grid gap-4 sm:grid-cols-3">
            {relatedScholarships.map((s) => (
              <Link key={s.id} href={`/scholarships/${s.id}`}>
                <Card className="h-full transition-shadow hover:shadow-md">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">{s.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-1">
                      <Badge variant="secondary" className="text-xs">
                        {s.level}
                      </Badge>
                      <Badge variant="secondary" className="text-xs">
                        {s.country}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
