import React, { useMemo } from 'react'
import dayjs from 'dayjs'
import { useCalendarStore } from '../store/useCalendarStore'
import { Tooltip, Spin } from 'antd'
import { useQuery } from '@tanstack/react-query'

interface YearViewProps {
  year: number
  onDateSelect: (date: Date) => void
  onEventClick: (event: any) => void
}

const YearView: React.FC<YearViewProps> = React.memo(({ year, onDateSelect, onEventClick }) => {
  const { events, holidays, fetchHolidays } = useCalendarStore()

  const { isLoading: loadingHolidays } = useQuery({
    queryKey: ['holidays', year],
    queryFn: () => fetchHolidays(year),
    staleTime: 1000 * 60 * 60 * 24, // 24 hours
  })

  const getEventsForDate = useMemo(() => {
    const eventsForDate = (date: dayjs.Dayjs) => {
      const dayEvents = events.filter((event) => dayjs(event.start).isSame(date, 'day'))
      const dayHolidays = holidays
        .filter((holiday) => dayjs(holiday.date).isSame(date, 'day'))
        .map((holiday) => ({
          ...holiday,
          title: holiday.name,
        }))
      return [...dayEvents, ...dayHolidays]
    }
    return eventsForDate
  }, [events, holidays])

  const months = Array.from({ length: 12 }, (_, monthIndex) => {
    const startOfMonth = dayjs(new Date(year, monthIndex, 1))
    const daysInMonth = startOfMonth.daysInMonth()

    return (
      <div key={monthIndex} className="p-2 border border-blue-500 rounded-lg">
        <h3 className="text-center font-bold mb-2">{startOfMonth.format('MMMM')}</h3>
        <div className="grid grid-cols-7 text-center text-sm mb-2">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
            <div key={day}>{day}</div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-1">
          {Array.from({ length: daysInMonth }, (_, dayIndex) => {
            const currentDate = startOfMonth.add(dayIndex, 'day')
            const dailyEvents = loadingHolidays ? [] : getEventsForDate(currentDate)

            return (
              <Tooltip
                key={currentDate.toString()}
                title={
                  <React.Fragment>
                    {dailyEvents.length > 0 ? (
                      dailyEvents.map((event) => (
                        <div key={event.id}>
                          {'start' in event ? (
                            <button onClick={() => onEventClick(event)}>
                              <p>
                                {event.title || '(Không có tiêu đề)'} {`(${dayjs(event.start).format('HH:mm A')}`}
                                {'end' in event ? `- ${dayjs(event.end).format('HH:mm A')})` : ''}
                              </p>
                            </button>
                          ) : (
                            <p>{event.title || '(Không có tiêu đề)'} (Ngày lễ)</p>
                          )}
                        </div>
                      ))
                    ) : (
                      <p>Không có sự kiện nào</p>
                    )}
                  </React.Fragment>
                }
                color="#3b82f6"
              >
                <div
                  className={`text-center text-sm p-1 cursor-pointer hover:bg-blue-100 rounded ${
                    currentDate.isSame(dayjs(), 'day') ? 'bg-blue-300' : ''
                  }`}
                  onClick={() => onDateSelect(currentDate.toDate())}
                >
                  <div className={`inline-block ${currentDate.isSame(dayjs(), 'day') ? 'text-blue-500 border-1 font-bold ' : ''}`}>
                    {currentDate.date()}
                  </div>

                  {/* Display placeholders while loading */}
                  {dailyEvents.length > 0 && (
                    <div className="mt-1 flex justify-center">
                      {dailyEvents.map((event, index) => (
                        <span
                          key={index}
                          className="inline-block w-1.5 h-1.5 rounded-full"
                          style={{
                            backgroundColor: event.colorTag || '#3b82f6',
                          }}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </Tooltip>
            )
          })}
        </div>
      </div>
    )
  })
  if (loadingHolidays) {
    return <Spin fullscreen tip="Đang tải dữ liệu..." />
  }
  return <div className="grid grid-cols-4 gap-x-20 gap-y-3 p-4">{months}</div>
})

export default YearView
