import React, { useEffect, useState } from "react";
import dayjs, { Dayjs } from "dayjs";
import { useCalendarStore } from "../store/useCalendarStore";
import { DndContext } from "@dnd-kit/core";
import DraggableEvent from "./DraggableEvent";
import { CurrentTimeIndicator } from "./CurrentTimeIndicator";
import { HourBlock } from "./HourBlock";

interface DayViewProps {
  date: Dayjs;
  onTimeClick: (time: Date) => void;
}

const DayView: React.FC<DayViewProps> = ({ date, onTimeClick }) => {
  const { events, updateEventTime } = useCalendarStore();
  const [currentTime, setCurrentTime] = useState<Date>(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  const hours = Array.from({ length: 24 }, (_, i) => i);

  const handleClick = (hour: number) => {
    const selectedTime = dayjs(date).hour(hour).minute(0).second(0).toDate();
    onTimeClick(selectedTime);
  };

  const currentHour = currentTime.getHours();
  const currentMinutes = currentTime.getMinutes();
  const currentPosition =
    ((currentHour * 60 + currentMinutes) / (24 * 60)) * 100;

  return (
    <DndContext>
      <div className="col-span-7 relative">
        {hours.map((hour) => (
          <HourBlock key={hour} hour={hour} onClick={handleClick} />
        ))}
        <CurrentTimeIndicator
          currentPosition={currentPosition}
          currentHour={currentHour}
          currentMinutes={currentMinutes}
        />

        {events
          .filter((event) => dayjs(event.start).isSame(date, "day"))
          .map((event, index, filteredEvents) => {
            // Xác định các sự kiện trùng nhau
            const overlappingEvents = filteredEvents.filter(
              (e) =>
                dayjs(e.start).isBefore(event.end) &&
                dayjs(e.end).isAfter(event.start)
            );
            const eventWidth = 100 / overlappingEvents.length;
            const eventIndex = overlappingEvents.findIndex(
              (e) => e.id === event.id
            );

            return (
              <DraggableEvent
                key={event.id}
                event={event}
                style={{
                  width: `${eventWidth}%`,
                  left: `${eventIndex * eventWidth}%`,
                }}
                onDrop={(newStartTime: Date) => {
                  const duration =
                    new Date(event.end).getTime() -
                    new Date(event.start).getTime();
                  const newEndTime = new Date(
                    newStartTime.getTime() + duration
                  );
                  updateEventTime(event.id, newStartTime, newEndTime);
                }}
              />
            );
          })}
      </div>
    </DndContext>
  );
};

export default DayView;
