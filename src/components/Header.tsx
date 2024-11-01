import { Button, DatePicker, Layout, Select, Tooltip } from 'antd'
import { useCalendarStore } from '../store/useCalendarStore'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Header } from 'antd/es/layout/layout'
import icon from '../assets/icon-calendar.jpg'
import dayjs from 'dayjs'
import { format, addDays, startOfWeek, isSameDay } from 'date-fns'
import { useCallback, useState } from 'react'
import { debounce } from 'lodash'

interface HeaderComponentProps {
  onEventClick: (event: any) => void
}

const HeaderComponent: React.FC<HeaderComponentProps> = ({ onEventClick }) => {
  const { viewMode, currentDate, setCurrentDate, setViewMode, goForward, goBackward, holidays, events } = useCalendarStore()
  const [searchResults, setSearchResults] = useState<any[]>([])

  const today = new Date()

  const startDate = startOfWeek(dayjs(currentDate).toDate(), {
    weekStartsOn: 0,
  })

  const days = Array.from({ length: 7 }, (_, i) => addDays(startDate, i))

  const handleSearch = (value: string) => {
    const trimmedValue = value.trim()
    if (trimmedValue === '') {
      setSearchResults([])
      return
    }
    const results = events.filter((event) => event.title?.toLowerCase().includes(trimmedValue.toLowerCase()))
    setSearchResults(results)
    if (results.length > 0) {
      setCurrentDate(dayjs(results[0].start))
    }
  }
  const debouncedSearch = useCallback(debounce(handleSearch, 500), [handleSearch])
  const currentHolidays = holidays.filter((holiday) => dayjs(holiday.date).isSame(currentDate, 'day'))

  const currentAllDayEvents = events.filter((event) => dayjs(event.start).isSame(currentDate, 'day') && event.allDay)

  const longEvents = events.filter((event) => {
    const start = dayjs(event.start)
    const end = dayjs(event.end)

    return (
      !event.allDay &&
      !start.isSame(end, 'day') &&
      (start.isSame(currentDate, 'day') ||
        end.isSame(currentDate, 'day') ||
        (start.isBefore(currentDate, 'day') && end.isAfter(currentDate, 'day')))
    )
  })

  return (
    <Layout>
      <Header className="fixed top-0 left-0 right-0 z-10 transition-opacity duration-300 bg-[#142433]">
        <div className="flex justify-center items-center">
          <img src={icon} alt="Icon" className="w-10 h-10" />
          <h1 className="text-3xl p-3 font-bold text-center text-white">BÓC LỊCH ONLINE</h1>
        </div>
      </Header>
      <div className="fixed top-16 left-0 right-0 z-10 bg-white shadow-lg">
        <div className="flex justify-between items-center mx-10 p-3">
          <div className="flex items-center gap-1">
            <Button className="rounded-lg bg-slate-100" onClick={goBackward}>
              <ChevronLeft />
            </Button>
            <Button className="rounded-lg bg-slate-100" onClick={() => useCalendarStore.setState({ currentDate: dayjs() })}>
              Hôm nay
            </Button>
            <Button className="rounded-lg bg-slate-100" onClick={goForward}>
              <ChevronRight />
            </Button>
          </div>
          <div className="flex gap-2">
            <DatePicker
              value={dayjs.isDayjs(currentDate) ? currentDate : dayjs(currentDate)}
              format={viewMode === 'year' ? 'YYYY' : viewMode === 'month' ? 'MMMM YYYY' : 'DD/MM/YYYY'}
              onChange={(date) => {
                if (date) {
                  setCurrentDate(date)
                }
              }}
            />
            <Select className="w-[120px]" value={viewMode} onChange={(value) => setViewMode(value)}>
              <Select.Option value="day">Ngày</Select.Option>
              <Select.Option value="week">Tuần</Select.Option>
              <Select.Option value="month">Tháng</Select.Option>
              <Select.Option value="year">Năm</Select.Option>
            </Select>
          </div>
          <div className="flex gap-2">
            <Select
              showSearch
              placeholder="Tìm kiếm sự kiện"
              onSearch={debouncedSearch}
              style={{ width: 200 }}
              filterOption={false}
              allowClear
            >
              {searchResults.map((event) => (
                <Select.Option key={event.id} value={event.title}>
                  <p onClick={() => onEventClick(event)}>{event.title}</p>
                </Select.Option>
              ))}
            </Select>
          </div>
        </div>

        {(viewMode === 'week' || viewMode === 'day') && (
          <div className="grid grid-cols-8 gap-2 text-center mb-2 items-center border-t-2 py-2">
            <div className="text-sm text-gray-600 border-r-2">GMT+07</div>
            {viewMode === 'day' && (
              <div>
                <div className={`text-lg ${isSameDay(dayjs(currentDate).toDate(), today) ? 'text-blue-600' : ''}`}>
                  {format(dayjs(currentDate).toDate(), 'EEE')}
                </div>
                <div
                  className={`text-2xl ${
                    isSameDay(dayjs(currentDate).toDate(), today)
                      ? 'bg-blue-600 text-white rounded-full w-10 h-10 mx-auto flex items-center justify-center'
                      : 'w-10 h-10 mx-auto'
                  }`}
                >
                  {format(dayjs(currentDate).toDate(), 'd')}
                </div>
              </div>
            )}
            {viewMode === 'week' &&
              days.map((day, i) => {
                const dayHolidays = holidays.filter((holiday) => isSameDay(day, new Date(holiday.date)))
                const dayAllDayEvents = events.filter((event) => isSameDay(day, new Date(event.start)) && event.allDay)

                return (
                  <div key={i} className="text-center">
                    <div className={`text-lg ${isSameDay(day, today) ? 'text-blue-600 font-bold' : ''}`}>{format(day, 'EEE')}</div>
                    <div
                      className={`text-2xl ${
                        isSameDay(day, today)
                          ? 'bg-blue-500 text-white rounded-full w-10 h-10 mx-auto flex items-center justify-center'
                          : 'w-10 h-10 mx-auto'
                      }`}
                    >
                      {format(day, 'd')}
                    </div>
                    <div className="mt-2 space-y-1 overflow-y-auto" style={{ maxHeight: '48px' }}>
                      {dayHolidays.map((holiday) => (
                        <div key={holiday.name} className="p-1 border border-dashed rounded-lg bg-green-100 text-green-500 text-xs">
                          {holiday.name}
                        </div>
                      ))}
                      {dayAllDayEvents.map((event) => (
                        <button
                          key={event.id}
                          className="p-2 border border-dashed rounded-lg bg-blue-100"
                          onClick={() => onEventClick(event)}
                        >
                          <span className="text-blue-500">{event.title ? event.title : '(Không có tiêu đề)'}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )
              })}
            {viewMode === 'day' && (
              <div className="mx-10">
                <div className="flex gap-2">
                  {currentHolidays.map((holiday) => (
                    <button key={holiday.id} className="p-2 border border-dashed rounded-lg bg-green-100">
                      <span className="text-green-500">
                        {holiday.name} ({dayjs(holiday.date).format('DD/MM')})
                      </span>
                    </button>
                  ))}
                  {longEvents.map((event) => {
                    return (
                      <Tooltip
                        title={
                          <>
                            <p className="text-white">{event.title ? event.title : '(Không có tiêu đề)'}</p>
                            <p className="text-white text-xs">
                              {dayjs(event.start).format('DD/MM/YYYY HH:mm')} - {dayjs(event.end).format('DD/MM/YYYY HH:mm')}
                            </p>
                          </>
                        }
                        color="blue"
                        placement="bottomRight"
                      >
                        <button
                          key={event.id}
                          style={{ backgroundColor: event.colorTag ? event.colorTag : '#79a7f3' }}
                          className="p-2 border border-dashed rounded-lg flex flex-col items-center justify-center w-full"
                          onClick={() => onEventClick(event)}
                        >
                          <p className="text-white">
                            {event.title ? (event.title.length > 10 ? event.title.slice(0, 5) + '...' : event.title) : '(Không có tiêu đề)'}
                          </p>
                        </button>
                      </Tooltip>
                    )
                  })}
                  {currentAllDayEvents.map((event) => (
                    <button
                      key={event.id}
                      style={{ backgroundColor: event.colorTag ? event.colorTag : '#79a7f3' }}
                      className="p-2 border border-dashed rounded-lg "
                      onClick={() => onEventClick(event)}
                    >
                      <p className="text-white">
                        {event.title ? (event.title.length > 10 ? event.title.slice(0, 5) + '...' : event.title) : '(Không có tiêu đề)'}
                      </p>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </Layout>
  )
}

export default HeaderComponent
