// WeekView.tsx
import React from "react";
import { Dayjs } from "dayjs";

interface WeekViewProps {
  startOfWeek: Dayjs;
}

const WeekView: React.FC<WeekViewProps> = ({ startOfWeek }) => {
  const daysInWeek = Array.from({ length: 7 }, (_, index) =>
    startOfWeek.add(index, "day")
  );

  return (
    <div className="week-view grid grid-cols-7 gap-4">
      {daysInWeek.map((day) => (
        <div key={day.format("YYYY-MM-DD")} className="border p-2">
          <h3 className="font-bold">{day.format("dddd, MMMM D")}</h3>
          {/* Render các sự kiện trong ngày */}
          <div>
            {/* Các sự kiện của ngày hiện tại có thể được hiển thị ở đây */}
          </div>
        </div>
      ))}
    </div>
  );
};

export default WeekView;
