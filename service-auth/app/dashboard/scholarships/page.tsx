export default function ScholarshipsPage() {
  return (
    <div className="-mx-6 -my-8">
      <iframe
        src="http://localhost:3003/scholarships?embed=true"
        className="w-full border-0"
        style={{ height: "calc(100vh - 3.5rem)" }}
      />
    </div>
  )
}
