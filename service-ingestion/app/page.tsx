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
