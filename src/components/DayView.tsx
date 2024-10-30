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
  onEventClick: (event: any) => void;
}

const DayView: React.FC<DayViewProps> = ({
  date,
  onTimeClick,
  onEventClick,
}) => {
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

  const calculateEventPositions = (events: any) => {
    const filteredEvents = events.filter((event: any) => !event.allDay);

    const eventPositions = filteredEvents.map(
      (event: any, index: number, allEvents: any[]) => {
        const overlappingEvents = allEvents.filter(
          (e) =>
            dayjs(e.start).isBefore(event.end) &&
            dayjs(e.end).isAfter(event.start)
        );

        const eventWidth = 100 / overlappingEvents.length;
        const eventIndex = overlappingEvents.findIndex(
          (e) => e.id === event.id
        );

        return {
          ...event,
          width: `${eventWidth}%`,
          left: `${eventIndex * eventWidth}%`,
        };
      }
    );

    return eventPositions;
  };

  const eventPositions = calculateEventPositions(
    events.filter((event) => dayjs(event.start).isSame(date, "day"))
  );

  return (
    <DndContext>
      <div className="col-span-7 relative">
        {hours.map((hour) => (
          <HourBlock key={hour} hour={hour} onClick={handleClick} />
        ))}
        <div className="flex">
          {eventPositions.map((event: any) => (
            <>
              <div key={event.id} onPointerUp={() => onEventClick(event)}>
                <DraggableEvent
                  key={event.id}
                  event={event}
                  style={{
                    width: event.width,
                    left: event.left,
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
              </div>
            </>
          ))}
        </div>
        <CurrentTimeIndicator
          currentPosition={currentPosition}
          currentHour={currentHour}
          currentMinutes={currentMinutes}
        />
      </div>
    </DndContext>
  );
};

export default DayView;
