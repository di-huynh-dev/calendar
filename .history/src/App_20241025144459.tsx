import React from "react";

const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const hours = Array.from({ length: 24 }, (_, i) => `${i}:00`);

function App() {
  return (
    <div className="flex flex-col h-full">
      {/* Header: Days of the week */}
      <div className="grid grid-cols-8 bg-gray-100 border-b border-gray-300">
        <div className="p-2">Time</div>
        {days.map((day, index) => (
          <div key={index} className="p-2 text-center font-bold">
            {day}
          </div>
        ))}
      </div>

      {/* Body: Hours and time slots */}
      <div className="grid grid-cols-8 flex-1 overflow-y-auto">
        {hours.map((hour, i) => (
          <React.Fragment key={i}>
            {/* Column for time labels */}
            <div className="border-r border-gray-300 p-2 text-center">
              {hour}
            </div>
            {/* Columns for each day */}
            {Array(7)
              .fill(0)
              .map((_, j) => (
                <div
                  key={`${i}-${j}`}
                  className="border border-gray-300 h-16 hover:bg-blue-50"
                >
                  {/* Event Placeholder */}
                </div>
              ))}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}

export default App;
