import React, { useState, useEffect } from 'react'
import { useDraggable } from '@dnd-kit/core'
import dayjs from 'dayjs'
import { Video } from 'lucide-react'
import { useCalendarStore } from '../store/useCalendarStore'
import { Tooltip } from 'antd'

interface Event {
  id: string
  title: string
  start: Date
  end: Date
  width: string
  left: string
  colorTag: string
  googleMeetLink: string
}

interface DraggableEventProps {
  event: Event
  style?: React.CSSProperties
  handleClick: (event: Event) => void // Updated type for clarity
}

const DraggableEvent: React.FC<DraggableEventProps> = ({ event, style, handleClick }) => {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: event.id,
  })
  const { viewMode, updateEventTime } = useCalendarStore()
  const [newStartTime, setNewStartTime] = useState<Date>(event.start)
  const [isDragging, setIsDragging] = useState(false)
  const isMoreThan5Hours = dayjs(event.end).diff(dayjs(event.start), 'hour') > 5

  // Function to round to the nearest quarter hour
  const roundToNearestQuarterHour = (date: Date): Date => {
    const minutes = date.getMinutes()
    const roundedMinutes = Math.round(minutes / 15) * 15
    date.setMinutes(roundedMinutes)
    date.setSeconds(0)
    date.setMilliseconds(0)
    return date
  }

  useEffect(() => {
    if (transform) {
      setIsDragging(true)

      const offsetY = transform.y

      // Define pixels per 15-minute interval
      const pixelsPer15Minutes = 20

      // Calculate minutes to add based on 15-minute intervals
      const minutesToAdd = Math.round(offsetY / pixelsPer15Minutes) * 15

      // Calculate the new start time, rounded to the nearest 15 minutes
      const updatedStartTime = dayjs(event.start).add(minutesToAdd, 'minute').toDate()

      // Ensure updatedStartTime stays within bounds
      const minTime = new Date(event.start)
      minTime.setHours(0, 0, 0, 0)
      const maxTime = new Date(event.start)
      maxTime.setHours(23, 59, 59, 999)

      if (updatedStartTime >= minTime && updatedStartTime <= maxTime) {
        setNewStartTime(updatedStartTime)
      }
    }
  }, [transform, event.start])

  const startTime = new Date(event.start)
  const endTime = new Date(event.end)

  // Return null if times are invalid
  if (isNaN(startTime.getTime()) || isNaN(endTime.getTime())) {
    return null
  }

  const handleDrop = () => {
    setIsDragging(false)

    // // Round to the nearest quarter hour for the dropped time
    const roundedNewStartTime = roundToNearestQuarterHour(newStartTime)

    // // Calculate the duration based on the original event times
    const duration = endTime.getTime() - startTime.getTime()
    const newEndTime = new Date(roundedNewStartTime.getTime() + duration)

    // // Update the event with new times
    updateEventTime(event.id, roundedNewStartTime, newEndTime)
  }

  const handleClickEvent = () => {
    if (!isDragging) {
      handleClick(event)
    }
  }

  const calculatePositionFromTime = (time: Date): number => {
    const hours = time.getHours()
    const minutes = time.getMinutes()
    return ((hours * 60 + minutes) / (24 * 60)) * 100
  }

  const calculateEventHeight = (start: Date, end: Date): number => {
    const duration = (end.getTime() - start.getTime()) / (60 * 60 * 1000)
    return (duration / 24) * 100
  }

  const eventContent = (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      onPointerUp={handleDrop}
      onClick={handleClickEvent}
      style={{
        ...style,
        top: `${calculatePositionFromTime(startTime)}%`,
        height: `${calculateEventHeight(startTime, endTime)}%`,
        width: event.width,
        left: event.left,
        transform: transform ? `translateY(${transform.y}px)` : undefined,
        position: 'absolute',
        color: '#fcfdff',
        textAlign: 'left',
        borderRadius: '0.75rem',
        padding: '0.5rem',
        border: '1px solid #ffffff',
        backgroundColor: event.colorTag ? event.colorTag : '#79a7f3',
      }}
    >
      <div className={`text-md ${endTime.getTime() - startTime.getTime() < 31 * 60 * 1000 ? 'flex items-center gap-2 text-xs' : ''}`}>
        {
          <>
            <div className="flex gap-2 items-center">
              <p>
                {dayjs(event.start).format('HH:mm')} - {dayjs(event.end).format('HH:mm')}
              </p>
              <p>{event.googleMeetLink && viewMode !== 'week' && <Video size={16} />}</p>
            </div>
            <p>{event.title ? event.title : '(Không có tiêu đề)'}</p>
          </>
        }
      </div>
    </div>
  )

  return viewMode === 'week' || isMoreThan5Hours ? (
    <Tooltip
      placement="left"
      color="#3b82f6"
      title={
        <>
          <div className="flex gap-2 items-center">
            <p>
              {dayjs(event.start).format('HH:mm')} -{' '}
              {dayjs(event.start)
                .add(endTime.getTime() - startTime.getTime(), 'millisecond')
                .format('HH:mm')}
            </p>
            <p>{event.googleMeetLink && <Video size={16} />}</p>
          </div>
          <p>{event.title ? event.title : '(Không có tiêu đề)'}</p>
        </>
      }
    >
      {eventContent}
    </Tooltip>
  ) : (
    eventContent
  )
}

export default DraggableEvent
