import { Button, DatePicker, Layout, Select } from "antd";
import { useCalendarStore } from "../store/useCalendarStore";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Header } from "antd/es/layout/layout";
import icon from "../assets/icon-calendar.jpg";
import dayjs from "dayjs";
import { format, addDays, startOfWeek, isSameDay } from "date-fns";

const HeaderComponent = () => {
  const {
    viewMode,
    currentDate,
    setCurrentDate,
    setViewMode,
    goForward,
    goBackward,
    holidays,
    events,
  } = useCalendarStore();
  const today = new Date();
  const startDate = startOfWeek(dayjs(currentDate).toDate(), {
    weekStartsOn: 0,
  });
  const days = Array.from({ length: 7 }, (_, i) => addDays(startDate, i));

  const currentHolidays = holidays.filter((holiday) =>
    dayjs(holiday.date).isSame(currentDate, "day")
  );

  const currentAllDayEvents = events.filter(
    (event) => dayjs(event.start).isSame(currentDate, "day") && event.allDay
  );

  return (
    <Layout>
      <Header className=" fixed top-0 left-0 right-0 z-10 transition-opacity duration-300 bg-orange-400">
        <div className="flex justify-center items-center">
          <img src={icon} alt="Icon" className="w-10 h-10" />
          <h1 className="text-3xl p-3 font-bold text-center text-white">
            BÓC LỊCH ONLINE
          </h1>
        </div>
      </Header>
      <div className="fixed top-16 left-0 right-0 z-10 bg-white shadow-lg">
        <div className="flex justify-between items-center mx-10 p-3">
          <div className="flex items-center gap-2">
            <Button
              className="rounded-full"
              onClick={() =>
                useCalendarStore.setState({ currentDate: dayjs() })
              }
            >
              Hôm nay
            </Button>
            <Button className="rounded-full" onClick={goBackward}>
              <ChevronLeft />
            </Button>
            <Button className="rounded-full" onClick={goForward}>
              <ChevronRight />
            </Button>
          </div>
          <div>
            <span className="text-lg font-semibold">
              {currentDate
                ? dayjs(currentDate).format(
                    viewMode === "year"
                      ? "YYYY"
                      : viewMode === "month"
                      ? "MMMM YYYY"
                      : "DD/MM/YYYY"
                  )
                : ""}
            </span>
          </div>
          <div className="flex gap-2">
            <DatePicker
              value={
                dayjs.isDayjs(currentDate) ? currentDate : dayjs(currentDate)
              }
              format={
                viewMode === "year"
                  ? "YYYY"
                  : viewMode === "month"
                  ? "MMMM YYYY"
                  : "DD/MM/YYYY"
              }
              onChange={(date) => {
                if (date) {
                  setCurrentDate(date);
                }
              }}
            />
            <Select
              className="w-[120px]"
              value={viewMode}
              onChange={(value) => setViewMode(value)}
            >
              <Select.Option value="day">Ngày</Select.Option>
              <Select.Option value="week">Tuần</Select.Option>
              <Select.Option value="month">Tháng</Select.Option>
              <Select.Option value="year">Năm</Select.Option>
            </Select>
          </div>
        </div>

        {/* Calendar header */}
        {(viewMode === "week" || viewMode === "day") && (
          <div className="grid grid-cols-8 gap-2 text-center mb-2 items-center border-t-2 py-2">
            <div className="text-sm text-gray-600 border-r-2">GMT+07</div>
            {viewMode === "day" && (
              <div>
                {/* Hiển thị thứ */}
                <div
                  className={`text-lg ${
                    isSameDay(dayjs(currentDate).toDate(), today)
                      ? "text-orange-600"
                      : ""
                  }`}
                >
                  {format(dayjs(currentDate).toDate(), "EEE")}
                </div>
                {/* Hiển thị ngày */}
                <div
                  className={`text-2xl ${
                    isSameDay(dayjs(currentDate).toDate(), today)
                      ? "bg-orange-500 text-white rounded-full w-10 h-10 mx-auto flex items-center justify-center"
                      : "w-10 h-10 mx-auto"
                  }`}
                >
                  {format(dayjs(currentDate).toDate(), "d")}
                </div>
              </div>
            )}
            {viewMode === "week" &&
              days.map((day, i) => (
                <div key={i} className="text-center">
                  {/* Hiển thị thứ */}
                  <div
                    className={`text-lg ${
                      isSameDay(day, today) ? "text-orange-600 font-bold" : ""
                    }`}
                  >
                    {format(day, "EEE")}
                  </div>
                  {/* Hiển thị ngày */}
                  <div
                    className={`text-2xl ${
                      isSameDay(day, today)
                        ? "bg-orange-500 text-white rounded-full w-10 h-10 mx-auto flex items-center justify-center"
                        : "w-10 h-10 mx-auto"
                    }`}
                  >
                    {format(day, "d")}
                  </div>
                </div>
              ))}

            {/* Display Holidays and All-Day Events */}
            {viewMode === "day" && (
              <div className="mx-10">
                <div className="flex gap-2">
                  {currentHolidays.map((holiday) => (
                    <div className="p-2 border border-dashed rounded-lg bg-orange-100">
                      <span className="text-orange-500">
                        {holiday.name} ({dayjs(holiday.date).format("DD/MM")})
                      </span>
                    </div>
                  ))}
                  {currentAllDayEvents.map((event) => (
                    <div className="p-2 border border-dashed rounded-lg bg-green-100">
                      <span className="text-green-500">
                        {event.title} ({dayjs(event.start).format("DD/MM")})
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default HeaderComponent;
