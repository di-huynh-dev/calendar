import { Button, DatePicker, Layout, Select } from "antd";
import { useCalendarStore } from "../store/useCalendarStore";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Header } from "antd/es/layout/layout";
import icon from "../assets/icon-calendar.jpg";
import dayjs from "dayjs";
import { format, addDays, startOfWeek, isSameDay } from "date-fns";

const HeaderComponent = () => {
  const { viewMode, currentDate, setViewMode, goForward, goBackward } =
    useCalendarStore();
  const today = new Date();
  const startDate = startOfWeek(currentDate.toDate(), { weekStartsOn: 0 });
  const days = Array.from({ length: 7 }, (_, i) => addDays(startDate, i));
  return (
    <Layout>
      <Header className=" fixed top-0 left-0 right-0 z-10 transition-opacity duration-300">
        <div className="flex justify-center items-center">
          <img src={icon} alt="Icon" className="w-10 h-10" />
          <h1 className="text-3xl p-3 font-bold text-center text-white">
            MY CALENDAR
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
                ? currentDate.format(
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
              value={currentDate}
              format={
                viewMode === "year"
                  ? "YYYY"
                  : viewMode === "month"
                  ? "Ngày" + "MMMM YYYY"
                  : "DD/MM/YYYY"
              }
              onChange={(date) => {
                if (date) {
                  useCalendarStore.setState({ currentDate: date });
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
                    isSameDay(currentDate.toDate(), today)
                      ? "text-blue-600"
                      : ""
                  }`}
                >
                  {format(currentDate.toDate(), "EEE")}
                </div>
                {/* Hiển thị ngày */}
                <div
                  className={`text-2xl ${
                    isSameDay(currentDate.toDate(), today)
                      ? "bg-blue-500 text-white rounded-full w-10 h-10 mx-auto flex items-center justify-center"
                      : "w-10 h-10 mx-auto"
                  }`}
                >
                  {format(currentDate.toDate(), "d")}
                </div>
              </div>
            )}
            {viewMode === "week" &&
              days.map((day, i) => (
                <div key={i} className="text-center">
                  {/* Hiển thị thứ */}
                  <div
                    className={`text-lg ${
                      isSameDay(day, today) ? "text-blue-600 font-bold" : ""
                    }`}
                  >
                    {format(day, "EEE")}
                  </div>
                  {/* Hiển thị ngày */}
                  <div
                    className={`text-2xl ${
                      isSameDay(day, today)
                        ? "bg-blue-500 text-white rounded-full w-10 h-10 mx-auto flex items-center justify-center"
                        : "w-10 h-10 mx-auto"
                    }`}
                  >
                    {format(day, "d")}
                  </div>
                </div>
              ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default HeaderComponent;