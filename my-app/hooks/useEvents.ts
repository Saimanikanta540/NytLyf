import { useEffect, useState, useCallback } from 'react';
import { getEvents, getEventById } from '../src/api/client';
import { mapBackendEvent } from '../src/api/adapters';
import { Event } from '../src/types';
import { mockEvents } from '../src/data/mockData';

export function useEvents() {
  const [events, setEvents] = useState<Event[]>(mockEvents);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getEvents(1, 50); // The new Node.js backend uses page 1 by default, not 0
      const mapped = res.data.map(mapBackendEvent);
      if (mapped.length > 0) setEvents(mapped);
    } catch (err: any) {
      setError(err.message || 'Failed to load events');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return { events, loading, error, refresh: load };
}

export function useEvent(id?: string) {
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    setError(null);
    try {
      const res = await getEventById(id);
      setEvent(mapBackendEvent(res.data));
    } catch (err: any) {
      setError(err.message || 'Failed to load event');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    load();
  }, [load]);

  return { event, loading, error, refresh: load };
}
