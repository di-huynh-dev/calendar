// MonthView.tsx
import React from "react";
import { Dayjs } from "dayjs";

interface MonthViewProps {
  startOfMonth: Dayjs;
}

const MonthView: React.FC<MonthViewProps> = ({ startOfMonth }) => {
  const startDay = startOfMonth.startOf("month").day();
  const weeks = [];

  let currentDay = startOfMonth.startOf("month").subtract(startDay, "day");
  for (let week = 0; week < 6; week++) {
    const daysInWeek = [];
    for (let day = 0; day < 7; day++) {
      daysInWeek.push(currentDay);
      currentDay = currentDay.add(1, "day");
    }
    weeks.push(daysInWeek);
  }

  return (
    <div className="month-view">
      <div className="grid grid-cols-7">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <div key={day} className="font-bold">
            {day}
          </div>
        ))}
      </div>
      {weeks.map((week, index) => (
        <div key={index} className="grid grid-cols-7">
          {week.map((day) => (
            <div key={day.format("YYYY-MM-DD")} className="border p-2">
              <h3>{day.date()}</h3>
              {/* Render các sự kiện trong ngày */}
              <div>
                {/* Các sự kiện của ngày hiện tại có thể được hiển thị ở đây */}
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default MonthView;
