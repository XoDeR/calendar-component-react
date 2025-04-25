import React, { useMemo } from 'react';
import { Calendar, dateFnsLocalizer, Event } from 'react-big-calendar';
import { format } from 'date-fns/format';
import { parse } from 'date-fns/parse';
import { startOfWeek } from 'date-fns/startOfWeek';
import { getDay } from 'date-fns/getDay';
import { enUS } from 'date-fns/locale/en-US';
import { nl } from 'date-fns/locale/nl';
import { useQuery } from '@tanstack/react-query';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import './calendar.css';

// Define the interface for events expected by react-big-calendar
interface MyEvent extends Event {
  id?: number | string;
  // Add any other custom properties your event might have
  description?: string;
}

// Define the interface for the data fetched from your API
interface ApiEvent {
  event_id: number;
  title: string;
  start_time: string; // Assuming ISO string format from API
  end_time: string;   // Assuming ISO string format from API
  details?: string;
}

// Mock data fetching function
const fetchEvents = async (): Promise<ApiEvent[]> => {
  // Simulate an API call
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        {
          event_id: 1,
          title: 'Team Meeting',
          start_time: new Date(2025, 3, 28, 10, 0).toISOString(),
          end_time: new Date(2025, 3, 28, 11, 0).toISOString(),
          details: 'Discuss Q2 strategy',
        },
        {
          event_id: 2,
          title: 'Project Deadline',
          start_time: new Date(2025, 3, 30, 14, 0).toISOString(),
          end_time: new Date(2025, 3, 30, 15, 30).toISOString(),
          details: 'Submit final report',
        },
        {
          event_id: 3,
          title: 'Client Presentation',
          start_time: new Date(2025, 4, 5, 9, 30).toISOString(),
          end_time: new Date(2025, 4, 5, 10, 0).toISOString(),
          details: 'Present new features',
        },
      ]);
    }, 1000); // Simulate network delay
  });
};

// Function to transform API data to react-big-calendar events
const transformApiEventsToCalendarEvents = (apiEvents: ApiEvent[]): MyEvent[] => {
  return apiEvents.map((event) => ({
    id: event.event_id,
    title: event.title,
    start: new Date(event.start_time),
    end: new Date(event.end_time),
    description: event.details,
  }));
};

// Setup date-fns localizer
const locales = {
  'en-US': enUS,
  //'nl': nl,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

// Custom Event Component (Optional, for more detailed event rendering with Tailwind)
const CustomEvent: React.FC<{ event: MyEvent }> = ({ event }) => (
  <div className="p-1 text-xs truncate bg-blue-500 text-white rounded">
    <strong>{event.title}</strong>
    {event.description && <p className="text-gray-100">{event.description}</p>}
  </div>
);

const CalendarComponent: React.FC = () => {
  // Fetch events using TanStack Query
  const { data, isLoading, error } = useQuery<ApiEvent[], Error>({
    queryKey: ['calendarEvents'],
    queryFn: fetchEvents,
  });

  // Transform the fetched data
  const events: MyEvent[] = useMemo(() => {
    if (!data) return [];
    return transformApiEventsToCalendarEvents(data);
  }, [data]);

  if (isLoading) return <div className="text-center text-gray-600">Loading events...</div>;
  if (error) return <div className="text-center text-red-600">Error loading events: {error.message}</div>;

  return (
    <div className="p-4 bg-gray-100 rounded-lg shadow-md" style={{ height: '600px' }}>
      {' '}
      {/* Added height for calendar to be visible */}
      <Calendar
        localizer={localizer}
        events={events}
        view="week"
        startAccessor="start"
        endAccessor="end"
        style={{ height: '100%' }}
        className="tailwind-calendar" // Custom class for potential Tailwind overrides
        components={{
          event: CustomEvent, // Use the custom event component
          // You can override other components here, e.g., toolbar, header
        }}
      // Example of using eventPropGetter for basic styling based on event properties
      // eventPropGetter={(event, start, end, isSelected) => {
      //   const style = {
      //     backgroundColor: event.title.includes('Meeting') ? '#f87171' : '#60a5fa',
      //     color: 'white',
      //     borderRadius: '0px',
      //     border: 'none',
      //   };
      //   return {
      //     style,
      //   };
      // }}
      />
    </div>
  );
};

export default CalendarComponent;