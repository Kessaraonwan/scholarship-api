'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function RootPage() {
  const router = useRouter();
  useEffect(() => {
    router.push('/admin/ingestion'); // ดีดไปหน้า Admin ที่สวยๆ ทันที
  }, [router]);

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', background: '#F8FAFC' }}>
      <p style={{ fontFamily: 'sans-serif', color: '#64748B' }}>Redirecting to Ingestion Control Center...</p>
    </div>
  );
}
// เพิ่มโค้ดนี้ใน IngestionPage หลังจากปลดล็อกแล้ว
const [stats, setStats] = useState({ lastSync: '—', total: 0, today: 0 });

useEffect(() => {
  if (isAuthorized) {
    // ยิงไปที่ API หลังบ้านของมิก (ตัวอย่างเส้นทาง)
    fetch('http://localhost:3002/api/ingestion/stats')
      .then(res => res.json())
      .then(data => {
        setStats({
          lastSync: data.lastSyncTime,
          total: data.totalRecords,
          today: data.newToday
        });
      })
      .catch(err => console.error("ดึงข้อมูลไม่สำเร็จ:", err));
  }
}, [isAuthorized]);