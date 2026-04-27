import Link from 'next/link';

export default function AnalyticsDashboard() {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">แดชบอร์ดสถิติทุนการศึกษา</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link href="/analytics" className="block">
          <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow cursor-pointer">
            <h2 className="text-xl font-semibold mb-2">📊 สถิติ</h2>
            <p className="text-gray-600">ดูสถิติและข้อมูลเชิงลึกเกี่ยวกับทุนการศึกษาและใบสมัคร</p>
          </div>
        </Link>

        <Link href="/match" className="block">
          <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow cursor-pointer">
            <h2 className="text-xl font-semibold mb-2">🎯 จับคู่ทุนการศึกษา</h2>
            <p className="text-gray-600">ค้นหาทุนการศึกษาที่เหมาะสมกับข้อมูลและคุณสมบัติของคุณ</p>
          </div>
        </Link>
      </div>
    </div>
  );
}