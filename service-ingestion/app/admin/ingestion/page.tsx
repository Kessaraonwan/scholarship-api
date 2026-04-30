'use client';
import { useState, useEffect } from 'react';
import Navbar from '../../components/ingestion/Navbar';
import StatCards from '../../components/ingestion/StatCards';
import { RefreshCw, Lock, ShieldAlert, History, Database } from 'lucide-react';

interface LogEntry {
  id: string;
  source: string;
  status: string;
  recordsFound: number;
  recordsNew: number;
  startedAt: string;
  completedAt: string | null;
}

interface StatsData {
  lastSync: string | null;
  totalRecords: number;
  newToday: number;
}

export default function IngestionPage() {
  const [pin, setPin] = useState('');
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [stats, setStats] = useState<StatsData>({ lastSync: null, totalRecords: 0, newToday: 0 });
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [loading, setLoading] = useState(false);

  const handleUnlock = () => {
    if (pin === '1234') {
      setIsAuthorized(true);
    } else {
      alert('รหัสผ่านไม่ถูกต้องครับ!');
      setPin('');
    }
  };

  // ✅ ดึงข้อมูลจาก API จริง
  useEffect(() => {
    if (!isAuthorized) return;

    const fetchData = async () => {
      setLoading(true);
      try {
        // ดึง logs
        const logsRes = await fetch('/api/admin/ingestion/logs?limit=10');
        if (logsRes.ok) {
          const logsData = await logsRes.json();
          const logList: LogEntry[] = logsData.data || [];
          setLogs(logList);

          // คำนวณ stats จาก logs
          const lastLog = logList[0];
          const lastSync = lastLog?.completedAt
            ? new Date(lastLog.completedAt).toLocaleString('th-TH')
            : null;

          // ดึง total records จาก ingestion status
          const statusRes = await fetch('/api/admin/ingestion');
          if (statusRes.ok) {
            const statusData = await statusRes.json();
            const total = statusData.data?.totalScholarships ?? 0;

            // newToday = logs ที่ startedAt เป็นวันนี้
            const today = new Date().toDateString();
            const newToday = logList
              .filter(l => new Date(l.startedAt).toDateString() === today)
              .reduce((sum, l) => sum + (l.recordsNew || 0), 0);

            setStats({ lastSync, totalRecords: total, newToday });
          }
        }
      } catch (err) {
        console.error('Failed to fetch data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [isAuthorized]);

  return (
    <div style={{ minHeight: '100vh', background: '#F8FAFC', fontFamily: 'sans-serif' }}>
      <Navbar />

      <main style={{ maxWidth: '1100px', margin: '0 auto', padding: '60px 24px' }}>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '48px' }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 14px', borderRadius: '99px', background: '#EEF2FF', color: '#4F46E5', fontSize: '11px', fontWeight: 'bold', marginBottom: '16px' }}>
              <ShieldAlert size={14} /> SECURITY CHECK: ADMIN NODE
            </div>
            <h1 style={{ fontSize: '42px', fontWeight: 800, color: '#0F172A', margin: 0 }}>
              Ingestion <span style={{ color: '#4F46E5' }}>Service</span>
            </h1>
          </div>

          {!isAuthorized && (
            <div style={{ display: 'flex', background: '#fff', padding: '10px', borderRadius: '24px', border: '1px solid #E2E8F0', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
              <input
                type="password"
                placeholder="Admin PIN"
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleUnlock()}
                style={{ border: 'none', outline: 'none', width: '100px', padding: '0 15px', fontWeight: 'bold' }}
              />
              <button
                onClick={handleUnlock}
                style={{ background: '#4F46E5', color: '#fff', border: 'none', padding: '10px 24px', borderRadius: '16px', fontWeight: 'bold', cursor: 'pointer' }}
              >
                Unlock
              </button>
            </div>
          )}
        </div>

        {isAuthorized ? (
          <div>
            {loading ? (
              <p style={{ color: '#94A3B8', textAlign: 'center' }}>Loading...</p>
            ) : (
              <>
                {/* ✅ ใช้ข้อมูลจาก DB จริง */}
                <StatCards
                  lastSync={stats.lastSync}
                  totalRecords={stats.totalRecords}
                  newToday={stats.newToday}
                />

                <div style={{ background: '#fff', borderRadius: '20px', border: '1px solid #E2E8F0', padding: '16px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: '#4F46E5', fontWeight: '600' }}>
                    <RefreshCw size={18} /> System Monitoring Active
                  </div>
                </div>

                {/* ✅ Activity Logs จาก DB จริง */}
                <div style={{ background: '#fff', borderRadius: '32px', border: '1px solid #E2E8F0', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.05)', overflow: 'hidden' }}>
                  <div style={{ padding: '24px 40px', background: '#F8FAFC', borderBottom: '1px solid #F1F5F9', display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <History size={20} color="#4F46E5" />
                    <h2 style={{ fontSize: '18px', fontWeight: '700', margin: 0 }}>Recent Activity Logs</h2>
                  </div>

                  {logs.length === 0 ? (
                    <div style={{ padding: '60px 40px', textAlign: 'center' }}>
                      <Database size={48} color="#CBD5E1" style={{ marginBottom: '16px' }} />
                      <p style={{ color: '#94A3B8', fontWeight: '500' }}>ยังไม่มี logs ครับ</p>
                    </div>
                  ) : (
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
                      <thead>
                        <tr style={{ background: '#F8FAFC', borderBottom: '1px solid #F1F5F9' }}>
                          <th style={{ padding: '12px 24px', textAlign: 'left', color: '#64748B', fontWeight: 600 }}>Source</th>
                          <th style={{ padding: '12px 24px', textAlign: 'left', color: '#64748B', fontWeight: 600 }}>Status</th>
                          <th style={{ padding: '12px 24px', textAlign: 'left', color: '#64748B', fontWeight: 600 }}>Records</th>
                          <th style={{ padding: '12px 24px', textAlign: 'left', color: '#64748B', fontWeight: 600 }}>New</th>
                          <th style={{ padding: '12px 24px', textAlign: 'left', color: '#64748B', fontWeight: 600 }}>Time</th>
                        </tr>
                      </thead>
                      <tbody>
                        {logs.map((log) => (
                          <tr key={log.id} style={{ borderBottom: '1px solid #F8FAFC' }}>
                            <td style={{ padding: '12px 24px', fontWeight: 600, color: '#0F172A' }}>{log.source}</td>
                            <td style={{ padding: '12px 24px' }}>
                              <span style={{
                                padding: '2px 10px', borderRadius: '99px', fontSize: '12px', fontWeight: 600,
                                background: log.status === 'success' ? '#DCFCE7' : '#FEE2E2',
                                color: log.status === 'success' ? '#16A34A' : '#DC2626'
                              }}>
                                {log.status}
                              </span>
                            </td>
                            <td style={{ padding: '12px 24px', color: '#475569' }}>{log.recordsFound}</td>
                            <td style={{ padding: '12px 24px', color: '#16A34A', fontWeight: 600 }}>+{log.recordsNew}</td>
                            <td style={{ padding: '12px 24px', color: '#94A3B8', fontSize: '12px' }}>
                              {new Date(log.startedAt).toLocaleString('th-TH')}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              </>
            )}
          </div>
        ) : (
          <div style={{ background: '#fff', padding: '100px', borderRadius: '32px', border: '1px solid #E2E8F0', textAlign: 'center', color: '#94A3B8', boxShadow: '0 4px 6px rgba(0,0,0,0.02)' }}>
            <Lock size={64} style={{ marginBottom: '24px', opacity: 0.2 }} />
            <h3 style={{ color: '#1E293B', marginBottom: '8px' }}>Restricted Area</h3>
            <p>กรุณากรอกรหัสผ่าน Admin เพื่อเข้าถึงระบบจัดการข้อมูล</p>
          </div>
        )}
      </main>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
      `}} />
    </div>
  );
}