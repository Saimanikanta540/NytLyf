import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Users, Calendar, Settings } from 'lucide-react';

const Sidebar = () => {
  return (
    <aside className="sidebar">
      <div className="logo">NYTLYF</div>
      <nav className="nav-links">
        <div className="nav-item">
          <NavLink to="/" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
            <LayoutDashboard size={20} />
            <span>Dashboard</span>
          </NavLink>
        </div>
        <div className="nav-item">
          <NavLink to="/users" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
            <Users size={20} />
            <span>Users</span>
          </NavLink>
        </div>
        <div className="nav-item">
          <NavLink to="/events" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
            <Calendar size={20} />
            <span>Events</span>
          </NavLink>
        </div>
        <div className="nav-item">
          <NavLink to="/settings" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
            <Settings size={20} />
            <span>Settings</span>
          </NavLink>
        </div>
      </nav>
    </aside>
  );
};

export default Sidebar;
