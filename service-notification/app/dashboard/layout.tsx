import { Navbar } from "@/components/navbar"
import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <div className="flex flex-1">
        <DashboardSidebar />
        <main className="flex-1 overflow-auto bg-background">
          <div className="mx-auto max-w-5xl px-6 py-10">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
