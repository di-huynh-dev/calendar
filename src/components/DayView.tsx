import React, { useEffect, useState } from 'react'
import dayjs, { Dayjs } from 'dayjs'
import { useCalendarStore } from '../store/useCalendarStore'
import { DndContext } from '@dnd-kit/core'
import DraggableEvent from './DraggableEvent'
import { CurrentTimeIndicator } from './CurrentTimeIndicator'
import { HourBlock } from './HourBlock'
import useTimeline from '../hooks/useTimeline'
import { isSameDay } from 'date-fns'

interface DayViewProps {
  date: Dayjs
  onTimeClick: (time: { start: Date; end: Date }) => void
  onEventClick: (event: any) => void
  isModalOpen: boolean
}

const DayView: React.FC<DayViewProps> = ({ date, onTimeClick, onEventClick, isModalOpen }) => {
  const { currentDate, events } = useCalendarStore()
  const { currentHour, currentMinutes, currentPosition } = useTimeline()

  const [selectedBlocks, setSelectedBlocks] = useState<{ hour: number; quarter: number }[]>([])
  const [draggedEvent, setDraggedEvent] = useState<any>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState<{ hour: number; quarter: number } | null>(null)

  const hours = Array.from({ length: 24 }, (_, i) => i)

  // Clear selected blocks when modal is closed
  useEffect(() => {
    if (!isModalOpen) {
      setSelectedBlocks([])
    }
  }, [isModalOpen])

  /* Handle mouse select events start */
  const handleMouseDown = (hour: number, quarter: number) => {
    setSelectedBlocks([{ hour, quarter }])
    setDragStart({ hour, quarter })
    setIsDragging(true)
  }

  const handleMouseEnter = (hour: number, quarter: number) => {
    if (isDragging && dragStart) {
      const start = dragStart
      const end = { hour, quarter }

      const blocks = calculateSelectedBlocks(start, end)
      setSelectedBlocks(blocks)
    }
  }

  const calculateSelectedBlocks = (start: { hour: number; quarter: number }, end: { hour: number; quarter: number }) => {
    const blocks: { hour: number; quarter: number }[] = []

    const startHour = start.hour
    const startQuarter = start.quarter
    const endHour = end.hour
    const endQuarter = end.quarter

    // If the start and end time are in the same hour
    if (startHour === endHour) {
      for (let quarter = startQuarter; quarter <= endQuarter; quarter++) {
        blocks.push({ hour: startHour, quarter })
      }
    } else {
      // Add blocks from the start time to the end of that hour
      for (let quarter = startQuarter; quarter < 4; quarter++) {
        blocks.push({ hour: startHour, quarter })
      }

      // Add blocks for the whole hours in between
      for (let hour = startHour + 1; hour < endHour; hour++) {
        for (let quarter = 0; quarter < 4; quarter++) {
          blocks.push({ hour, quarter })
        }
      }

      // Add blocks from the beginning of the last hour to the end time
      for (let quarter = 0; quarter <= endQuarter; quarter++) {
        blocks.push({ hour: endHour, quarter })
      }
    }

    return blocks
  }

  const handleMouseUp = () => {
    if (isDragging) {
      setIsDragging(false)
      setDragStart(null)

      const startTime = dayjs(date)
        .hour(selectedBlocks[0].hour)
        .minute(selectedBlocks[0].quarter * 15)
        .second(0)
        .toDate()

      const endTime = dayjs(date)
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
  /* Calculate event position end */

  return (
    <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <div className="col-span-7 relative" onMouseUp={handleMouseUp}>
        {hours.map((hour) => (
          <HourBlock
            key={hour}
            onMouseDown={(quarter) => handleMouseDown(hour, quarter)}
            onMouseEnter={(quarter) => handleMouseEnter(hour, quarter)}
            isHighlighted={selectedBlocks.filter((block) => block.hour === hour).map((block) => block.quarter)}
          />
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

        {isSameDay(dayjs(currentDate).toDate(), new Date()) && (
          <CurrentTimeIndicator currentPosition={currentPosition} currentHour={currentHour} currentMinutes={currentMinutes} />
        )}
      </div>
    </DndContext>
  )
}

export default DayView
