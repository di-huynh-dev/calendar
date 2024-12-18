import React from 'react'
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
import TimeLabelsColumn from './components/TimeLabelsColumn'
dayjs.extend(isSameOrAfter)

type SelectedTime = {
  start: Date
  end: Date
}

const Calendar: React.FC = () => {
  const { viewMode, currentDate, timeZone } = useCalendarStore()
  const [selectedTime, setSelectedTime] = useState<SelectedTime | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedEvent, setSelectedEvent] = useState(null)

  const handleTimeClick = (time: { start: Date; end: Date }) => {
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
    const selectedDate = dayjs(date).toDate()
    setSelectedTime({ start: selectedDate, end: selectedDate })
    setSelectedEvent(null)
    setIsModalOpen(true)
  }

  const startOfMonth = dayjs(currentDate).startOf('month')
  const year = dayjs(currentDate).year()

  return (
    <div className={`${viewMode === 'day' ? 'mt-60' : viewMode === 'week' ? 'mt-72' : 'mt-32'}`}>
      <HeaderComponent onEventClick={handleEventClick} />

      {/* Calendar Grid */}
      <div className={`${(viewMode === 'day' || viewMode === 'week') && 'grid grid-cols-8 relative'}`}>
        {/* Time Labels Column */}
        {(viewMode === 'day' || viewMode === 'week') && <TimeLabelsColumn timeZone={timeZone} />}

        {viewMode === 'day' && (
          <DayView date={currentDate} onTimeClick={handleTimeClick} onEventClick={handleEventClick} isModalOpen={isModalOpen} />
        )}

        {viewMode === 'week' && (
          <WeekView date={currentDate} onTimeClick={handleTimeClick} onEventClick={handleEventClick} isModalOpen={isModalOpen} />
        )}

        {viewMode === 'month' && <MonthView startOfMonth={startOfMonth} onDateSelect={handleDateSelect} onEventClick={handleEventClick} />}

        {viewMode === 'year' && <YearView year={year} onDateSelect={handleDateSelect} onEventClick={handleEventClick} />}

        {isModalOpen && <AddEventModal selectedTime={selectedTime} onClose={closeModal} selectedEvent={selectedEvent} />}
      </div>
    </div>
  )
}

export default Calendar
