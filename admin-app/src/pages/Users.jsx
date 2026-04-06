import React, { useEffect, useState } from 'react';
import { getAllUsers } from '../api/client';
import { User, Mail, Shield, Calendar } from 'lucide-react';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const { data } = await getAllUsers();
        setUsers(data.data);
      } catch (err) {
        console.error('Failed to fetch users', err);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  if (loading) return <div>Loading users list...</div>;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1>Manage Users</h1>
        <div style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
          Total Users: {users.length}
        </div>
      </div>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>User</th>
              <th>Email</th>
              <th>Role</th>
              <th>Joined Date</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id}>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{ width: 32, height: 32, borderRadius: '50%', backgroundColor: 'var(--bg-tertiary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <User size={16} color="var(--neon-blue)" />
                    </div>
                    <span style={{ fontWeight: 500 }}>{user.name}</span>
                  </div>
                </td>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)' }}>
                    <Mail size={14} />
                    <span>{user.email}</span>
                  </div>
                </td>
                <td>
                  <span style={{ 
                    padding: '0.25rem 0.75rem', 
                    borderRadius: '1rem', 
                    fontSize: '0.75rem', 
                    fontWeight: 600,
                    textTransform: 'uppercase',
                    backgroundColor: user.role === 'admin' ? 'rgba(255, 45, 146, 0.1)' : 'rgba(0, 217, 255, 0.1)',
                    color: user.role === 'admin' ? 'var(--neon-pink)' : 'var(--neon-blue)'
                  }}>
                    {user.role}
                  </span>
                </td>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)' }}>
                    <Calendar size={14} />
                    <span>{new Date(user.createdAt).toLocaleDateString()}</span>
                  </div>
                </td>
                <td>
                  <span style={{ color: '#39FF14', display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.875rem' }}>
                    <div style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: '#39FF14' }}></div>
                    Active
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Users;
