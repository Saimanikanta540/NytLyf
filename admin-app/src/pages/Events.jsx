import React, { useEffect, useState } from 'react';
import { getAllEvents } from '../api/client';
import { Calendar, MapPin, Tag, TrendingUp } from 'lucide-react';

const Events = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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
    fetchEvents();
  }, []);

  if (loading) return <div>Loading events list...</div>;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1>Event Management</h1>
        <div style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
          Showing {events.length} events
        </div>
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
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Events;
