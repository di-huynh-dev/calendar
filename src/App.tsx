/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { format, setHours } from "date-fns";
import { useState } from "react";
import HeaderComponent from "./components/Header";
import { useCalendarStore } from "./store/useCalendarStore";
import DayView from "./components/DayView";
import AddEventModal from "./components/AddEventModal";

const Calendar: React.FC = () => {
  const { viewMode, currentDate } = useCalendarStore();
  const [selectedTime, setSelectedTime] = useState<Date | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);

  const handleTimeClick = (time: Date) => {
    setSelectedTime(time);
    setSelectedEvent(null);
    setIsModalOpen(true);
  };

  const handleEventClick = (event: any) => {
    setSelectedEvent(event);
    setSelectedTime(null);
    setIsModalOpen(true);
  };
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedTime(null);
    setSelectedEvent(null);
  };
  const hours = Array.from({ length: 24 }, (_, i) => i);

  return (
    <div className="mt-60">
      <HeaderComponent />

      {/* Calendar Grid */}
      <div className="grid grid-cols-8 gap-2 relative">
        {/* Time Labels Column */}
        <div className="border-r">
          {hours.map((hour) => (
            <div
              key={hour}
              className="h-20 border-b text-sm text-center text-gray-500"
            >
              {format(setHours(new Date(), hour), "ha")}
            </div>
          ))}
        </div>

        {viewMode === "day" && (
          <DayView
            date={currentDate}
            onTimeClick={handleTimeClick}
            onEventClick={handleEventClick}
          />
        )}

        {isModalOpen && (
          <AddEventModal
            selectedTime={selectedTime}
            onClose={closeModal}
            selectedEvent={selectedEvent}
          />
        )}
      </div>
    </div>
  );
};

export default Calendar;
