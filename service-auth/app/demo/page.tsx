'use client'

import React, { useState, useEffect } from 'react';
import {
  Search, BookOpen, BarChart2, Bell, Key, Database,
  ChevronRight, ArrowRight, ShieldCheck, Clock, CheckCircle2, XCircle, Activity, LineChart
} from 'lucide-react';

const App = () => {
  const [activeTab, setActiveTab] = useState('home');

  const renderContent = () => {
    switch (activeTab) {
      case 'home': return <HomeView setActiveTab={setActiveTab} />;
      case 'scholarships': return <ScholarshipsView />;
      case 'analytics': return <AnalyticsView />;
      case 'alerts': return <AlertsView />;
      case 'developer': return <DeveloperDashboardView />;
      case 'admin': return <AdminIngestionView />;
      default: return <HomeView setActiveTab={setActiveTab} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-800">
      {/* Navigation Bar */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center cursor-pointer" onClick={() => setActiveTab('home')}>
              <BookOpen className="h-8 w-8 text-blue-600 mr-2" />
              <span className="font-bold text-xl tracking-tight text-blue-900">ScholarLink</span>
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-1">
              <NavButton icon={<Search />} label="ค้นหาทุน" tab="scholarships" activeTab={activeTab} onClick={setActiveTab} />
              <NavButton icon={<BarChart2 />} label="สถิติ (Pro)" tab="analytics" activeTab={activeTab} onClick={setActiveTab} />
              <NavButton icon={<Bell />} label="แจ้งเตือน" tab="alerts" activeTab={activeTab} onClick={setActiveTab} />
              <div className="w-px h-6 bg-gray-300 mx-2"></div>
              <NavButton icon={<Key />} label="API (Dev)" tab="developer" activeTab={activeTab} onClick={setActiveTab} />
              <NavButton icon={<Database />} label="ระบบดูดข้อมูล" tab="admin" activeTab={activeTab} onClick={setActiveTab} />
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {renderContent()}
      </main>
    </div>
  );
};

// --- Components ---

const NavButton = ({ icon, label, tab, activeTab, onClick }) => {
  const isActive = activeTab === tab;
  return (
    <button
      onClick={() => onClick(tab)}
      className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
        isActive
          ? 'bg-blue-50 text-blue-700'
          : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
      }`}
    >
      {React.cloneElement(icon, { className: 'h-4 w-4 mr-1.5' })}
      {label}
    </button>
  );
};

// 1. Home View (คนที่ 6: Landing Page)
const HomeView = ({ setActiveTab }) => (
  <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
    <div className="text-center py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-900 to-indigo-800 rounded-3xl shadow-xl text-white mb-12">
      <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6">
        ศูนย์รวม API และข้อมูลทุนการศึกษา<br className="hidden md:block"/> ที่ใหญ่ที่สุด
      </h1>
      <p className="mt-4 max-w-2xl text-lg md:text-xl text-blue-100 mx-auto mb-10">
        ค้นหาทุนเรียนต่อ แทร็กสถานะ และใช้งาน API ข้อมูลทุนการศึกษาที่อัปเดตแบบ Real-time เหมาะสำหรับนักเรียนและนักพัฒนา
      </p>
      <div className="flex flex-col sm:flex-row justify-center gap-4">
        <button onClick={() => setActiveTab('scholarships')} className="bg-white text-blue-900 hover:bg-gray-50 font-bold py-3 px-8 rounded-full shadow-lg transition transform hover:-translate-y-1 flex items-center justify-center">
          เริ่มค้นหาทุน <ArrowRight className="ml-2 h-5 w-5" />
        </button>
        <button onClick={() => setActiveTab('developer')} className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-blue-900 font-bold py-3 px-8 rounded-full transition flex items-center justify-center">
          ดู API Docs <ChevronRight className="ml-1 h-5 w-5" />
        </button>
      </div>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      <FeatureCard icon={<Search />} title="ค้นหาง่าย (Core API)" desc="กรองตามประเทศ ระดับชั้น และสาขาวิชาได้อย่างแม่นยำ" />
      <FeatureCard icon={<Bell />} title="ไม่พลาดทุกทุน (Notify)" desc="รับการแจ้งเตือนผ่าน Email/LINE เมื่อมีทุนใหม่ที่ตรงกับคุณ" />
      <FeatureCard icon={<Key />} title="สำหรับนักพัฒนา (Gateway)" desc="เชื่อมต่อ API ข้อมูลทุนเข้ากับแอปพลิเคชันของคุณได้อย่างง่ายดาย" />
    </div>
  </div>
);

const FeatureCard = ({ icon, title, desc }) => (
  <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center text-center">
    <div className="p-3 bg-blue-50 text-blue-600 rounded-full mb-4">
      {React.cloneElement(icon, { className: 'h-8 w-8' })}
    </div>
    <h3 className="text-lg font-bold text-gray-900 mb-2">{title}</h3>
    <p className="text-gray-500">{desc}</p>
  </div>
);

// 2. Scholarships View (คนที่ 3: Core API)
const ScholarshipsView = () => (
  <div className="flex flex-col md:flex-row gap-8 animate-in fade-in duration-300">
    {/* Sidebar Filter */}
    <div className="w-full md:w-64 shrink-0">
      <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200">
        <h3 className="font-bold text-lg mb-4 flex items-center"><Search className="h-5 w-5 mr-2"/> ตัวกรอง</h3>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">ระดับการศึกษา</label>
            <select className="w-full border-gray-300 rounded-md shadow-sm p-2 border focus:ring-blue-500 focus:border-blue-500">
              <option>ทั้งหมด</option>
              <option>ปริญญาตรี</option>
              <option>ปริญญาโท</option>
              <option>ปริญญาเอก</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">ประเทศ</label>
            <select className="w-full border-gray-300 rounded-md shadow-sm p-2 border">
              <option>ทั้งหมด</option>
              <option>ญี่ปุ่น</option>
              <option>สหราชอาณาจักร</option>
              <option>สหรัฐอเมริกา</option>
            </select>
          </div>
          <button className="w-full bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700 font-medium transition">
            ใช้ตัวกรอง
          </button>
        </div>
      </div>
    </div>

    {/* List */}
    <div className="flex-1 space-y-4">
      {[
        { title: "ทุนรัฐบาลญี่ปุ่น (MEXT) 2025", org: "สถานทูตญี่ปุ่น", level: "ป.ตรี / ป.โท", country: "ญี่ปุ่น", deadline: "31 พ.ค. 2025", tags: ["เต็มจำนวน", "ค่าครองชีพ"] },
        { title: "ทุน Fulbright Thai Graduate Scholarship", org: "Fulbright Thailand", level: "ป.โท / ป.เอก", country: "สหรัฐอเมริกา", deadline: "15 เม.ย. 2025", tags: ["เต็มจำนวน"] },
        { title: "Chevening Scholarships", org: "รัฐบาลสหราชอาณาจักร", level: "ปริญญาโท", country: "สหราชอาณาจักร", deadline: "7 พ.ย. 2025", tags: ["เต็มจำนวน", "ผู้นำ"] },
      ].map((item, i) => (
        <div key={i} className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h4 className="text-xl font-bold text-blue-900 mb-1">{item.title}</h4>
            <p className="text-sm text-gray-500 mb-3">{item.org} • {item.level} • {item.country}</p>
            <div className="flex flex-wrap gap-2">
              {item.tags.map(tag => (
                <span key={tag} className="px-2 py-1 bg-green-50 text-green-700 text-xs rounded-full font-medium">{tag}</span>
              ))}
            </div>
          </div>
          <div className="text-right w-full sm:w-auto flex flex-row sm:flex-col justify-between sm:justify-end items-center sm:items-end">
            <div className="text-sm text-red-500 font-medium flex items-center mb-0 sm:mb-2">
              <Clock className="h-4 w-4 mr-1" /> ปิดรับ: {item.deadline}
            </div>
            <button className="bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white px-4 py-2 rounded-md font-medium transition">
              ดูรายละเอียด
            </button>
          </div>
        </div>
      ))}
    </div>
  </div>
);

// 3. Analytics View (คนที่ 4: Analytics)
const AnalyticsView = () => (
  <div className="animate-in fade-in duration-300">
    <div className="mb-8">
      <h2 className="text-2xl font-bold text-gray-900">Dashboard สถิติทุนการศึกษา</h2>
      <p className="text-gray-500">วิเคราะห์แนวโน้มและความนิยมของทุนต่างๆ</p>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <StatCard title="ทุนทั้งหมดในระบบ" value="1,245" change="+12 ทุนสัปดาห์นี้" />
      <StatCard title="การค้นหาเดือนนี้" value="45.2k" change="+15% จากเดือนที่แล้ว" />
      <StatCard title="ประเทศยอดฮิต" value="ญี่ปุ่น" change="28% ของการค้นหา" />
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Mock Chart */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <h3 className="font-bold text-lg mb-6 flex items-center"><BarChart2 className="h-5 w-5 mr-2 text-blue-500"/> สัดส่วนทุนตามภูมิภาค</h3>
        <div className="space-y-4">
          <ProgressBar label="เอเชีย" percent={45} color="bg-blue-500" />
          <ProgressBar label="ยุโรป" percent={30} color="bg-indigo-500" />
          <ProgressBar label="อเมริกาเหนือ" percent={15} color="bg-cyan-500" />
          <ProgressBar label="อื่นๆ" percent={10} color="bg-gray-400" />
        </div>
      </div>

      {/* Leaderboard */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <h3 className="font-bold text-lg mb-4 flex items-center"><Activity className="h-5 w-5 mr-2 text-red-500"/> Top 5 ทุนที่มีคนสนใจมากที่สุด</h3>
        <div className="space-y-3">
          {["ทุนรัฐบาลญี่ปุ่น (MEXT)", "Chevening Scholarships", "ทุน Fulbright", "Erasmus+ Scholarship", "ทุน ก.พ."].map((name, i) => (
            <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center">
                <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold mr-3 ${i < 3 ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-200 text-gray-600'}`}>{i + 1}</span>
                <span className="font-medium text-sm">{name}</span>
              </div>
              <span className="text-xs text-gray-500">{1000 - (i * 150)} views</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

const StatCard = ({ title, value, change }) => (
  <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
    <h4 className="text-sm font-medium text-gray-500 mb-2">{title}</h4>
    <div className="text-3xl font-bold text-gray-900 mb-1">{value}</div>
    <div className="text-sm text-green-600">{change}</div>
  </div>
);

const ProgressBar = ({ label, percent, color }) => (
  <div>
    <div className="flex justify-between text-sm mb-1">
      <span>{label}</span>
      <span className="font-medium">{percent}%</span>
    </div>
    <div className="w-full bg-gray-200 rounded-full h-2.5">
      <div className={`${color} h-2.5 rounded-full`} style={{ width: `${percent}%` }}></div>
    </div>
  </div>
);

// 4. Alerts View (คนที่ 5: Notification)
const AlertsView = () => (
  <div className="max-w-3xl mx-auto animate-in fade-in duration-300">
    <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 text-blue-600 rounded-full mb-4">
          <Bell className="h-8 w-8" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900">ตั้งค่าการแจ้งเตือนทุน</h2>
        <p className="text-gray-500 mt-2">รับข่าวสารทุนใหม่ทันทีเมื่อมีข้อมูลอัปเดตเข้าระบบ</p>
      </div>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">ส่งการแจ้งเตือนไปที่</label>
          <div className="flex gap-4">
            <input type="email" placeholder="อีเมลของคุณ" className="flex-1 border-gray-300 border rounded-lg p-3 focus:ring-blue-500 focus:border-blue-500" defaultValue="student@university.ac.th" />
            <button className="bg-green-500 hover:bg-green-600 text-white px-4 py-3 rounded-lg font-medium transition flex items-center shrink-0">
              เชื่อมต่อ LINE
            </button>
          </div>
        </div>

        <div className="border-t border-gray-200 pt-6">
          <h3 className="font-bold mb-4">เงื่อนไขที่สนใจ (Subscriptions)</h3>
          <div className="space-y-3">
            {[
              { label: "ทุกทุนระดับ ปริญญาโท ใน ประเทศญี่ปุ่น", active: true },
              { label: "ทุนรัฐบาล (ทุกประเทศ)", active: true },
              { label: "ทุนสาขา วิทยาศาสตร์คอมพิวเตอร์", active: false },
            ].map((item, i) => (
              <div key={i} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition cursor-pointer">
                <span className="text-sm font-medium">{item.label}</span>
                <div className={`w-11 h-6 rounded-full flex items-center px-1 transition-colors ${item.active ? 'bg-blue-600' : 'bg-gray-300'}`}>
                  <div className={`w-4 h-4 bg-white rounded-full shadow-md transform transition-transform ${item.active ? 'translate-x-5' : 'translate-x-0'}`}></div>
                </div>
              </div>
            ))}
          </div>
          <button className="mt-4 text-blue-600 text-sm font-medium hover:underline flex items-center">
            + เพิ่มเงื่อนไขการแจ้งเตือนใหม่
          </button>
        </div>
      </div>
    </div>
  </div>
);

// 5. Developer Dashboard View (คนที่ 1: API Gateway & Auth)
const DeveloperDashboardView = () => {
  const [apiKeys, setApiKeys] = useState([]);
  const [usageStats, setUsageStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchApiKeys();
    fetchUsageStats();
  }, []);

  const fetchApiKeys = async () => {
    try {
      const response = await fetch('/api/keys');
      if (response.status === 401) {
        setError('กรุณาเข้าสู่ระบบก่อน');
        return;
      }

      const data = await response.json();
      if (!response.ok) throw new Error(data.error);

      setApiKeys(data.apiKeys);
    } catch (error) {
      console.error('Error fetching keys:', error);
      setError('ไม่สามารถโหลด API keys ได้');
    }
  };

  const fetchUsageStats = async () => {
    try {
      const response = await fetch('/api/usage-logs?limit=100&days=30');
      if (response.status === 401) {
        return; // ไม่แสดง error ถ้ายังไม่ได้ login
      }

      const data = await response.json();
      if (!response.ok) throw new Error(data.error);

      setUsageStats(data.stats);
    } catch (error) {
      console.error('Error fetching usage:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const createKey = async () => {
    const keyName = prompt('ชื่อ API Key ใหม่:');
    if (!keyName?.trim()) return;

    try {
      const response = await fetch('/api/keys', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: keyName.trim() }),
      });

      if (response.status === 401) {
        alert('กรุณาเข้าสู่ระบบก่อน');
        return;
      }

      const data = await response.json();
      if (!response.ok) throw new Error(data.error);

      setApiKeys([...apiKeys, data.apiKey]);
      alert('สร้าง API key สำเร็จ!');
    } catch (error) {
      console.error('Error creating key:', error);
      alert('ไม่สามารถสร้าง API key ได้: ' + error.message);
    }
  };

  const deleteKey = async (id) => {
    if (!confirm('คุณต้องการลบ API key นี้หรือไม่?')) return;

    try {
      const response = await fetch(`/api/keys?id=${id}`, {
        method: 'DELETE',
      });

      if (response.status === 401) {
        alert('กรุณาเข้าสู่ระบบก่อน');
        return;
      }

      const data = await response.json();
      if (!response.ok) throw new Error(data.error);

      setApiKeys(apiKeys.filter(key => key.id !== id));
      alert('ลบ API key สำเร็จ!');
    } catch (error) {
      console.error('Error deleting key:', error);
      alert('ไม่สามารถลบ API key ได้: ' + error.message);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="animate-in fade-in duration-300">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center"><Key className="h-6 w-6 mr-2 text-indigo-600"/> Developer Dashboard</h2>
          <p className="text-gray-500 mt-1">จัดการ API Keys และดูการใช้งานของคุณ (Rate Limit: 10,000 req/เดือน)</p>
        </div>
        <button onClick={createKey} className="bg-indigo-600 text-white hover:bg-indigo-700 px-4 py-2 rounded-md font-medium transition flex items-center">
          + สร้าง API Key ใหม่
        </button>
      </div>

      {error && (
        <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* API Keys Table */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-4 border-b bg-gray-50 font-bold text-gray-700">API Keys ของคุณ ({apiKeys.length})</div>
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="bg-white border-b">
                <th className="p-4 font-medium text-gray-500">ชื่อ Key</th>
                <th className="p-4 font-medium text-gray-500">Token</th>
                <th className="p-4 font-medium text-gray-500">สถานะ</th>
                <th className="p-4 font-medium text-gray-500">Action</th>
              </tr>
            </thead>
            <tbody>
              {apiKeys.map((key) => (
                <tr key={key.id} className="border-b">
                  <td className="p-4 font-medium">{key.name}</td>
                  <td className="p-4 font-mono text-gray-600 text-xs">
                    {key.key.substring(0, 20)}...
                    <button
                      onClick={() => navigator.clipboard.writeText(key.key)}
                      className="ml-2 text-blue-500 hover:text-blue-700 text-xs"
                    >
                      คัดลอก
                    </button>
                  </td>
                  <td className="p-4">
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      key.isActive
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {key.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="p-4">
                    <button
                      onClick={() => deleteKey(key.id)}
                      className="text-red-500 hover:text-red-700 text-sm underline"
                    >
                      ลบ
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {apiKeys.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              ยังไม่มี API Keys สร้าง Key แรกของคุณเลย!
            </div>
          )}
        </div>

        {/* Usage Stats */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h3 className="font-bold text-lg mb-4 flex items-center"><LineChart className="h-5 w-5 mr-2 text-indigo-500"/> Usage (เดือนนี้)</h3>
          {usageStats ? (
            <>
              <div className="flex justify-between items-end mb-2">
                <span className="text-3xl font-bold text-gray-900">{usageStats.totalRequests || 0}</span>
                <span className="text-sm text-gray-500">/ 10,000 req</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-3 mb-6">
                <div className="bg-indigo-500 h-3 rounded-full" style={{ width: `${Math.min((usageStats.totalRequests || 0) / 100, 100)}%` }}></div>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Success:</span>
                  <span className="text-green-600">{usageStats.successRequests || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span>Error:</span>
                  <span className="text-red-600">{usageStats.errorRequests || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span>Avg Response:</span>
                  <span>{usageStats.averageResponseTime || 0}ms</span>
                </div>
              </div>
            </>
          ) : (
            <div className="text-center py-8 text-gray-500">
              ยังไม่มีข้อมูลการใช้งาน
            </div>
          )}
          <p className="text-xs text-gray-500 bg-indigo-50 p-3 rounded-md border border-indigo-100 mt-4">
            คำขอของคุณผ่าน API Gateway จะถูกนับและควบคุมโดย Redis Rate Limiter
          </p>
        </div>
      </div>
    </div>
  );
};

// 6. Admin Ingestion View (คนที่ 2: Data Ingestion)
const AdminIngestionView = () => (
  <div className="animate-in fade-in duration-300">
    <div className="flex justify-between items-end mb-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 flex items-center"><Database className="h-6 w-6 mr-2 text-emerald-600"/> Ingestion Status</h2>
        <p className="text-gray-500 mt-1">ตรวจสอบสถานะการทำงานของ Web Scraper (Cron Job ทุก 6 ชม.)</p>
      </div>
      <button className="bg-emerald-100 text-emerald-700 hover:bg-emerald-200 border border-emerald-300 px-4 py-2 rounded-md font-medium transition flex items-center">
        <Activity className="h-4 w-4 mr-2"/> Force Sync All
      </button>
    </div>

    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <table className="w-full text-left text-sm">
        <thead className="bg-gray-50 border-b border-gray-200">
          <tr>
            <th className="p-4 font-bold text-gray-700">แหล่งข้อมูล (Source)</th>
            <th className="p-4 font-bold text-gray-700">อัปเดตล่าสุด</th>
            <th className="p-4 font-bold text-gray-700">ดึงสำเร็จ (Records)</th>
            <th className="p-4 font-bold text-gray-700">สถานะ Scraper</th>
            <th className="p-4 font-bold text-gray-700">Action</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          <IngestRow source="เว็บไซต์ กยศ." time="10 นาทีที่แล้ว" records="45" status="success" />
          <IngestRow source="สำนักงาน ก.พ. (OCSC)" time="2 ชั่วโมงที่แล้ว" records="12" status="success" />
          <IngestRow source="ทุนมหาวิทยาลัยชั้นนำ (รวม)" time="6 ชั่วโมงที่แล้ว" records="0" status="error" errorMsg="Timeout Error" />
          <IngestRow source="สถานทูตญี่ปุ่น (MEXT)" time="12 ชั่วโมงที่แล้ว" records="1" status="success" />
        </tbody>
      </table>
    </div>
  </div>
);

const IngestRow = ({ source, time, records, status, errorMsg = '' }) => (
  <tr className="hover:bg-gray-50 transition">
    <td className="p-4 font-medium text-gray-900">{source}</td>
    <td className="p-4 text-gray-500 text-sm">{time}</td>
    <td className="p-4 font-mono text-gray-700">{records}</td>
    <td className="p-4">
      {status === 'success' ? (
        <span className="flex items-center text-emerald-600 text-sm font-medium bg-emerald-50 px-2 py-1 rounded-full w-max">
          <CheckCircle2 className="h-4 w-4 mr-1" /> Success
        </span>
      ) : (
        <span className="flex items-center text-red-600 text-sm font-medium bg-red-50 px-2 py-1 rounded-full w-max" title={errorMsg}>
          <XCircle className="h-4 w-4 mr-1" /> Failed
        </span>
      )}
    </td>
    <td className="p-4">
      <button className="text-blue-600 hover:text-blue-800 text-sm font-medium underline">Sync</button>
    </td>
  </tr>
);

export default App;