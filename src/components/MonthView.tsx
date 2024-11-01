import React from 'react'
import { Calendar, Tooltip } from 'antd'
import dayjs, { Dayjs } from 'dayjs'
import { useCalendarStore } from '../store/useCalendarStore'

interface MonthViewProps {
  startOfMonth: Dayjs
  onDateSelect: (date: Dayjs) => void
  onEventClick: (event: any) => void
}

const MonthView: React.FC<MonthViewProps> = ({ startOfMonth, onEventClick, onDateSelect }) => {
  const { events } = useCalendarStore()

  const getEventsForDate = (date: Dayjs) => {
    return events.filter((event) => dayjs(event.start).isSame(date, 'day'))
  }

  const dateCellRender = (value: Dayjs) => {
    const dailyEvents = getEventsForDate(value)

    return (
      <ul>
        {dailyEvents.map((event) => (
          <Tooltip
            color="#3391fc"
            key={event.id}
            title={
              <div>
                <p>
                  {event.title ? event.title : '(Không có tiêu đề)'} ({dayjs(event.start).format('hh:mm A')} -{' '}
                  {dayjs(event.end).format('hh:mm A')} )
                </p>
              </div>
            }
            placement="left"
          >
            <li
              className="flex gap-2"
              onClick={(e) => {
                onEventClick(event)
                e.stopPropagation()
              }}
            >
              <div
                style={{
                  backgroundColor: event.colorTag ? event.colorTag : '#3b82f6',
                }}
                className="rounded-full w-2 h-2 mt-2"
              ></div>
              <div className="flex flex-col">
                <span>{!event.title ? '(Không có tiêu đề)' : event.title}</span>
                <span className="text-xs text-gray-500">
                  {dayjs(event.start).format('hh:mm A')} - {dayjs(event.end).format('hh:mm A')}
                </span>
              </div>
            </li>
          </Tooltip>
        ))}
      </ul>
    )
  }

  return (
    <div className="col-span-7">
      <Calendar
        value={startOfMonth}
        dateCellRender={dateCellRender}
        fullscreen
        headerRender={() => null}
        onSelect={onDateSelect}
        className="m-10"
      />
    </div>
  )
}

export default MonthView
