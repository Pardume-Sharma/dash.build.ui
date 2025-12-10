'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useState } from 'react';

interface CalendarRendererProps {
  data: any[];
  config: any;
  name: string;
}

export default function CalendarRenderer({ data, config, name }: CalendarRendererProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  
  const events = data?.map(d => ({
    date: new Date(d.data.date),
    title: d.data.title || d.data.event,
    color: d.data.color || '#06b6d4',
  })) || [];

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const daysInMonth = lastDay.getDate();
  const startingDayOfWeek = firstDay.getDay();

  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 
                      'July', 'August', 'September', 'October', 'November', 'December'];

  const getEventsForDay = (day: number) => {
    return events.filter(event => 
      event.date.getDate() === day &&
      event.date.getMonth() === month &&
      event.date.getFullYear() === year
    );
  };

  const previousMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  return (
    <Card className="h-full border-white/10 bg-white/5 backdrop-blur-xl">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">{name}</CardTitle>
          <div className="flex items-center gap-2">
            <button onClick={previousMonth} className="p-1 hover:bg-white/10 rounded">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-sm font-medium min-w-[120px] text-center">
              {monthNames[month]} {year}
            </span>
            <button onClick={nextMonth} className="p-1 hover:bg-white/10 rounded">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-7 gap-1">
          {/* Day headers */}
          {days.map(day => (
            <div key={day} className="text-center text-xs font-medium text-gray-400 py-2">
              {day}
            </div>
          ))}
          
          {/* Empty cells for days before month starts */}
          {Array.from({ length: startingDayOfWeek }).map((_, i) => (
            <div key={`empty-${i}`} className="aspect-square" />
          ))}
          
          {/* Calendar days */}
          {Array.from({ length: daysInMonth }).map((_, i) => {
            const day = i + 1;
            const dayEvents = getEventsForDay(day);
            const isToday = new Date().getDate() === day && 
                           new Date().getMonth() === month && 
                           new Date().getFullYear() === year;
            
            return (
              <div
                key={day}
                className={`aspect-square p-1 rounded-lg border border-white/10 hover:border-cyan-500/50 ${
                  isToday ? 'bg-cyan-500/20 border-cyan-500' : 'bg-white/5'
                }`}
              >
                <div className="text-xs text-white mb-1">{day}</div>
                <div className="space-y-0.5">
                  {dayEvents.slice(0, 2).map((event, idx) => (
                    <div
                      key={idx}
                      className="text-[10px] truncate px-1 py-0.5 rounded"
                      style={{ backgroundColor: event.color + '40' }}
                      title={event.title}
                    >
                      {event.title}
                    </div>
                  ))}
                  {dayEvents.length > 2 && (
                    <div className="text-[10px] text-gray-400">
                      +{dayEvents.length - 2} more
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
