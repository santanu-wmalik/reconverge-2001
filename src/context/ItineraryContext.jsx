import { createContext, useContext, useCallback, useMemo, useEffect, useRef } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { eventSchedule } from '../data/events';
import { useAuth } from './AuthContext';
import { itineraryApi } from '../services/api';

const ItineraryContext = createContext();

export function ItineraryProvider({ children }) {
  const [selectedIds, setSelectedIds] = useLocalStorage('alumni-itinerary', []);
  const { user } = useAuth();
  const serverRecordId = useRef(null);
  const initialLoadDone = useRef(false);

  // Load from server on login
  useEffect(() => {
    if (!user?.id) {
      initialLoadDone.current = false;
      return;
    }
    itineraryApi.getByUserId(user.id)
      .then((results) => {
        if (results.length > 0) {
          serverRecordId.current = results[0].id;
          if (results[0].selectedEventIds?.length > 0) {
            setSelectedIds(results[0].selectedEventIds);
          }
        }
        initialLoadDone.current = true;
      })
      .catch((err) => {
        console.error('Failed to load itinerary from server:', err);
        initialLoadDone.current = true;
      });
  }, [user?.id, setSelectedIds]);

  // Sync to server on changes (debounced)
  useEffect(() => {
    if (!user?.id || !initialLoadDone.current) return;
    const timeout = setTimeout(() => {
      const payload = {
        userId: user.id,
        selectedEventIds: selectedIds,
        updatedAt: new Date().toISOString(),
      };
      if (serverRecordId.current) {
        itineraryApi.update(serverRecordId.current, payload).catch(console.error);
      } else {
        itineraryApi.create(payload)
          .then((created) => { serverRecordId.current = created.id; })
          .catch(console.error);
      }
    }, 500);
    return () => clearTimeout(timeout);
  }, [selectedIds, user?.id]);

  const addEvent = useCallback((eventId) => {
    setSelectedIds((prev) => (prev.includes(eventId) ? prev : [...prev, eventId]));
  }, [setSelectedIds]);

  const removeEvent = useCallback((eventId) => {
    setSelectedIds((prev) => prev.filter((id) => id !== eventId));
  }, [setSelectedIds]);

  const toggleEvent = useCallback((eventId) => {
    setSelectedIds((prev) =>
      prev.includes(eventId) ? prev.filter((id) => id !== eventId) : [...prev, eventId]
    );
  }, [setSelectedIds]);

  const isEventSelected = useCallback(
    (eventId) => selectedIds.includes(eventId),
    [selectedIds]
  );

  const clearItinerary = useCallback(() => setSelectedIds([]), [setSelectedIds]);

  const myEvents = useMemo(
    () =>
      eventSchedule
        .filter((evt) => selectedIds.includes(evt.id))
        .sort((a, b) => {
          if (a.day !== b.day) return a.day - b.day;
          return a.startTime.localeCompare(b.startTime);
        }),
    [selectedIds]
  );

  const conflicts = useMemo(() => {
    const result = [];
    for (let i = 0; i < myEvents.length; i++) {
      for (let j = i + 1; j < myEvents.length; j++) {
        const a = myEvents[i];
        const b = myEvents[j];
        if (a.day === b.day && a.endTime > b.startTime && a.startTime < b.endTime) {
          result.push([a.id, b.id]);
        }
      }
    }
    return result;
  }, [myEvents]);

  return (
    <ItineraryContext.Provider
      value={{
        selectedIds,
        myEvents,
        conflicts,
        addEvent,
        removeEvent,
        toggleEvent,
        isEventSelected,
        clearItinerary,
      }}
    >
      {children}
    </ItineraryContext.Provider>
  );
}

export function useItinerary() {
  const context = useContext(ItineraryContext);
  if (!context) throw new Error('useItinerary must be used within an ItineraryProvider');
  return context;
}
