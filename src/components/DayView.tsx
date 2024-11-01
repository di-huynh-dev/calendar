import React, { useState } from 'react'
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
  const [draggedEvent, setDraggedEvent] = useState<any>(null)

  const handleDragStart = (event: any) => {
    setDraggedEvent(event)
  }

  const handleDragEnd = () => {
    setDraggedEvent(null)
  }

  const hours = Array.from({ length: 24 }, (_, i) => i)

  const handleClick = (hour: number) => {
    const selectedTime = dayjs(date).hour(hour).minute(0).second(0).toDate()
    onTimeClick(selectedTime)
  }

  const calculateEventPositions = (events: any) => {
    const filteredEvents = events.filter((event: any) => {
      const isMultiDay = !dayjs(event.start).isSame(event.end, 'day')
      return !event.allDay && !isMultiDay
    })

    const sortedEvents = filteredEvents.sort((a: any, b: any) => new Date(a.start).getTime() - new Date(b.start).getTime())

    const eventGroups: any[] = []
    let currentGroup: any[] = []

    sortedEvents.forEach((event: any) => {
      if (currentGroup.length === 0 || dayjs(event.start).isBefore(currentGroup[currentGroup.length - 1].end)) {
        currentGroup.push(event)
      } else {
        eventGroups.push(currentGroup)
        currentGroup = [event]
      }
    })

    if (currentGroup.length > 0) {
      eventGroups.push(currentGroup)
    }

    const positions = eventGroups.flatMap((group) => {
      const overlapOffset = 100 // Adjust this value to control the overlap amount

      return group.map((event: any, index: any) => {
        const startMinutes = dayjs(event.start).minute()
        const endMinutes = dayjs(event.end).diff(dayjs(event.start), 'minute')
        const top = (startMinutes / 60) * 100
        const height = (endMinutes / 60) * 100
        const left = index * overlapOffset

        return {
          ...event,
          left: `${left}px`,
          top: `${top}%`,
          height: `${height}%`,
          zIndex: index,
          width: `calc(100% - ${index * overlapOffset}px)`,
        }
      })
    })

    return positions
  }
  const eventPositions = calculateEventPositions(events.filter((event) => dayjs(event.start).isSame(date, 'day')))

  return (
    <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
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
                  position: 'absolute',
                  top: event.top,
                  left: event.left,
                  height: event.height,
                  width: event.width,
                  zIndex: draggedEvent && draggedEvent.id === event.id ? 999 : event.zIndex,
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
