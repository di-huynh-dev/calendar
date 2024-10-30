import dayjs from "dayjs";
import { useCalendarStore } from "../store/useCalendarStore";
import { startOfWeek, addDays, isSameDay } from "date-fns";
import { DndContext } from "@dnd-kit/core";
import DraggableEvent from "./DraggableEvent";

const calculateEventPositions = (events: any) => {
  const filteredEvents = events.filter((event: any) => !event.allDay);

  const sortedEvents = filteredEvents.sort(
    (a: any, b: any) =>
      new Date(a.start).getTime() - new Date(b.start).getTime()
  );

  const positions = sortedEvents.map(
    (event: any, index: number, allEvents: any[]) => {
      const overlappingEvents = allEvents.filter(
        (e) =>
          dayjs(e.start).isBefore(event.end) &&
          dayjs(e.end).isAfter(event.start)
      );

      const eventWidth = 100 / overlappingEvents.length;
      const eventIndex = overlappingEvents.findIndex((e) => e.id === event.id);

      // Tính `top` và `height` dựa trên thời gian bắt đầu và kết thúc
      const startMinutes = dayjs(event.start).minute();
      const endMinutes = dayjs(event.end).diff(dayjs(event.start), "minute");
      const top = (startMinutes / 60) * 100;
      const height = (endMinutes / 60) * 100;

      return {
        ...event,
        width: `${eventWidth}%`,
        left: `${eventIndex * eventWidth}%`,
        top: `${top}%`,
        height: `${height}%`,
      };
    }
  );

  return positions;
};

const WeekView = () => {
  const { events, currentDate, updateEventTime } = useCalendarStore();
  const weekStart = startOfWeek(dayjs(currentDate).toDate(), {
    weekStartsOn: 0,
  });

  return (
    <DndContext>
      <div className="col-span-7 ">
        <div className="grid grid-cols-7">
          {Array.from({ length: 7 }).map((_, dayIndex) => {
            const currentDay = addDays(weekStart, dayIndex);

            const dayEvents = events.filter((event) =>
              isSameDay(event.start, currentDay)
            );

            const eventPositions = calculateEventPositions(dayEvents);

            return (
              <div key={dayIndex} className="border-r p-1 relative">
                <div className="grid grid-rows-24 h-full">
                  {Array.from({ length: 24 }).map((_, hourIndex) => {
                    return (
                      <div
                        key={hourIndex}
                        className={`border-t h-20 ${
                          isSameDay(currentDay, new Date()) ? "bg-blue-50" : ""
                        }`}
                      >
                        <div className="flex">
                          {eventPositions
                            .filter(
                              (event: any) =>
                                dayjs(event.start).hour() === hourIndex
                            )
                            .map((event: any) => (
                              <DraggableEvent
                                key={event.id}
                                event={event}
                                style={{
                                  width: event.width,
                                  left: event.left,
                                  fontSize: "0.75rem",
                                }}
                                onDrop={(newStartTime: Date) => {
                                  const duration =
                                    new Date(event.end).getTime() -
                                    new Date(event.start).getTime();
                                  const newEndTime = new Date(
                                    newStartTime.getTime() + duration
                                  );
                                  updateEventTime(
                                    event.id,
                                    newStartTime,
                                    newEndTime
                                  );
                                }}
                              />
                            ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </DndContext>
  );
};

export default WeekView;
