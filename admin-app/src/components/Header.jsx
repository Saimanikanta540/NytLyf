import React from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, Bell, User } from 'lucide-react';

const Header = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    navigate('/login');
  };

  return (
    <header className="header">
      <div className="header-left">
        <h2 style={{ fontSize: '1.25rem' }}>Admin Panel</h2>
      </div>
      <div className="header-right" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
        <Bell size={20} color="#A0A0B0" style={{ cursor: 'pointer' }} />
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ width: 36, height: 36, borderRadius: '50%', backgroundColor: '#1A1A24', display: 'flex', alignItems: 'center', justifyCenter: 'center' }}>
            <User size={18} color="#00D9FF" style={{ margin: 'auto' }} />
          </div>
          <span style={{ fontSize: '0.875rem' }}>Administrator</span>
        </div>
        <button onClick={handleLogout} className="btn-logout">
          <LogOut size={18} />
          <span>Logout</span>
        </button>
      </div>
    </header>
  );
};

export default Header;
