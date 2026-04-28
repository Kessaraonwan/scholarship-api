"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Calendar, MapPin, GraduationCap, Briefcase } from "lucide-react"
import { type Scholarship } from "@/lib/scholarships-data"

const levels = ["ทุกระดับ", "มัธยม", "ปริญญาตรี", "ปริญญาโท", "ปริญญาเอก"]
const fields = ["ทุกสาขา", "IT", "วิทยาศาสตร์", "เศรษฐศาสตร์"]
const countries = ["ทุกประเทศ", "ไทย", "UK", "US", "Japan", "Germany"]

function ScholarshipCard({ scholarship }: { scholarship: Scholarship }) {
  const daysUntilDeadline = Math.ceil(
    (new Date(scholarship.deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
  )

  return (
    <Link href={`/scholarships/${scholarship.id}`}>
      <Card className="h-full transition-shadow hover:shadow-lg">
        <CardHeader>
          <div className="flex items-start justify-between">
            <CardTitle className="text-lg text-foreground">{scholarship.name}</CardTitle>
            {daysUntilDeadline <= 30 && daysUntilDeadline > 0 && (
              <Badge className={daysUntilDeadline <= 7 ? "bg-red-500 text-white" : "bg-orange-500 text-white"}>
                {daysUntilDeadline} วัน
              </Badge>
            )}
          </div>
          <CardDescription className="line-clamp-2">{scholarship.description}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary" className="flex items-center gap-1">
              <GraduationCap className="h-3 w-3" />
              {scholarship.level}
            </Badge>
            <Badge variant="secondary" className="flex items-center gap-1">
              <Briefcase className="h-3 w-3" />
              {scholarship.field}
            </Badge>
            <Badge variant="secondary" className="flex items-center gap-1">
              <MapPin className="h-3 w-3" />
              {scholarship.country}
            </Badge>
          </div>
          <div className="mt-4 flex items-center justify-between text-sm">
            <div className="flex items-center gap-1 text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span>หมดเขต: {scholarship.deadline}</span>
            </div>
            {scholarship.amount && (
              <span className="font-medium text-primary">
                {scholarship.amount.toLocaleString()} {scholarship.currency}
              </span>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}

function ScholarshipSkeleton() {
  return (
    <Card className="h-full">
      <CardHeader>
        <div className="h-6 w-3/4 animate-pulse rounded bg-muted" />
        <div className="mt-2 h-4 w-full animate-pulse rounded bg-muted" />
      </CardHeader>
      <CardContent>
        <div className="flex gap-2">
          <div className="h-6 w-20 animate-pulse rounded bg-muted" />
          <div className="h-6 w-16 animate-pulse rounded bg-muted" />
          <div className="h-6 w-16 animate-pulse rounded bg-muted" />
        </div>
        <div className="mt-4 flex justify-between">
          <div className="h-4 w-32 animate-pulse rounded bg-muted" />
          <div className="h-4 w-20 animate-pulse rounded bg-muted" />
        </div>
      </CardContent>
    </Card>
  )
}

export default function ScholarshipsPage() {
  const [search, setSearch] = useState("")
  const [level, setLevel] = useState("ทุกระดับ")
  const [field, setField] = useState("ทุกสาขา")
  const [country, setCountry] = useState("ทุกประเทศ")
  const [isLoading, setIsLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 6

  const [scholarships, setScholarships] = useState<Scholarship[]>([])
  const [totalPages, setTotalPages] = useState(1)

  useEffect(() => {
    const fetchScholarships = async () => {
      setIsLoading(true)
      const params = new URLSearchParams({
        keyword: search,
        level: level,
        field: field,
        country: country,
        page: String(currentPage),
        limit: String(itemsPerPage),
      })

      try {
        const response = await fetch(`/api/scholarships?${params.toString()}`)
        const data = await response.json()
        setScholarships(data.data)
        setTotalPages(data.pagination.totalPages)
      } catch (error) {
        console.error("Failed to fetch scholarships:", error)
        setScholarships([])
        setTotalPages(1)
      } finally {
        setIsLoading(false)
      }
    }

    fetchScholarships()
  }, [search, level, field, country, currentPage])

  const handleFilterChange = () => {
    // Reset to first page when filters change
    setCurrentPage(1)
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">ค้นหาทุนการศึกษา</h1>
        <p className="mt-2 text-muted-foreground">
          ค้นหาทุนการศึกษาจากทั่วโลกที่ตรงกับความต้องการของคุณ
        </p>
      </div>

      {/* Search and Filters */}
      <div className="mb-8 space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="ค้นหาชื่อทุน..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value)
              handleFilterChange()
            }}
            className="pl-10"
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <Select
            value={level}
            onValueChange={(value) => {
              setLevel(value)
              handleFilterChange()
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="ระดับการศึกษา" />
            </SelectTrigger>
            <SelectContent>
              {levels.map((l) => (
                <SelectItem key={l} value={l}>
                  {l}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={field}
            onValueChange={(value) => {
              setField(value)
              handleFilterChange()
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="สาขาวิชา" />
            </SelectTrigger>
            <SelectContent>
              {fields.map((f) => (
                <SelectItem key={f} value={f}>
                  {f}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={country}
            onValueChange={(value) => {
              setCountry(value)
              handleFilterChange()
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="ประเทศ" />
            </SelectTrigger>
            <SelectContent>
              {countries.map((c) => (
                <SelectItem key={c} value={c}>
                  {c}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Results */}
      {isLoading ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <ScholarshipSkeleton key={i} />
          ))}
        </div>
      ) : scholarships.length === 0 ? (
        <div className="rounded-lg border border-border bg-card py-16 text-center">
          <p className="text-lg font-medium text-foreground">ไม่พบทุนการศึกษา</p>
          <p className="mt-2 text-muted-foreground">ลองปรับเงื่อนไขการค้นหาใหม่</p>
        </div>
      ) : (
        <>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {scholarships.map((scholarship) => (
              <ScholarshipCard key={scholarship.id} scholarship={scholarship} />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-8 flex items-center justify-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
              >
                ก่อนหน้า
              </Button>
              <span className="text-sm text-muted-foreground">
                หน้า {currentPage} จาก {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
              >
                ถัดไป
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  )
}
