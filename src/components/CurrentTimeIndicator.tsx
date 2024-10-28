import React from "react";

interface CurrentTimeIndicatorProps {
  currentPosition: number;
  currentHour: number;
  currentMinutes: number;
}

export const CurrentTimeIndicator: React.FC<CurrentTimeIndicatorProps> = ({
  currentPosition,
  currentHour,
  currentMinutes,
}) => {
  return (
    <div
      className="absolute left-0 w-full h-0.5 bg-red-500"
      style={{ top: `${currentPosition}%` }}
      title={`Thời gian hiện tại: ${currentHour}:${
        currentMinutes < 10 ? `0${currentMinutes}` : currentMinutes
      }`}
    ></div>
  );
};
