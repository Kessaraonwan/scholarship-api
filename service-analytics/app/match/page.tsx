'use client';

import { useState, useEffect } from 'react';

interface Scholarship {
  id: string;
  title: string;
  description: string;
  category: string;
  amount: string;
  deadline: string;
  eligibility: string[];
  matchScore?: number;
  details?: string;
  organization?: string;
  website?: string;
}

export default function MatchPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [scholarships, setScholarships] = useState<Scholarship[]>([]);
  const [filteredScholarships, setFilteredScholarships] = useState<Scholarship[]>([]);
  const [selectedScholarship, setSelectedScholarship] = useState<Scholarship | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Mock data with more details
  const mockScholarships: Scholarship[] = [
    {
      id: '1',
      title: 'Chevening Scholarship',
      description: 'ทุนการศึกษาจากรัฐบาลอังกฤษสำหรับนักศึกษาต่างชาติ',
      category: 'ปริญญาโท',
      amount: '£18,000',
      deadline: '2024-11-15',
      organization: 'รัฐบาลอังกฤษ',
      website: 'https://www.chevening.org',
      details: 'Chevening Scholarships เป็นทุนการศึกษาที่มอบให้แก่นักศึกษาที่มีศักยภาพสูงจากทั่วโลก เพื่อศึกษาต่อในสหราชอาณาจักร เป็นส่วนหนึ่งของนโยบายต่างประเทศของอังกฤษในการสร้างเครือข่ายผู้นำระดับโลก',
      eligibility: ['GPA 3.0+', 'TOEFL/IELTS', 'ผู้นำ', 'ประสบการณ์ทำงาน 2 ปี']
    },
    {
      id: '2',
      title: 'Rhodes Scholarship',
      description: 'ทุนการศึกษาที่มีชื่อเสียงที่สุดสำหรับศึกษาต่อที่ Oxford',
      category: 'ปริญญาโท',
      amount: '£18,500',
      deadline: '2024-10-01',
      organization: 'Rhodes Trust',
      website: 'https://www.rhodeshouse.ox.ac.uk',
      details: 'Rhodes Scholarships เป็นทุนการศึกษาที่เก่าแก่และมีชื่อเสียงที่สุดในโลก ก่อตั้งโดย Cecil Rhodes ในปี 1902 มอบให้แก่นักศึกษาที่มีศักยภาพสูงจากทั่วโลกเพื่อศึกษาต่อที่ University of Oxford',
      eligibility: ['GPA 3.7+', 'ผู้นำ', 'กีฬา', 'อายุ 18-24 ปี']
    },
    {
      id: '3',
      title: 'Gates Cambridge Scholarship',
      description: 'ทุนการศึกษาจาก Bill & Melinda Gates Foundation',
      category: 'ปริญญาเอก',
      amount: '£30,000',
      deadline: '2024-12-01',
      organization: 'Bill & Melinda Gates Foundation',
      website: 'https://www.gatescambridge.org',
      details: 'Gates Cambridge Scholarships มอบให้แก่นักศึกษาปริญญาเอกที่ยอดเยี่ยมจากทั่วโลกเพื่อศึกษาต่อที่ University of Cambridge เน้นการพัฒนานักวิจัยที่จะสร้างผลกระทบต่อสังคม',
      eligibility: ['GPA 3.5+', 'วิจัย', 'ผู้นำ', 'มีแผนการวิจัยที่ชัดเจน']
    },
    {
      id: '4',
      title: 'DAAD Scholarship',
      description: 'ทุนการศึกษาจากรัฐบาลเยอรมนี',
      category: 'ปริญญาโท',
      amount: '€1,200/เดือน',
      deadline: '2024-11-30',
      organization: 'DAAD (German Academic Exchange Service)',
      website: 'https://www.daad.de',
      details: 'DAAD เป็นองค์กรของรัฐบาลเยอรมนีที่ส่งเสริมการศึกษาต่อต่างประเทศ มอบทุนการศึกษาต่างๆ สำหรับนักศึกษาต่างชาติที่ต้องการศึกษาต่อในเยอรมนี',
      eligibility: ['GPA 2.75+', 'ภาษาเยอรมัน', 'วิจัย', 'อายุไม่เกิน 32 ปี']
    },
    {
      id: '5',
      title: 'ASEAN Scholarship',
      description: 'ทุนการศึกษาสำหรับนักศึกษาจากประเทศอาเซียน',
      category: 'ปริญญาตรี',
      amount: 'S$5,000',
      deadline: '2024-12-15',
      organization: 'กระทรวงศึกษาธิการสิงคโปร์',
      website: 'https://www.moe.gov.sg',
      details: 'ASEAN Scholarships มอบให้แก่นักเรียนที่มีผลการเรียนดีเยี่ยมจากประเทศอาเซียนเพื่อศึกษาต่อในสิงคโปร์ เป็นส่วนหนึ่งของความร่วมมือในภูมิภาคอาเซียน',
      eligibility: ['GPA 3.0+', 'ประเทศอาเซียน', 'ผู้นำ', 'ผลสอบ PSLE ดีเยี่ยม']
    }
  ];

  useEffect(() => {
    setScholarships(mockScholarships);
    setFilteredScholarships(mockScholarships);
  }, []);

  useEffect(() => {
    let filtered = scholarships;

    if (searchTerm) {
      filtered = filtered.filter(scholarship =>
        scholarship.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        scholarship.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedCategory) {
      filtered = filtered.filter(scholarship => scholarship.category === selectedCategory);
    }

    setFilteredScholarships(filtered);
  }, [searchTerm, selectedCategory, scholarships]);

  const categories = [...new Set(scholarships.map(s => s.category))];

  const openDetails = (scholarship: Scholarship) => {
    setSelectedScholarship(scholarship);
  };

  const closeDetails = () => {
    setSelectedScholarship(null);
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">ค้นหาทุนการศึกษา</h1>

      {/* Search and Filter Section */}
      <div className="bg-white p-6 rounded-lg shadow mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">ค้นหา</label>
            <input
              type="text"
              placeholder="พิมพ์ชื่อทุนการศึกษา..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">หมวดหมู่</label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">ทั้งหมด</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="mt-4 text-sm text-gray-600">
          พบ {filteredScholarships.length} ทุนการศึกษา
        </div>
      </div>

      {/* Results Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredScholarships.map((scholarship) => (
          <div key={scholarship.id} className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow">
            <div className="p-6">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-lg font-semibold text-gray-900">{scholarship.title}</h3>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  scholarship.category === 'ปริญญาตรี' ? 'bg-blue-100 text-blue-800' :
                  scholarship.category === 'ปริญญาโท' ? 'bg-green-100 text-green-800' :
                  'bg-purple-100 text-purple-800'
                }`}>
                  {scholarship.category}
                </span>
              </div>

              <p className="text-gray-600 text-sm mb-4">{scholarship.description}</p>

              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">จำนวนเงิน:</span>
                  <span className="font-medium">{scholarship.amount}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">ปิดรับสมัคร:</span>
                  <span className="font-medium">{new Date(scholarship.deadline).toLocaleDateString('th-TH')}</span>
                </div>
              </div>

              <div className="mb-4">
                <h4 className="text-sm font-medium text-gray-700 mb-2">คุณสมบัติ:</h4>
                <div className="flex flex-wrap gap-1">
                  {scholarship.eligibility.slice(0, 3).map((req, index) => (
                    <span key={index} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                      {req}
                    </span>
                  ))}
                  {scholarship.eligibility.length > 3 && (
                    <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                      +{scholarship.eligibility.length - 3} อื่นๆ
                    </span>
                  )}
                </div>
              </div>

              <button
                onClick={() => openDetails(scholarship)}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition-colors"
              >
                ดูรายละเอียด
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredScholarships.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">ไม่พบทุนการศึกษาที่ตรงกับเงื่อนไขการค้นหา</p>
          <p className="text-gray-400 text-sm mt-2">ลองปรับคำค้นหาหรือหมวดหมู่ดูนะครับ</p>
        </div>
      )}

      {/* Details Modal */}
      {selectedScholarship && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-2xl font-bold text-gray-900">{selectedScholarship.title}</h2>
                <button
                  onClick={closeDetails}
                  className="text-gray-400 hover:text-gray-600 text-2xl"
                >
                  ×
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    selectedScholarship.category === 'ปริญญาตรี' ? 'bg-blue-100 text-blue-800' :
                    selectedScholarship.category === 'ปริญญาโท' ? 'bg-green-100 text-green-800' :
                    'bg-purple-100 text-purple-800'
                  }`}>
                    {selectedScholarship.category}
                  </span>
                </div>

                <p className="text-gray-700">{selectedScholarship.description}</p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">ข้อมูลทุน</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-500">จำนวนเงิน:</span>
                        <span className="font-medium">{selectedScholarship.amount}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">ปิดรับสมัคร:</span>
                        <span className="font-medium">{new Date(selectedScholarship.deadline).toLocaleDateString('th-TH')}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">องค์กร:</span>
                        <span className="font-medium">{selectedScholarship.organization}</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">เว็บไซต์</h3>
                    <a
                      href={selectedScholarship.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 underline"
                    >
                      {selectedScholarship.website}
                    </a>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">รายละเอียด</h3>
                  <p className="text-gray-700 text-sm leading-relaxed">{selectedScholarship.details}</p>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">คุณสมบัติที่จำเป็น</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {selectedScholarship.eligibility.map((req, index) => (
                      <div key={index} className="flex items-center text-sm">
                        <span className="w-2 h-2 bg-blue-600 rounded-full mr-2"></span>
                        {req}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    onClick={closeDetails}
                    className="flex-1 bg-gray-200 text-gray-800 py-2 px-4 rounded hover:bg-gray-300 transition-colors"
                  >
                    ปิด
                  </button>
                  <a
                    href={selectedScholarship.website}
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