import React, { useState, useEffect } from 'react'
import { useDraggable } from '@dnd-kit/core'
import dayjs from 'dayjs'
import { Video } from 'lucide-react'
import { useCalendarStore } from '../store/useCalendarStore'
import { Tooltip } from 'antd'
import { Event } from '../types/event.type'

interface DraggableEventProps {
  event: Event
  style?: React.CSSProperties
  handleClick: (event: Event) => void
}

const DraggableEvent: React.FC<DraggableEventProps> = ({ event, style, handleClick }) => {
  const [isResizing, setIsResizing] = useState(false)
  const [newStartTime, setNewStartTime] = useState<Date>(event.start)
  const [isDragging, setIsDragging] = useState(false)

  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: event.id,
    disabled: isResizing,
  })

  const { viewMode, updateEventTime } = useCalendarStore()

  const isMoreThan5Hours = dayjs(event.end).diff(dayjs(event.start), 'hour') > 5

  const roundToNearestQuarterHour = (date: Date): Date => {
    const minutes = date.getMinutes()
    const roundedMinutes = Math.round(minutes / 15) * 15
    date.setMinutes(roundedMinutes)
    date.setSeconds(0)
    date.setMilliseconds(0)
    return date
  }

  useEffect(() => {
    if (transform && !isResizing) {
      setIsDragging(true)

      const offsetY = transform.y
      const pixelsPer15Minutes = 20
      const minutesToAdd = Math.round(offsetY / pixelsPer15Minutes) * 15

      const updatedStartTime = dayjs(event.start).add(minutesToAdd, 'minute').toDate()

      const minTime = new Date(event.start)
      minTime.setHours(0, 0, 0, 0)
      const maxTime = new Date(event.start)
      maxTime.setHours(23, 59, 59, 999)

      if (updatedStartTime >= minTime && updatedStartTime <= maxTime) {
        setNewStartTime(updatedStartTime)
      }
    }
    return () => {
      setIsDragging(false)
    }
  }, [transform, event.start])

  const handleDrop = () => {
    setIsDragging(false)
    const roundedNewStartTime = roundToNearestQuarterHour(newStartTime)
    const duration = new Date(event.end).getTime() - new Date(event.start).getTime()
    const newEndTime = new Date(roundedNewStartTime.getTime() + duration)
    updateEventTime(event.id, roundedNewStartTime, newEndTime)
  }

  const handleClickEvent = () => {
    if (!isDragging && !isResizing) {
      handleClick(event)
    }
  }

  const eventContent = (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      onPointerUp={handleDrop}
      onClick={(e) => {
        e.stopPropagation()
        handleClickEvent()
      }}
      style={{
        ...style,
        top: `${calculatePositionFromTime(event.start)}%`,
        height: `${calculateEventHeight(event.start, event.end)}%`,
        width: event.width,
        left: event.left,
        transform: transform ? `translateY(${transform.y}px)` : undefined,
        position: 'absolute',
        color: '#fcfdff',
        textAlign: 'left',
        borderRadius: '0.75rem',
        padding: '0.5rem',
        border: '1px solid #ffffff',
        zIndex: isDragging ? 8 : 1,
        backgroundColor: isDragging ? 'rgba(121, 167, 243, 0.5)' : event.colorTag || '#79a7f3',
        boxShadow: isDragging ? '0px 4px 12px rgba(19, 19, 19, 0.15)' : 'none',
      }}
    >
      <div className={`text-md ${viewMode !== 'week' ? '' : 'flex items-center gap-2 text-xs'}`}>
        <div className="flex gap-2 items-center">
          <p>
            {dayjs(event.start).format('HH:mm')} - {dayjs(event.end).format('HH:mm')}
          </p>
          <p>{event.googleMeetLink && viewMode !== 'week' && <Video size={16} />}</p>
        </div>
        <p>{event.title || '(Không có tiêu đề)'}</p>
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
              {dayjs(event.start).format('HH:mm')} - {dayjs(event.end).format('HH:mm')}
            </p>
            <p>{event.googleMeetLink && <Video size={16} />}</p>
          </div>
          <p>{event.title || '(Không có tiêu đề)'}</p>
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

const calculatePositionFromTime = (time: Date): number => {
  const date = new Date(time)
  const hours = date.getHours()
  const minutes = date.getMinutes()
  return ((hours * 60 + minutes) / (24 * 60)) * 100
}

const calculateEventHeight = (start: Date, end: Date): number => {
  const duration = (new Date(end).getTime() - new Date(start).getTime()) / (60 * 60 * 1000)
  return (duration / 24) * 100
}
