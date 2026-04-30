'use client';

import { useState, useEffect } from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend, ArcElement);

interface Overview {
  totalScholarships: number;
  byLevel: Record<string, number>;
  byCountry: Record<string, number>;
  closingSoon: number;
}

export default function AnalyticsPage() {
  const [overview, setOverview] = useState<Overview | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch('/api/analytics/overview', {
    })
      .then(r => r.json())
      .then(json => {
        if (!json?.data) {
          throw new Error(json?.error || 'โหลดข้อมูลไม่สำเร็จ')
        }
        setOverview(json.data)
      })
      .catch((err) => setError(err instanceof Error ? err.message : 'โหลดข้อมูลไม่สำเร็จ'))
      .finally(() => setIsLoading(false));
  }, []);

  const byLevelData = {
    labels: overview ? Object.keys(overview.byLevel) : [],
    datasets: [{
      label: 'จำนวนใบสมัคร',
      data: overview ? Object.values(overview.byLevel) : [],
      backgroundColor: 'rgba(75, 192, 192, 0.6)',
    }],
  };

  const byCountryData = {
    labels: overview ? Object.keys(overview.byCountry) : [],
    datasets: [{
      data: overview ? Object.values(overview.byCountry) : [],
      backgroundColor: [
        'rgba(255, 99, 132, 0.6)',
        'rgba(54, 162, 235, 0.6)',
        'rgba(255, 205, 86, 0.6)',
        'rgba(75, 192, 192, 0.6)',
        'rgba(153, 102, 255, 0.6)',
      ],
    }],
  };

  if (isLoading) return (
    <div className="text-center py-20">
      <p className="text-gray-500 text-lg">กำลังโหลดข้อมูล...</p>
    </div>
  );

  if (error) return (
    <div className="text-center py-20">
      <p className="text-red-500 text-lg">{error}</p>
    </div>
  );

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">สถิติทุนการศึกษา</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-2">จำนวนใบสมัครทั้งหมด</h3>
          <p className="text-2xl font-bold text-blue-600">{overview?.totalScholarships ?? '-'}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-2">ทุนการศึกษาที่เปิดรับ</h3>
          <p className="text-2xl font-bold text-green-600">{overview?.totalScholarships ?? '-'}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-2">ใกล้หมดเขตสมัคร</h3>
          <p className="text-2xl font-bold text-purple-600">{overview?.closingSoon ?? '-'}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">จำนวนใบสมัครตามระดับการศึกษา</h2>
          <Bar data={byLevelData} />
        </div>

        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">จำนวนทุนตามประเทศ</h2>
          <div className="w-full max-w-md mx-auto">
            <Doughnut data={byCountryData} />
          </div>
        </div>
      </div>
    </div>
  );
}