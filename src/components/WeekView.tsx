import dayjs from "dayjs";
import { useCalendarStore } from "../store/useCalendarStore";
import { format, startOfWeek, addDays, isSameDay } from "date-fns";

const WeekView = () => {
  const { events, currentDate } = useCalendarStore();
  const weekStart = startOfWeek(dayjs(currentDate).toDate(), {
    weekStartsOn: 1,
  });

  return (
    <div className="col">
      <div className="grid grid-cols-7">
        {Array.from({ length: 7 }).map((_, dayIndex) => {
          return <div key={dayIndex} className="border-r"></div>;
        })}
      </div>
    </div>
  );
};

export default WeekView;
