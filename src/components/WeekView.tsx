import React, { useEffect, useState } from 'react'
import dayjs, { Dayjs } from 'dayjs'
import { useCalendarStore } from '../store/useCalendarStore'
import { startOfWeek, addDays, isSameDay } from 'date-fns'
import { DndContext } from '@dnd-kit/core'
import DraggableEvent from './DraggableEvent'
import useTimeline from '../hooks/useTimeline'
import { CurrentTimeIndicator } from './CurrentTimeIndicator'
import { HourBlock } from './HourBlock'

interface WeekViewProps {
  date: Dayjs
  onTimeClick: (time: { start: Date; end: Date }) => void
  onEventClick: (event: any) => void
  isModalOpen: boolean
}

const WeekView: React.FC<WeekViewProps> = ({ date, onTimeClick, isModalOpen, onEventClick }) => {
  const { currentDate, events } = useCalendarStore()
  const { currentHour, currentMinutes, currentPosition } = useTimeline()

  const weekStart = startOfWeek(dayjs(currentDate).toDate(), { weekStartsOn: 0 })
  const [selectedBlocks, setSelectedBlocks] = useState<{ hour: number; quarter: number; day: Date }[]>([])

  const [draggedEvent, setDraggedEvent] = useState<any>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState<{ hour: number; quarter: number; day: Date } | null>(null)

  const hours = Array.from({ length: 24 }, (_, i) => i)

  // Clear selected blocks when modal is closed
  useEffect(() => {
    if (!isModalOpen) {
      setSelectedBlocks([])
    }
  }, [isModalOpen])

  /* Handle mouse select events start */
  const handleMouseDown = (hour: number, quarter: number, currentDay: Date) => {
    setSelectedBlocks([{ hour, quarter, day: currentDay }])
    setDragStart({ hour, quarter, day: currentDay })
    setIsDragging(true)
  }

  const handleMouseEnter = (hour: number, quarter: number, currentDay: Date) => {
    if (isDragging && dragStart) {
      const start = dragStart
      const end = { hour, quarter }

      // Kiểm tra nếu ngày hiện tại trùng với ngày đã chọn trước đó
      if (isSameDay(currentDay, dragStart.day)) {
        const blocks = calculateSelectedBlocks(start, end, currentDay)
        setSelectedBlocks(blocks)
      }
    }
  }

  const calculateSelectedBlocks = (start: { hour: number; quarter: number }, end: { hour: number; quarter: number }, currentDay: Date) => {
    const blocks: { hour: number; quarter: number; day: Date }[] = []

    const startHour = start.hour
    const startQuarter = start.quarter
    const endHour = end.hour
    const endQuarter = end.quarter

    // Add blocks logic similar to your original implementation
    // Make sure to include `currentDay` for each block

    if (startHour === endHour) {
      for (let quarter = startQuarter; quarter <= endQuarter; quarter++) {
        blocks.push({ hour: startHour, quarter, day: currentDay })
      }
    } else {
      for (let quarter = startQuarter; quarter < 4; quarter++) {
        blocks.push({ hour: startHour, quarter, day: currentDay })
      }

      for (let hour = startHour + 1; hour < endHour; hour++) {
        for (let quarter = 0; quarter < 4; quarter++) {
          blocks.push({ hour, quarter, day: currentDay })
        }
      }

      for (let quarter = 0; quarter <= endQuarter; quarter++) {
        blocks.push({ hour: endHour, quarter, day: currentDay })
      }
    }

    return blocks
  }

  const handleMouseUp = () => {
    if (isDragging && selectedBlocks.length > 0) {
      setIsDragging(false)
      setDragStart(null)

      const selectedDay = selectedBlocks[0].day // Retrieve the correct day from the selected blocks

      const startTime = dayjs(selectedDay)
        .hour(selectedBlocks[0].hour)
        .minute(selectedBlocks[0].quarter * 15)
        .second(0)
        .toDate()

      const endTime = dayjs(selectedDay)
        .hour(selectedBlocks[selectedBlocks.length - 1].hour)
        .minute((selectedBlocks[selectedBlocks.length - 1].quarter + 1) * 15)
        .second(0)
        .toDate()

      onTimeClick({ start: startTime, end: endTime })
    }
  }

  /* Handle mouse select events end */

  /* Handle drag event start */
  const handleDragStart = (event: any) => {
    setDraggedEvent(event)
  }

  const handleDragEnd = () => {
    setDraggedEvent(null)
  }
  /* Handle drag event end */

  /* Calculate event position start */
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
      const overlapOffset = 20 // Adjust this value to control the overlap amount

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
          width: `calc(90% - ${index * overlapOffset}px)`,
        }
      })
    })

    return positions
  }

  /* Calculate event position end */

  return (
    <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <div className="col-span-7">
        <div className="grid grid-cols-7">
          {Array.from({ length: 7 }).map((_, dayIndex) => {
            const currentDay = addDays(weekStart, dayIndex)
            const dayEvents = events.filter((event) => isSameDay(event.start, currentDay))
            const eventPositions = calculateEventPositions(dayEvents)

            return (
              <div key={dayIndex} className="border-r relative" onMouseUp={handleMouseUp}>
                {hours.map((hour) => (
                  <HourBlock
                    key={hour}
                    onMouseDown={(quarter) => handleMouseDown(hour, quarter, currentDay)}
                    onMouseEnter={(quarter) => handleMouseEnter(hour, quarter, currentDay)}
                    isHighlighted={selectedBlocks
                      .filter((block) => block.hour === hour && isSameDay(block.day, currentDay))
                      .map((block) => block.quarter)}
                  />
                ))}
                {
                  <div className="flex">
                    {eventPositions.map((event: any) => (
                      <div key={event.id}>
                        <DraggableEvent
                          key={event.id}
                          event={event}
                          style={{
                            position: 'absolute',
                            top: event.top,
                            left: event.left,
                            height: event.height,
                            width: event.width,
                            zIndex: draggedEvent && draggedEvent.id === event.id ? 999 : event.zIndex,
                          }}
                          handleClick={() => onEventClick(event)}
                        />
                      </div>
                    ))}
                  </div>
                }
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
