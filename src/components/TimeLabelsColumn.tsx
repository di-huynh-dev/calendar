import React from 'react'
import { format, setHours } from 'date-fns'
import moment from 'moment-timezone'

interface TimeLabelsColumnProps {
  timeZone: string
}

const TimeLabelsColumn: React.FC<TimeLabelsColumnProps> = ({ timeZone }) => {
  const hours = Array.from({ length: 24 }, (_, i) => i)

  return (
    <div className="border-r">
      {hours.map((hour) => {
        const gmt7Time = setHours(new Date(), hour)
        const gmt7Formatted = format(gmt7Time, 'HH:00')
        return (
          <div className="flex items-center justify-around" key={hour}>
            {/* Converted time based on selected timeZone */}
            <div className="h-20 border-b text-sm text-center text-gray-500">{moment(gmt7Time).tz(timeZone).format('HH:00')}</div>
            <div className="h-20 border-b text-sm text-center text-gray-500">{gmt7Formatted}</div>
          </div>
        )
      })}
    </div>
  )
}

export default TimeLabelsColumn
