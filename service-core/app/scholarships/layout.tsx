import Navbar from "@/components/navbar"
import { Footer } from "@/components/footer"


export default function ScholarshipsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1 bg-background">
        {children}
      </main>
      <Footer />
    </div>
  )
}
