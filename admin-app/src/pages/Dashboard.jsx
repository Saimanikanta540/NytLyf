import React, { useEffect, useState } from 'react';
import { getAdminStats } from '../api/client';
import { Users, Calendar, Grid, ShieldCheck } from 'lucide-react';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await getAdminStats();
        setStats(data.data);
      } catch (err) {
        console.error('Failed to fetch stats', err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return <div>Loading statistics...</div>;

  return (
    <div>
      <h1 style={{ marginBottom: '2rem' }}>Platform Overview</h1>
      
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: 'rgba(255, 45, 146, 0.1)' }}>
            <Users color="var(--neon-pink)" size={24} />
          </div>
          <div>
            <p className="stat-label">Total Users</p>
            <h3 className="stat-value">{stats?.totalUsers || 0}</h3>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: 'rgba(0, 217, 255, 0.1)' }}>
            <Calendar color="var(--neon-blue)" size={24} />
          </div>
          <div>
            <p className="stat-label">Active Events</p>
            <h3 className="stat-value">{stats?.totalEvents || 0}</h3>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: 'rgba(157, 78, 221, 0.1)' }}>
            <Grid color="var(--neon-purple)" size={24} />
          </div>
          <div>
            <p className="stat-label">Categories</p>
            <h3 className="stat-value">{stats?.totalCategories || 0}</h3>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: 'rgba(57, 255, 20, 0.1)' }}>
            <ShieldCheck color="#39FF14" size={24} />
          </div>
          <div>
            <p className="stat-label">Active Admins</p>
            <h3 className="stat-value">{stats?.activeAdmins || 0}</h3>
          </div>
        </div>
      </div>

      <div style={{ marginTop: '3rem' }}>
        <h2 style={{ marginBottom: '1.5rem' }}>Recent Activity</h2>
        <div className="table-container" style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
          <p>Activity tracking will appear here as users interact with the app.</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
