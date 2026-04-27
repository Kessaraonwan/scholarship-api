'use client';

import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import { Bar, Line, Doughnut } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend, ArcElement);

export default function AnalyticsPage() {
  // Sample data for analytics
  const applicationData = {
    labels: ['ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.'],
    datasets: [
      {
        label: 'จำนวนใบสมัคร',
        data: [65, 59, 80, 81, 56, 55],
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
      },
    ],
  };

  const trendData = {
    labels: ['ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.'],
    datasets: [
      {
        label: 'การเข้าชมทุนการศึกษา',
        data: [120, 150, 180, 200, 170, 190],
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.5)',
      },
    ],
  };

  const categoryData = {
    labels: ['ปริญญาตรี', 'บัณฑิตศึกษา', 'วิจัย', 'แลกเปลี่ยน'],
    datasets: [
      {
        data: [300, 150, 100, 50],
        backgroundColor: [
          'rgba(255, 99, 132, 0.6)',
          'rgba(54, 162, 235, 0.6)',
          'rgba(255, 205, 86, 0.6)',
          'rgba(75, 192, 192, 0.6)',
        ],
      },
    ],
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">สถิติทุนการศึกษา</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-2">จำนวนใบสมัครทั้งหมด</h3>
          <p className="text-2xl font-bold text-blue-600">1,247</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-2">ทุนการศึกษาที่เปิดรับ</h3>
          <p className="text-2xl font-bold text-green-600">89</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-2">อัตราการผ่าน</h3>
          <p className="text-2xl font-bold text-purple-600">23.4%</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">จำนวนใบสมัครรายเดือน</h2>
          <Bar data={applicationData} />
        </div>

        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">แนวโน้มการเข้าชมทุนการศึกษา</h2>
          <Line data={trendData} />
        </div>
      </div>

      <div className="mt-6 bg-white p-4 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">จำนวนใบสมัครตามหมวดหมู่</h2>
        <div className="w-full max-w-md mx-auto">
          <Doughnut data={categoryData} />
        </div>
      </div>
    </div>
  );
}