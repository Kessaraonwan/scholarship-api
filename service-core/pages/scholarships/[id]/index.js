import { useRouter } from "next/router";

export default function ScholarshipDetailPage() {
  const { id } = useRouter().query;

  return (
    <main style={{ padding: 24, fontFamily: "Arial, sans-serif" }}>
      <h1>Scholarship Detail</h1>
      <p>Scholarship id: {id || "(loading...)"}</p>
    </main>
  );
}
