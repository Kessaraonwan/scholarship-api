'use client';
import { useState } from 'react';
import Navbar from '../../components/ingestion/Navbar';
import StatCards from '../../components/ingestion/StatCards';
import { RefreshCw, Lock, Unlock, ShieldAlert, History, Database } from 'lucide-react';

export default function IngestionPage() {
  const [pin, setPin] = useState('');
  const [isAuthorized, setIsAuthorized] = useState(false); // สถานะการเข้าถึงระบบ

  const handleUnlock = () => {
    if (pin === '1234') { // <--- รหัสผ่าน Admin
      setIsAuthorized(true);
    } else {
      alert('รหัสผ่านไม่ถูกต้องครับ!');
      setPin('');
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#F8FAFC', fontFamily: 'sans-serif' }}>
      <Navbar />
      
      <main style={{ maxWidth: '1100px', margin: '0 auto', padding: '60px 24px' }}>
        
        {/* ส่วนหัว Title */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '48px' }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 14px', borderRadius: '99px', background: '#EEF2FF', color: '#4F46E5', fontSize: '11px', fontWeight: 'bold', marginBottom: '16px' }}>
              <ShieldAlert size={14} /> SECURITY CHECK: ADMIN NODE
            </div>
            <h1 style={{ fontSize: '42px', fontWeight: 800, color: '#0F172A', margin: 0 }}>
              Ingestion <span style={{ color: '#4F46E5' }}>Service</span>
            </h1>
          </div>

          {/* ช่องกรอกรหัส (จะหายไปเมื่อรหัสถูก) */}
          {!isAuthorized && (
            <div style={{ display: 'flex', background: '#fff', padding: '10px', borderRadius: '24px', border: '1px solid #E2E8F0', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
              <input 
                type="password" 
                placeholder="Admin PIN" 
                value={pin}
                onChange={(e) => setPin(e.target.value)}
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

        {/* --- ระบบ Ingestion: จะแสดงผลเฉพาะตอนที่ isAuthorized เป็น true เท่านั้น --- */}
        {isAuthorized ? (
          <div style={{ animation: 'fadeIn 0.5s ease-in-out' }}>
            <StatCards lastSync="29/04/2026 20:00" totalRecords={150} newToday={5} />
            
            {/* Auto-refresh Status */}
            <div style={{ background: '#fff', borderRadius: '20px', border: '1px solid #E2E8F0', padding: '16px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: '#4F46E5', fontWeight: '600' }}>
                <RefreshCw size={18} /> System Monitoring Active
              </div>
            </div>

            {/* Ingestion Logs */}
            <div style={{ background: '#fff', borderRadius: '32px', border: '1px solid #E2E8F0', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.05)', overflow: 'hidden' }}>
              <div style={{ padding: '24px 40px', background: '#F8FAFC', borderBottom: '1px solid #F1F5F9', display: 'flex', alignItems: 'center', gap: '12px' }}>
                <History size={20} color="#4F46E5" />
                <h2 style={{ fontSize: '18px', fontWeight: '700', margin: 0 }}>Recent Activity Logs</h2>
              </div>
              <div style={{ padding: '60px 40px', textAlign: 'center' }}>
                <Database size={48} color="#CBD5E1" style={{ marginBottom: '16px' }} />
                <p style={{ color: '#94A3B8', fontWeight: '500' }}>เชื่อมต่อฐานข้อมูลสำเร็จ - พร้อมดึงข้อมูลทุนการศึกษา</p>
              </div>
            </div>
          </div>
        ) : (
          /* --- หน้าจอตอนที่ยังไม่ได้กรอกรหัส --- */
          <div style={{ 
            background: '#fff', padding: '100px', borderRadius: '32px', border: '1px solid #E2E8F0', 
            textAlign: 'center', color: '#94A3B8', boxShadow: '0 4px 6px rgba(0,0,0,0.02)' 
          }}>
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