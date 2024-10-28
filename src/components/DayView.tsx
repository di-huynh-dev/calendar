import React from "react";
import { Dayjs } from "dayjs";
import { useCalendarStore } from "../store/useCalendarStore";

interface DayViewProps {
  date: Dayjs;
  onTimeClick: (time: Date) => void;
}

const DayView: React.FC<DayViewProps> = ({ date, onTimeClick }) => {
  const { events } = useCalendarStore();

  const hours = Array.from({ length: 24 }, (_, i) => i);

  const handleClick = (hour: number) => {
    const selectedTime = date.hour(hour).minute(0).second(0).toDate();
    onTimeClick(selectedTime);
  };

  return (
    <div className="col-span-7">
      {hours.map((hour) => (
        <div
          key={hour}
          className="h-20 border-b text-sm text-center text-gray-500 cursor-pointer"
          onClick={() => handleClick(hour)}
        ></div>
      ))}
    </div>
  );
};

export default DayView;
