import { Button, DatePicker, Input, Layout, Radio } from "antd";
import { useCalendarStore } from "../store/useCalendarStore";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Header } from "antd/es/layout/layout";
import icon from "../assets/icon-calendar.jpg";
import dayjs from "dayjs";
import { format, addDays, startOfWeek, isSameDay } from "date-fns";
import toast from "react-hot-toast";

interface HeaderComponentProps {
  onEventClick: (event: any) => void;
}

const HeaderComponent: React.FC<HeaderComponentProps> = ({ onEventClick }) => {
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
      <Header className="fixed top-0 left-0 right-0 z-10 transition-opacity duration-300 bg-[#142433]">
        <div className="flex justify-center items-center">
          <img src={icon} alt="Icon" className="w-10 h-10" />
          <h1 className="text-3xl p-3 font-bold text-center text-white">
            BÓC LỊCH ONLINE
          </h1>
        </div>
      </Header>
      <div className="fixed top-16 left-0 right-0 z-10 bg-white shadow-lg">
        <div className="flex justify-between items-center mx-10 p-3">
          <div className="flex items-center gap-1">
            <Button className="rounded-lg bg-slate-100" onClick={goBackward}>
              <ChevronLeft />
            </Button>
            <Button
              className="rounded-lg bg-slate-100"
              onClick={() =>
                useCalendarStore.setState({ currentDate: dayjs() })
              }
            >
              Hôm nay
            </Button>
            <Button className="rounded-lg bg-slate-100" onClick={goForward}>
              <ChevronRight />
            </Button>
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
            <Radio.Group
              options={[
                { label: "Ngày", value: "day" },
                { label: "Tuần", value: "week" },
                { label: "Tháng", value: "month" },
                { label: "Năm", value: "year" },
              ]}
              onChange={(e) => setViewMode(e.target.value)}
              value={viewMode}
              optionType="button"
            />
          </div>
          <div className="flex gap-2">
            <Input.Search
              placeholder="Tìm kiếm sự kiện"
              onSearch={(value) => {
                const searchResults = events.filter((event) =>
                  event.title?.toLowerCase().includes(value.toLowerCase())
                );
                if (searchResults.length > 0) {
                  setCurrentDate(dayjs(searchResults[0].start));
                } else {
                  toast.error("Không có sự kiện nào được tìm thấy");
                }
              }}
              style={{ width: 200 }}
              allowClear
            />
          </div>
        </div>

        {(viewMode === "week" || viewMode === "day") && (
          <div className="grid grid-cols-8 gap-2 text-center mb-2 items-center border-t-2 py-2">
            <div className="text-sm text-gray-600 border-r-2">GMT+07</div>
            {viewMode === "day" && (
              <div>
                <div
                  className={`text-lg ${
                    isSameDay(dayjs(currentDate).toDate(), today)
                      ? "text-blue-600"
                      : ""
                  }`}
                >
                  {format(dayjs(currentDate).toDate(), "EEE")}
                </div>
                <div
                  className={`text-2xl ${
                    isSameDay(dayjs(currentDate).toDate(), today)
                      ? "bg-blue-600 text-white rounded-full w-10 h-10 mx-auto flex items-center justify-center"
                      : "w-10 h-10 mx-auto"
                  }`}
                >
                  {format(dayjs(currentDate).toDate(), "d")}
                </div>
              </div>
            )}
            {viewMode === "week" &&
              days.map((day, i) => {
                const dayHolidays = holidays.filter((holiday) =>
                  isSameDay(day, new Date(holiday.date))
                );
                const dayAllDayEvents = events.filter(
                  (event) =>
                    isSameDay(day, new Date(event.start)) && event.allDay
                );

                return (
                  <div key={i} className="text-center">
                    <div
                      className={`text-lg ${
                        isSameDay(day, today) ? "text-blue-600 font-bold" : ""
                      }`}
                    >
                      {format(day, "EEE")}
                    </div>
                    <div
                      className={`text-2xl ${
                        isSameDay(day, today)
                          ? "bg-blue-500 text-white rounded-full w-10 h-10 mx-auto flex items-center justify-center"
                          : "w-10 h-10 mx-auto"
                      }`}
                    >
                      {format(day, "d")}
                    </div>
                    <div
                      className="mt-2 space-y-1 overflow-y-auto"
                      style={{ maxHeight: "48px" }}
                    >
                      {dayHolidays.map((holiday) => (
                        <div
                          key={holiday.name}
                          className="p-1 border border-dashed rounded-lg bg-green-100 text-green-500 text-xs"
                        >
                          {holiday.name}
                        </div>
                      ))}
                      {dayAllDayEvents.map((event) => (
                        <div
                          key={event.id}
                          className="p-1 border border-dashed rounded-lg bg-blue-100 text-blue-500 text-xs"
                        >
                          {event.title}
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            {viewMode === "day" && (
              <div className="mx-10">
                <div className="flex gap-2">
                  {currentHolidays.map((holiday) => (
                    <button className="p-2 border border-dashed rounded-lg bg-green-100">
                      <span className="text-green-500">
                        {holiday.name} ({dayjs(holiday.date).format("DD/MM")})
                      </span>
                    </button>
                  ))}
                  {currentAllDayEvents.map((event) => (
                    <button
                      className="p-2 border border-dashed rounded-lg bg-blue-100"
                      onClick={() => onEventClick(event)}
                    >
                      <span className="text-blue-500">
                        {event.title} ({dayjs(event.start).format("DD/MM")})
                      </span>
                    </button>
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
