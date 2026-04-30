"use client"
import Navbar from "@/components/navbar"
import { Footer } from "@/components/footer"
import { useSearchParams } from "next/navigation"
import { Suspense } from "react"

function ScholarshipsContent({ children }: { children: React.ReactNode }) {
  const searchParams = useSearchParams()
  const isEmbed = searchParams.get("embed") === "true"

  return (
    <div className="flex min-h-screen flex-col">
      {!isEmbed && <Navbar />}
      <main className="flex-1 bg-background">
        {children}
      </main>
      {!isEmbed && <Footer />}
    </div>
  )
}

export default function ScholarshipsLayout({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={<div className="flex min-h-screen flex-col"><main className="flex-1 bg-background">{children}</main></div>}>
      <ScholarshipsContent>{children}</ScholarshipsContent>
    </Suspense>
  )
}
