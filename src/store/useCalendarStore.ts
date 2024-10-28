import { create } from "zustand";
import dayjs, { Dayjs } from "dayjs";
import { createJSONStorage, persist } from "zustand/middleware";
import { Event } from "../types/event.type";

type ViewMode = "day" | "week" | "month" | "year";

interface CalendarStore {
  viewMode: ViewMode;
  currentDate: Dayjs;
  setViewMode: (mode: ViewMode) => void;
  setCurrentDate: (date: Dayjs) => void;
  goForward: () => void;
  goBackward: () => void;
  events: Event[];
  addEvent: (event: Event) => void;
  removeEvent: (id: string) => void;
  updateEventTime: (id: string, start: Date, end: Date) => void;
}

export const useCalendarStore = create<CalendarStore>()(
  persist(
    (set) => ({
      viewMode: "day",
      events: [],
      addEvent: (event) =>
        set((state) => ({ events: [...state.events, event] })),
      removeEvent: (id) =>
        set((state) => ({
          events: state.events.filter((event) => event.id !== id),
        })),
      updateEventTime: (id: string, start: Date, end: Date) => {
        set((state) => ({
          events: state.events.map((event) =>
            event.id === id ? { ...event, start, end } : event
          ),
        }));
      },
      currentDate: dayjs(),
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
