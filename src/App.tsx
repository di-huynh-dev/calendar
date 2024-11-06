import React from 'react'
import { format, setHours } from 'date-fns'
import dayjs from 'dayjs'
import { useState } from 'react'
import HeaderComponent from './components/Header'
import { useCalendarStore } from './store/useCalendarStore'
import DayView from './components/DayView'
import AddEventModal from './components/AddEventModal'
import WeekView from './components/WeekView'
import MonthView from './components/MonthView'
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter'
import YearView from './components/YearView'
dayjs.extend(isSameOrAfter)

const Calendar: React.FC = () => {
  const { viewMode, currentDate } = useCalendarStore()
  const [selectedTime, setSelectedTime] = useState<Date | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedEvent, setSelectedEvent] = useState(null)

  const handleTimeClick = (time: Date) => {
    setSelectedTime(time)
    setSelectedEvent(null)
    setIsModalOpen(true)
  }

  const handleEventClick = (event: any) => {
    setSelectedEvent(event)
    setSelectedTime(null)
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setSelectedTime(null)
    setSelectedEvent(null)
  }

  const handleDateSelect = (date: any) => {
    setSelectedTime(dayjs(date).toDate())
    setSelectedEvent(null)
    setIsModalOpen(true)
  }

  const hours = Array.from({ length: 24 }, (_, i) => i)
  const startOfMonth = dayjs(currentDate).startOf('month')
  const year = dayjs(currentDate).year()

  return (
    <div className={`${viewMode === 'day' ? 'mt-60' : viewMode === 'week' ? 'mt-72' : 'mt-32'}`}>
      <HeaderComponent onEventClick={handleEventClick} />

      {/* Calendar Grid */}
      <div className={`${(viewMode === 'day' || viewMode === 'week') && 'grid grid-cols-8 gap-2 relative'}`}>
        {/* Time Labels Column */}
        {(viewMode === 'day' || viewMode === 'week') && (
          <div className="border-r">
            {hours.map((hour) => (
              <div key={hour} className="h-20 border-b text-sm text-center text-gray-500">
                {format(setHours(new Date(), hour), 'HH:00')}
              </div>
            ))}
          </div>
        )}

        {viewMode === 'day' && <DayView date={currentDate} onTimeClick={handleTimeClick} onEventClick={handleEventClick} />}
        {viewMode === 'week' && <WeekView date={currentDate} onTimeClick={handleTimeClick} onEventClick={handleEventClick} />}

        {viewMode === 'month' && <MonthView startOfMonth={startOfMonth} onDateSelect={handleDateSelect} onEventClick={handleEventClick} />}

        {viewMode === 'year' && <YearView year={year} onDateSelect={handleDateSelect} onEventClick={handleEventClick} />}

        {isModalOpen && <AddEventModal selectedTime={selectedTime} onClose={closeModal} selectedEvent={selectedEvent} />}
      </div>
    </div>
  )
}

export default Calendar
