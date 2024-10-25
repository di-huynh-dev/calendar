// DayView.tsx
import React from "react";
import { Dayjs } from "dayjs";
import { useCalendarStore } from "../store/useCalendarStore";

interface DayViewProps {
  date: Dayjs;
}

const DayView: React.FC<DayViewProps> = ({ date }) => {
  const { events } = useCalendarStore();

  const eventsForDay = events.filter((event) => {
    const eventStart = new Date(event.start);
    const eventEnd = new Date(event.end);
    return (
      eventStart.toDateString() === date.toDate().toDateString() ||
      eventEnd.toDateString() === date.toDate().toDateString() ||
      (eventStart < date.toDate() && eventEnd > date.toDate())
    );
  });

  return (
    <div>
      <h2>Day View for {date.format("DD/MM/YYYY")}</h2>
      {eventsForDay.length > 0 ? (
        <div className="event-list">
          {eventsForDay.map((event) => (
            <div key={event.id} className="event-item border p-2 mb-2 rounded">
              <h3 className="font-bold">{event.title}</h3>
              <p>{event.description}</p>
              <p>
                {new Date(event.start).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}{" "}
                -{" "}
                {new Date(event.end).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
              <p>{event.location}</p>
            </div>
          ))}
        </div>
      ) : (
        <p>Không có sự kiện nào trong ngày này.</p>
      )}
    </div>
  );
};

export default DayView;
