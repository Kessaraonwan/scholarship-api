'use client';

import { Database, Search, Key } from 'lucide-react';

export default function Navbar() {
  return (
    <nav style={{
      position: 'sticky', top: 0, zIndex: 50, background: 'rgba(255, 255, 255, 0.8)',
      backdropFilter: 'blur(12px)', borderBottom: '1px solid #e2e8f0', height: '64px',
      display: 'flex', alignItems: 'center'
    }}>
      <div style={{
        width: '100%', maxWidth: '1200px', margin: '0 auto', padding: '0 24px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '36px', height: '36px', background: '#4f46e5', borderRadius: '12px',
            display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 10px 15px -3px rgba(79, 70, 229, 0.2)'
          }}>
            <Database size={20} color="#fff" />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: '18px', fontWeight: 'bold', color: '#0f172a', lineHeight: 1 }}>Ingestion</span>
            <span style={{ fontSize: '10px', fontWeight: 'bold', color: '#4f46e5', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Admin Portal</span>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
          <a href="http://localhost:3003/scholarships" style={{
            display: 'flex', alignItems: 'center', gap: '8px',padding: '10px 20px',background: '#5e2a9b', color: '#ffffff', borderRadius: '12px',fontSize: '14px', fontWeight: 600, textDecoration: 'none'
          }}>
            <Search size={16} /> ค้นหาทุน
          </a>
          <div style={{ width: '1px', height: '16px', background: '#e2e8f0' }} />
          <a href="http://localhost:3001/dashboard" style={{
            display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px',
            background: '#0f172a', color: '#fff', borderRadius: '12px',
            fontSize: '14px', fontWeight: 'bold', textDecoration: 'none', transition: '0.2s'
          }}>
            <Key size={16} /> จัดการ API Key
          </a>
        </div>
      </div>
    </nav>
  );
}