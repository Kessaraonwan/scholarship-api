'use client';

import { useState, useEffect } from 'react';

interface Scholarship {
  id: string;
  name: string;
  level: string;
  field: string;
  country: string;
  amount: number | null;
  currency: string | null;
  deadline: string;
  url: string;
  source: string;
  description: string | null;
}

export default function MatchPage() {
  const [scholarships, setScholarships] = useState<Scholarship[]>([]);
  const [filteredScholarships, setFilteredScholarships] = useState<Scholarship[]>([]);
  const [selectedLevel, setSelectedLevel] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('');
  const [selectedField, setSelectedField] = useState('');
  const [selectedScholarship, setSelectedScholarship] = useState<Scholarship | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchMatch = async () => {
      setIsLoading(true);
      setError('');
      try {
        const res = await fetch('/api/match', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({}),
        });
        const json = await res.json();
        if (!res.ok) {
          throw new Error(json?.error || 'โหลดข้อมูลไม่สำเร็จ')
        }
        setScholarships(json.data ?? []);
        setFilteredScholarships(json.data ?? []);
      } catch {
        setError('โหลดข้อมูลไม่สำเร็จ กรุณาลองใหม่อีกครั้ง');
      } finally {
        setIsLoading(false);
      }
    };
    fetchMatch();
  }, []);

  useEffect(() => {
    setFilteredScholarships(
      scholarships.filter((scholarship) => {
        const matchesLevel = !selectedLevel || scholarship.level === selectedLevel;
        const matchesCountry = !selectedCountry || scholarship.country === selectedCountry;
        const matchesField = !selectedField || scholarship.field === selectedField;

        return matchesLevel && matchesCountry && matchesField;
      })
    );
  }, [selectedLevel, selectedCountry, selectedField, scholarships]);

  const levels = [...new Set(scholarships.map(s => s.level))];
  const countries = [...new Set(scholarships.map(s => s.country))];
  const fields = [...new Set(scholarships.map(s => s.field).filter(Boolean))];

  if (isLoading) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-500 text-lg">กำลังโหลดข้อมูล...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-20">
        <p className="text-red-500 text-lg">{error}</p>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-2">ค้นหาทุนที่ตรงเงื่อนไข</h1>
      <p className="text-sm text-gray-600 mb-6">
        หน้านี้เป็นตัวกรองทุนตามระดับการศึกษา ประเทศ และสาขาที่เลือก ไม่ใช่การจับคู่จากโปรไฟล์อัตโนมัติ
      </p>

      <div className="bg-white p-6 rounded-lg shadow mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">ระดับการศึกษา</label>
            <select
              value={selectedLevel}
              onChange={(e) => setSelectedLevel(e.target.value)}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">ทั้งหมด</option>
              {levels.map(level => (
                <option key={level} value={level}>{level}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">ประเทศ</label>
            <select
              value={selectedCountry}
              onChange={(e) => setSelectedCountry(e.target.value)}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">ทั้งหมด</option>
              {countries.map((country) => (
                <option key={country} value={country}>{country}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">สาขา / Field</label>
            <select
              value={selectedField}
              onChange={(e) => setSelectedField(e.target.value)}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">ทั้งหมด</option>
              {fields.map((field) => (
                <option key={field} value={field}>{field}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="mt-4 text-sm text-gray-600">
          พบ {filteredScholarships.length} ทุนที่ตรงเงื่อนไข
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredScholarships.map((scholarship) => (
          <div key={scholarship.id} className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow">
            <div className="p-6">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-lg font-semibold text-gray-900">{scholarship.name}</h3>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  scholarship.level === 'ปริญญาตรี' ? 'bg-blue-100 text-blue-800' :
                  scholarship.level === 'ปริญญาโท' ? 'bg-green-100 text-green-800' :
                  'bg-purple-100 text-purple-800'
                }`}>
                  {scholarship.level}
                </span>
              </div>
              <p className="text-gray-600 text-sm mb-4">{scholarship.description}</p>
              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">จำนวนเงิน:</span>
                  <span className="font-medium">
                    {scholarship.amount ? `${scholarship.amount.toLocaleString()} ${scholarship.currency}` : '-'}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">ประเทศ:</span>
                  <span className="font-medium">{scholarship.country}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">ปิดรับสมัคร:</span>
                  <span className="font-medium">
                    {new Date(scholarship.deadline).toLocaleDateString('th-TH')}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setSelectedScholarship(scholarship)}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition-colors"
              >
                ดูทุนนี้
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredScholarships.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">ไม่พบทุนที่ตรงกับเงื่อนไขการค้นหา</p>
          <p className="text-gray-400 text-sm mt-2">ลองปรับระดับการศึกษาดูนะครับ</p>
        </div>
      )}

      {selectedScholarship && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-2xl font-bold text-gray-900">{selectedScholarship.name}</h2>
                <button
                  onClick={() => setSelectedScholarship(null)}
                  className="text-gray-400 hover:text-gray-600 text-2xl"
                >
                  ✕
                </button>
              </div>
              <div className="space-y-4">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  selectedScholarship.level === 'ปริญญาตรี' ? 'bg-blue-100 text-blue-800' :
                  selectedScholarship.level === 'ปริญญาโท' ? 'bg-green-100 text-green-800' :
                  'bg-purple-100 text-purple-800'
                }`}>
                  {selectedScholarship.level}
                </span>
                <p className="text-gray-700">{selectedScholarship.description}</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">ข้อมูลทุน</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-500">จำนวนเงิน:</span>
                        <span className="font-medium">
                          {selectedScholarship.amount?.toLocaleString()} {selectedScholarship.currency}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">ประเทศ:</span>
                        <span className="font-medium">{selectedScholarship.country}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">สาขา:</span>
                        <span className="font-medium">{selectedScholarship.field}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">ปิดรับสมัคร:</span>
                        <span className="font-medium">
                          {new Date(selectedScholarship.deadline).toLocaleDateString('th-TH')}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">แหล่งที่มา:</span>
                        <span className="font-medium">{selectedScholarship.source}</span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">เว็บไซต์</h3>
                    <a
                      href={selectedScholarship.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 underline text-sm break-all"
                    >
                      {selectedScholarship.url}
                    </a>
                  </div>
                </div>
                <div className="flex gap-3 pt-4">
                  <button
                    onClick={() => setSelectedScholarship(null)}
                    className="flex-1 bg-gray-200 text-gray-800 py-2 px-4 rounded hover:bg-gray-300 transition-colors"
                  >
                    ปิด
                  </button>
                  <a
                    href={selectedScholarship.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition-colors text-center"
                  >
                    สมัครทุนนี้
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}