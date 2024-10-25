// YearView.tsx
import React from "react";

interface YearViewProps {
  year: number;
}

const YearView: React.FC<YearViewProps> = ({ year }) => {
  const months = Array.from({ length: 12 }, (_, index) => index + 1);

  const monthNames = [
    "Tháng 1",
    "Tháng 2",
    "Tháng 3",
    "Tháng 4",
    "Tháng 5",
    "Tháng 6",
    "Tháng 7",
    "Tháng 8",
    "Tháng 9",
    "Tháng 10",
    "Tháng 11",
    "Tháng 12",
  ];

  const weekDays = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"];

  return (
    <div className="year-view grid lg:grid-cols-4 md:grid-cols-2 grid-cols-1 gap-4 p-4">
      {months.map((month) => {
        const daysInMonth = new Date(year, month, 0).getDate(); // Số ngày trong tháng hiện tại
        const startDay = new Date(year, month - 1, 1).getDay(); // Ngày đầu tiên của tháng hiện tại
        const lastMonthDays = new Date(year, month - 1, 0).getDate(); // Số ngày trong tháng trước

        // Tạo mảng các ngày trong tháng hiện tại
        const daysArray = Array.from(
          { length: daysInMonth },
          (_, index) => index + 1
        );
        // Tạo mảng các ngày của tháng trước để điền vào ô trống
        const emptyDays = Array.from(
          { length: startDay },
          (_, index) => lastMonthDays - startDay + index + 1
        );

        // Tạo mảng cho các ngày tiếp theo để đảm bảo đủ 42 ô
        const totalDays = [...emptyDays, ...daysArray];
        const totalEmptyDays = 42 - totalDays.length; // Số ô trống còn lại
        const additionalEmptyDays = Array.from(
          { length: totalEmptyDays },
          (_, index) => index + 1
        ); // Tạo các ô trống

        // Ghép tất cả các ngày vào một mảng
        const allDays = [...totalDays, ...additionalEmptyDays];

        return (
          <>
            <div key={month} className="border p-4">
              <h3 className="font-bold text-center mb-3">
                {monthNames[month - 1]}
              </h3>
              <div className="grid grid-cols-7 gap-2">
                {/* Hàng thứ */}
                {weekDays.map((day) => (
                  <div
                    key={day}
                    className="font-bold text-center flex items-center justify-center"
                    style={{
                      width: "2rem",
                      height: "2rem",
                      lineHeight: "2rem",
                    }}
                  >
                    {day}
                  </div>
                ))}

                {/* Hiển thị các ngày */}
                {allDays.map((day, index) => (
                  <button
                    key={index}
                    className={`text-center flex items-center justify-center rounded-full hover:bg-[#b8c7dd] ${
                      day > daysInMonth ? "text-gray-400" : ""
                    }`}
                    style={{
                      width: "2rem",
                      height: "2rem",
                      lineHeight: "2rem",
                    }}
                  >
                    {day <= daysInMonth ? day : ""}
                    {/* Render các sự kiện của ngày ở đây nếu có */}
                    <div>
                      {/* Các sự kiện của ngày hiện tại có thể được hiển thị ở đây */}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </>
        );
      })}
    </div>
  );
};

export default YearView;
