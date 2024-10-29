import dayjs from "dayjs";
import { useCalendarStore } from "../store/useCalendarStore";
import { format, startOfWeek, addDays, isSameDay } from "date-fns";

const WeekView = () => {
  const { events, currentDate } = useCalendarStore();
  const weekStart = startOfWeek(dayjs(currentDate).toDate(), {
    weekStartsOn: 1,
  });

  const hours = Array.from({ length: 24 }, (_, i) => i);

  return (
    <div>
      {Array.from({ length: 7 }).map((_, dayIndex) => {
        const day = addDays(weekStart, dayIndex);

        return <div key={dayIndex} className="border-r"></div>;
      })}
    </div>
  );
};

export default WeekView;
