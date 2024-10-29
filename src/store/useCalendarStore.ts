import { create } from "zustand";
import dayjs, { Dayjs } from "dayjs";
import { createJSONStorage, persist } from "zustand/middleware";
import { Event } from "../types/event.type";
import Holidays from "date-holidays";

type ViewMode = "day" | "week" | "month" | "year";

interface CalendarStore {
  viewMode: ViewMode;
  currentDate: Dayjs;
  holidays: { id: string; date: string; name: string; colorTag: string }[];
  fetchHolidays: (year: number) => void;
  setViewMode: (mode: ViewMode) => void;
  setCurrentDate: (date: Dayjs) => void;
  goForward: () => void;
  goBackward: () => void;
  events: Event[];
  addEvent: (event: Event) => void;
  removeEvent: (id: string) => void;
  updateEvent: (event: Event) => void;
  updateEventTime: (id: string, start: Date, end: Date) => void;
}

export const useCalendarStore = create<CalendarStore>()(
  persist(
    (set) => ({
      viewMode: "day",
      events: [],
      currentDate: dayjs(),
      holidays: [],
      fetchHolidays: (year: number) => {
        const hd = new Holidays("VN");
        const holidays = hd.getHolidays(year).map((holiday, index) => ({
          id: index.toString(),
          date: holiday.date,
          name: holiday.name,
          colorTag: "green",
        }));
        set({ holidays });
      },
      addEvent: (event) =>
        set((state) => ({ events: [...state.events, event] })),

      removeEvent: (id) =>
        set((state) => ({
          events: state.events.filter((event) => event.id !== id),
        })),

      updateEvent: (event) => {
        set((state) => ({
          events: state.events.map((e) => (e.id === event.id ? event : e)),
        }));
      },

      updateEventTime: (id: string, start: Date, end: Date) => {
        set((state) => ({
          events: state.events.map((event) =>
            event.id === id ? { ...event, start, end } : event
          ),
        }));
      },

      setViewMode: (mode) => set({ viewMode: mode }),

      setCurrentDate: (date) => set({ currentDate: date }),

      goForward: () =>
        set((state) => {
          let newDate: Dayjs;
          switch (state.viewMode) {
            case "day":
              newDate = state.currentDate.add(1, "day");
              break;
            case "week":
              newDate = state.currentDate.add(1, "week");
              break;
            case "month":
              newDate = state.currentDate.add(1, "month");
              break;
            case "year":
              newDate = state.currentDate.add(1, "year");
              break;
            default:
              newDate = state.currentDate;
          }
          return { currentDate: newDate };
        }),

      goBackward: () =>
        set((state) => {
          let newDate: Dayjs;
          switch (state.viewMode) {
            case "day":
              newDate = state.currentDate.subtract(1, "day");
              break;
            case "week":
              newDate = state.currentDate.subtract(1, "week");
              break;
            case "month":
              newDate = state.currentDate.subtract(1, "month");
              break;
            case "year":
              newDate = state.currentDate.subtract(1, "year");
              break;
            default:
              newDate = state.currentDate;
          }
          return { currentDate: newDate };
        }),
    }),
    {
      name: "calendar-store",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
