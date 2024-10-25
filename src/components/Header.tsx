import { Button, DatePicker, Layout, Select } from "antd";
import { useCalendarStore } from "../store/useCalendarStore";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Header } from "antd/es/layout/layout";

const HeaderComponent = () => {
  const { viewMode, currentDate, setViewMode, goForward, goBackward } =
    useCalendarStore();

  return (
    <Layout>
      <Header>
        <h1 className="text-3xl p-3 text-white font-bold text-center">
          MY CALENDAR
        </h1>
      </Header>
      <div className="flex justify-between items-center mx-10 p-3">
        <div className="flex items-center gap-2">
          <Button className="rounded-full">Hôm nay</Button>
          <Button className="rounded-full" onClick={goBackward}>
            <ChevronLeft />
          </Button>
          <Button className="rounded-full" onClick={goForward}>
            <ChevronRight />
          </Button>
        </div>
        <DatePicker
          value={currentDate}
          format={
            viewMode === "year"
              ? "YYYY"
              : viewMode === "month"
              ? "MMMM YYYY"
              : "DD/MM/YYYY"
          }
          onChange={(date) => {
            if (date) {
              useCalendarStore.setState({ currentDate: date });
            }
          }}
        />
        <div>
          <Select
            size="large"
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
    </Layout>
  );
};

export default HeaderComponent;
