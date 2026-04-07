import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { createEvent, updateEvent, getEvent, getCategories } from '../api/client';
import { Save, X, AlertCircle, ArrowLeft } from 'lucide-react';

const AddEvent = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = !!id;

  const [categories, setCategories] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(isEditMode);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    locationName: '',
    latitude: 17.3850,
    longitude: 78.4867,
    eventDate: '',
    price: 0,
    availableTickets: 100,
    image: '',
    isTrending: false
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const catRes = await getCategories();
        const catData = catRes.data.data;
        setCategories(catData);

        if (isEditMode) {
          const eventRes = await getEvent(id);
          const evt = eventRes.data.data;
          
          // Format date for datetime-local input
          const formattedDate = new Date(evt.eventDate).toISOString().slice(0, 16);
          
          setFormData({
            title: evt.title || '',
            description: evt.description || '',
            category: evt.category?._id || (catData.length > 0 ? catData[0]._id : ''),
            locationName: evt.locationName || '',
            latitude: evt.latitude || 17.3850,
            longitude: evt.longitude || 78.4867,
            eventDate: formattedDate,
            price: evt.price || 0,
            availableTickets: evt.availableTickets || 0,
            image: evt.image || '',
            isTrending: evt.isTrending || false
          });
        } else if (catData.length > 0) {
          setFormData(prev => ({ ...prev, category: catData[0]._id }));
        }
      } catch (err) {
        setError('Failed to load data');
        console.error(err);
      } finally {
        setInitialLoading(false);
      }
    };
    fetchData();
  }, [id, isEditMode]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const payload = {
        ...formData,
        latitude: parseFloat(formData.latitude),
        longitude: parseFloat(formData.longitude),
        price: parseFloat(formData.price),
        availableTickets: parseInt(formData.availableTickets, 10),
        eventDate: new Date(formData.eventDate).toISOString()
      };

      if (!payload.image) {
        delete payload.image;
      }

      if (isEditMode) {
        await updateEvent(id, payload);
      } else {
        await createEvent(payload);
      }
      
      navigate('/events');
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.errors?.[0]?.msg ||
        err.response?.data?.message || 
        `Failed to ${isEditMode ? 'update' : 'create'} event. Please check all fields.`
      );
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) return <div>Loading...</div>;

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
        <button onClick={() => navigate('/events')} style={{ background: 'transparent', width: 'auto', padding: '0.5rem', color: 'var(--text-secondary)' }}>
          <ArrowLeft size={24} />
        </button>
        <h1 style={{ margin: 0 }}>{isEditMode ? 'Edit Event' : 'Create New Event'}</h1>
      </div>

      {error && (
        <div style={{ backgroundColor: 'rgba(255, 59, 92, 0.1)', color: '#FF3B5C', padding: '1rem', borderRadius: '0.75rem', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <AlertCircle size={20} />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ maxWidth: '800px', backgroundColor: 'var(--bg-secondary)', padding: '2rem', borderRadius: '1.25rem', border: '1px solid var(--border)' }}>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
          <div className="form-group">
            <label>Event Title *</label>
            <input 
              type="text" 
              name="title" 
              value={formData.title} 
              onChange={handleChange} 
              required 
              placeholder="e.g., Neon DJ Night"
            />
          </div>

          <div className="form-group">
            <label>Category *</label>
            <select name="category" value={formData.category} onChange={handleChange} required>
              {categories.map(c => (
                <option key={c._id} value={c._id}>{c.name}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="form-group">
          <label>Description *</label>
          <textarea 
            name="description" 
            value={formData.description} 
            onChange={handleChange} 
            required 
            rows="4"
            placeholder="Tell your attendees what to expect..."
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
          <div className="form-group">
            <label>Location Name / Venue *</label>
            <input 
              type="text" 
              name="locationName" 
              value={formData.locationName} 
              onChange={handleChange} 
              required 
              placeholder="e.g., The Grand Club, Jubilee Hills"
            />
          </div>

          <div className="form-group">
            <label>Event Date & Time *</label>
            <input 
              type="datetime-local" 
              name="eventDate" 
              value={formData.eventDate} 
              onChange={handleChange} 
              required 
            />
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
          <div className="form-group">
            <label>Price (₹) *</label>
            <input 
              type="number" 
              name="price" 
              value={formData.price} 
              onChange={handleChange} 
              required 
              min="0"
            />
          </div>

          <div className="form-group">
            <label>Available Tickets *</label>
            <input 
              type="number" 
              name="availableTickets" 
              value={formData.availableTickets} 
              onChange={handleChange} 
              required 
              min="1"
            />
          </div>
        </div>

        <div className="form-group">
          <label>Image URL (Optional)</label>
          <input 
            type="url" 
            name="image" 
            value={formData.image} 
            onChange={handleChange} 
            placeholder="https://images.unsplash.com/..."
          />
          <small style={{ color: 'var(--text-secondary)', fontSize: '0.75rem', marginTop: '0.25rem', display: 'block' }}>
            Leave blank to use a default placeholder image.
          </small>
        </div>

        {/* Hidden inputs for latitude/longitude to simplify UI, but available if needed later */}
        <div style={{ display: 'none' }}>
          <input type="number" name="latitude" value={formData.latitude} onChange={handleChange} step="any" />
          <input type="number" name="longitude" value={formData.longitude} onChange={handleChange} step="any" />
        </div>

        <div className="checkbox-group">
          <input 
            type="checkbox" 
            id="isTrending" 
            name="isTrending" 
            checked={formData.isTrending} 
            onChange={handleChange} 
          />
          <label htmlFor="isTrending">Mark as Trending (Shows fire badge on app)</label>
        </div>

        <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
          <button 
            type="button" 
            onClick={() => navigate('/events')}
            style={{ background: 'transparent', border: '1px solid var(--border)', color: 'var(--text-primary)' }}
          >
            <X size={18} style={{ marginRight: '0.5rem', display: 'inline' }} />
            Cancel
          </button>
          
          <button type="submit" disabled={loading} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
            <Save size={18} />
            {loading ? 'Publishing...' : 'Publish Event'}
          </button>
        </div>

      </form>
    </div>
  );
};

export default AddEvent;
