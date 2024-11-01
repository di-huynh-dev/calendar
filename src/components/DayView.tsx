import React, { useEffect, useState } from 'react'
import dayjs, { Dayjs } from 'dayjs'
import { useCalendarStore } from '../store/useCalendarStore'
import { DndContext } from '@dnd-kit/core'
import DraggableEvent from './DraggableEvent'
import { CurrentTimeIndicator } from './CurrentTimeIndicator'
import { HourBlock } from './HourBlock'
import useTimeline from '../hooks/useTimeline'

interface DayViewProps {
  date: Dayjs
  onTimeClick: (time: Date) => void
  onEventClick: (event: any) => void
}

const DayView: React.FC<DayViewProps> = ({ date, onTimeClick, onEventClick }) => {
  const { currentDate, events } = useCalendarStore()
  const { currentHour, currentMinutes, currentPosition } = useTimeline()

  const hours = Array.from({ length: 24 }, (_, i) => i)

  const handleClick = (hour: number) => {
    const selectedTime = dayjs(date).hour(hour).minute(0).second(0).toDate()
    onTimeClick(selectedTime)
  }

  const calculateEventPositions = (events: any) => {
    const filteredEvents = events.filter(
      (event: any) => dayjs(event.start).isSame(currentDate, 'day') && dayjs(event.end).isSame(currentDate, 'day') && !event.allDay,
    )

    const eventPositions = filteredEvents.map((event: any, index: number, allEvents: any[]) => {
      const overlappingEvents = allEvents.filter((e) => dayjs(e.start).isBefore(event.end) && dayjs(e.end).isAfter(event.start))

      const eventWidth = 100 / overlappingEvents.length
      const eventIndex = overlappingEvents.findIndex((e) => e.id === event.id)

      return {
        ...event,
        width: `${eventWidth}%`,
        left: `${eventIndex * eventWidth}%`,
      }
    })

    return eventPositions
  }

  const eventPositions = calculateEventPositions(events.filter((event) => dayjs(event.start).isSame(date, 'day')))

  return (
    <DndContext>
      <div className="col-span-7 relative">
        {hours.map((hour) => (
          <HourBlock key={hour} hour={hour} onClick={handleClick} />
        ))}
        <div className="flex">
          {eventPositions.map((event: any) => (
            <div key={event.id}>
              <DraggableEvent
                key={event.id}
                event={event}
                handleClick={onEventClick}
                style={{
                  width: event.width,
                  left: event.left,
                }}
              />
            </div>
          ))}
        </div>
        {dayjs(currentDate).isSame(date, 'day') && (
          <CurrentTimeIndicator currentPosition={currentPosition} currentHour={currentHour} currentMinutes={currentMinutes} />
        )}
      </div>
    </DndContext>
  )
}

export default DayView
