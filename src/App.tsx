// Calendar.tsx
import React from "react";
import { useCalendarStore } from "./store/useCalendarStore";
import DayView from "./components/DayView";
import WeekView from "./components/WeekView";
import MonthView from "./components/MonthView";
import YearView from "./components/YearView";
import Header from "./components/Header";

const Calendar: React.FC = () => {
  const { viewMode, currentDate } = useCalendarStore();

  return (
    <>
      <Header />

      <div className="calendar-view">
        {viewMode === "day" && <DayView date={currentDate} />}
        {viewMode === "week" && (
          <WeekView startOfWeek={currentDate.startOf("week")} />
        )}
        {viewMode === "month" && (
          <MonthView startOfMonth={currentDate.startOf("month")} />
        )}
        {viewMode === "year" && <YearView year={currentDate.year()} />}
      </div>
    </>
  );
};

export default Calendar;
