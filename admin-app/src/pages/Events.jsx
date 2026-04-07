import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllEvents, deleteEvent } from '../api/client';
import { Calendar, MapPin, Tag, TrendingUp, Plus, Trash2 } from 'lucide-react';

const Events = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchEvents = async () => {
    try {
      const { data } = await getAllEvents();
      setEvents(data.data);
    } catch (err) {
      console.error('Failed to fetch events', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this event? This action cannot be undone.')) {
      try {
        await deleteEvent(id);
        // Remove from UI immediately for better UX
        setEvents(events.filter(e => e._id !== id));
      } catch (err) {
        alert('Failed to delete event. You may not have permission.');
        console.error(err);
      }
    }
  };

  if (loading) return <div>Loading events list...</div>;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1>Event Management</h1>
          <div style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginTop: '0.5rem' }}>
            Showing {events.length} events
          </div>
        </div>
        <button 
          onClick={() => navigate('/events/new')} 
          style={{ width: 'auto', display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.5rem' }}
        >
          <Plus size={18} />
          Create Event
        </button>
      </div>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Event Details</th>
              <th>Category</th>
              <th>Location</th>
              <th>Date</th>
              <th>Price</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {events.map((event) => (
              <tr key={event._id}>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <img 
                      src={event.image} 
                      alt={event.title} 
                      style={{ width: 40, height: 40, borderRadius: '8px', objectFit: 'cover' }} 
                    />
                    <div>
                      <div style={{ fontWeight: 600, fontSize: '0.9375rem' }}>{event.title}</div>
                      {event.isTrending && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--neon-pink)', fontSize: '0.75rem', fontWeight: 700 }}>
                          <TrendingUp size={12} />
                          TRENDING
                        </div>
                      )}
                    </div>
                  </div>
                </td>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Tag size={14} color="var(--text-secondary)" />
                    <span style={{ color: 'var(--text-secondary)' }}>{event.category?.name}</span>
                  </div>
                </td>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)' }}>
                    <MapPin size={14} />
                    <span style={{ maxWidth: '180px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {event.locationName}
                    </span>
                  </div>
                </td>
                <td>
                  <div style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                    {new Date(event.eventDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                  </div>
                </td>
                <td>
                  <div style={{ fontWeight: 700 }}>₹{event.price}</div>
                </td>
                <td>
                  <span style={{ color: '#39FF14', fontSize: '0.875rem', fontWeight: 500 }}>Live</span>
                </td>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <button 
                      onClick={() => navigate(`/events/edit/${event._id}`)}
                      style={{ 
                        background: 'transparent', 
                        padding: '0.5rem', 
                        width: 'auto',
                        color: 'var(--neon-blue)',
                        border: '1px solid rgba(0, 217, 255, 0.3)',
                        borderRadius: '0.5rem'
                      }}
                      title="Edit Event"
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinelinejoin="round">
                        <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path>
                      </svg>
                    </button>
                    <button 
                      onClick={() => handleDelete(event._id)}
                      style={{ 
                        background: 'transparent', 
                        padding: '0.5rem', 
                        width: 'auto',
                        color: '#FF3B5C',
                        border: '1px solid rgba(255, 59, 92, 0.3)',
                        borderRadius: '0.5rem'
                      }}
                      title="Delete Event"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Events;
