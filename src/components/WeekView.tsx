import React from 'react'
import dayjs from 'dayjs'
import { useCalendarStore } from '../store/useCalendarStore'
import { startOfWeek, addDays, isSameDay } from 'date-fns'
import { DndContext } from '@dnd-kit/core'
import DraggableEvent from './DraggableEvent'
import useTimeline from '../hooks/useTimeline'
import { CurrentTimeIndicator } from './CurrentTimeIndicator'

interface WeekViewProps {
  onTimeClick: (time: Date) => void
  onEventClick: (event: any) => void
}

const calculateEventPositions = (events: any, overlapOffset: number = 20) => {
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
    return group.map((event: any, index: number) => {
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
        width: `calc(100% - ${overlapOffset * group.length}px)`,
      }
    })
  })

  return positions
}

const WeekView: React.FC<WeekViewProps> = ({ onTimeClick, onEventClick }) => {
  const { events, currentDate } = useCalendarStore()
  const { currentHour, currentMinutes, currentPosition } = useTimeline()
  const weekStart = startOfWeek(dayjs(currentDate).toDate(), { weekStartsOn: 0 })

  return (
    <DndContext>
      <div className="col-span-7">
        <div className="grid grid-cols-7">
          {Array.from({ length: 7 }).map((_, dayIndex) => {
            const currentDay = addDays(weekStart, dayIndex)
            const dayEvents = events.filter((event) => isSameDay(event.start, currentDay))
            const eventPositions = calculateEventPositions(dayEvents)

            return (
              <div key={dayIndex} className="border-r relative">
                <div className="grid grid-rows-24 h-full">
                  {Array.from({ length: 24 }).map((_, hourIndex) => {
                    const hourTime = dayjs(currentDay).hour(hourIndex).minute(0).second(0).toDate()
                    return (
                      <div
                        key={hourIndex}
                        className={`border-t h-20 ${isSameDay(currentDay, new Date()) ? 'bg-blue-50' : ''}`}
                        onClick={() => onTimeClick(hourTime)}
                      >
                        <div className="flex">
                          {eventPositions
                            .filter((event: any) => dayjs(event.start).hour() === hourIndex)
                            .map((event: any) => (
                              <div key={event.id}>
                                <DraggableEvent
                                  event={event}
                                  style={{
                                    width: event.width,
                                    left: event.left,
                                    fontSize: '0.75rem',
                                  }}
                                  handleClick={() => onEventClick(event)}
                                />
                              </div>
                            ))}
                        </div>
                      </div>
                    )
                  })}
                </div>
                {isSameDay(currentDay, new Date()) && (
                  <CurrentTimeIndicator currentPosition={currentPosition} currentHour={currentHour} currentMinutes={currentMinutes} />
                )}
              </div>
            )
          })}
        </div>
      </div>
    </DndContext>
  )
}

export default WeekView
