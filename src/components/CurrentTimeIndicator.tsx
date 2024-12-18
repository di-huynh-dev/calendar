import { Tooltip } from 'antd'
import React from 'react'

interface CurrentTimeIndicatorProps {
  currentPosition: number
  currentHour: number
  currentMinutes: number
}

export const CurrentTimeIndicator: React.FC<CurrentTimeIndicatorProps> = ({ currentPosition, currentHour, currentMinutes }) => {
  return (
    <Tooltip title={`Thời gian hiện tại: ${currentHour}:${currentMinutes < 10 ? `0${currentMinutes}` : currentMinutes}`}>
      <div className="absolute left-0 w-full h-0.5 bg-red-500 flex items-center z-[9]" style={{ top: `${currentPosition}%` }}>
        <span className="absolute left-[-60px] text-xs text-red-500">
          {currentHour}:{currentMinutes < 10 ? `0${currentMinutes}` : currentMinutes}
        </span>
      </div>
    </Tooltip>
  )
}
