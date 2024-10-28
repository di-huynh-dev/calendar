import React from "react";
import { format, setHours, setMinutes } from "date-fns";
import { useState } from "react";
import HeaderComponent from "./components/Header";
import { useCalendarStore } from "./store/useCalendarStore";
import DayView from "./components/DayView";
import AddEventModal from "./components/AddEventModal";

const Calendar: React.FC = () => {
  const { viewMode, currentDate } = useCalendarStore();
  const [selectedTime, setSelectedTime] = useState<Date | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleTimeClick = (time: Date) => {
    setSelectedTime(time);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedTime(null);
  };

  const [events, setEvents] = useState([
    {
      id: 1,
      title: "Everyday",
      start: setHours(setMinutes(new Date(), 30), 0),
      end: setHours(setMinutes(new Date(), 30), 1),
    },
  ]);

  const hours = Array.from({ length: 24 }, (_, i) => i);

  const getEventStyle = (event: any) => {
    const startHour = event.start.getHours();
    const startMinute = event.start.getMinutes();
    const duration =
      (event.end.getTime() - event.start.getTime()) / (1000 * 60); // Duration in minutes

    return {
      top: `${startHour * 60 + startMinute}px`,
      height: `${duration}px`,
    };
  };

  return (
    <div className="mt-36">
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

        {/* Days Columns */}
        {/* {days.map((day, dayIndex) => (
          <div key={dayIndex} className="border-r relative">
            {hours.map((hour) => (
              <div key={hour} className="h-20 border-b"></div>
`            ))}

            {events.map((event) => {
              if (
                format(event.start, "yyyy-MM-dd") === format(day, "yyyy-MM-dd")
              ) {
                return (
                  <div
                    key={event.id}
                    className="absolute left-2 right-2 bg-blue-100 border border-blue-500 text-xs text-blue-700 rounded-lg px-2 py-1"
                    style={getEventStyle(event)}
                  >
                    {event.title}
                    <br />
                    {format(event.start, "hh:mm a")} -{" "}
                    {format(event.end, "hh:mm a")}
                  </div>
                );
              }
              return null;
            })}
          </div>
        ))} */}
        {viewMode === "day" && (
          <DayView date={currentDate} onTimeClick={handleTimeClick} />
        )}

        {isModalOpen && (
          <AddEventModal selectedTime={selectedTime} onClose={closeModal} />
        )}
      </div>
    </div>
  );
};

export default Calendar;
