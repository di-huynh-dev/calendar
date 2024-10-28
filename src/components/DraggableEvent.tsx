import React from "react";
import { useDraggable } from "@dnd-kit/core";

interface Event {
  id: string;
  title: string;
  start: Date;
  end: Date;
}

interface DraggableEventProps {
  event: Event;
  onDrop: (newStartTime: Date) => void;
  style?: React.CSSProperties;
}

const DraggableEvent: React.FC<DraggableEventProps> = ({ event }) => {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: event.id,
  });

  const startTime = new Date(event.start);
  const endTime = new Date(event.end);

  if (isNaN(startTime.getTime()) || isNaN(endTime.getTime())) {
    return null;
  }

  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      style={{
        top: `${calculatePositionFromTime(startTime)}%`,
        height: `${calculateEventHeight(startTime, endTime)}%`,
        opacity: isDragging ? 0.5 : 1,
        position: "absolute",
        left: 0,
        width: "100%",
        color: "white",
        textAlign: "left",
        borderRadius: "0.75rem",
        padding: "0.5rem",
      }}
      className="absolute left-0 w-full bg-blue-400 text-white text-left rounded-xl p-2"
    >
      <div
        className={`text-xs ${
          endTime.getTime() - startTime.getTime() < 31 * 60 * 1000
            ? "flex gap-2"
            : ""
        }`}
      >
        <p>{event.title}</p>
        <p>{`${startTime.getHours()}:${startTime
          .getMinutes()
          .toString()
          .padStart(2, "0")} - ${endTime.getHours()}:${endTime
          .getMinutes()
          .toString()
          .padStart(2, "0")}`}</p>
      </div>
    </div>
  );
};

const calculatePositionFromTime = (time: Date): number => {
  const hours = time.getHours();
  const minutes = time.getMinutes();
  return ((hours * 60 + minutes) / (24 * 60)) * 100;
};

const calculateEventHeight = (start: Date, end: Date): number => {
  const duration = (end.getTime() - start.getTime()) / (60 * 60 * 1000);
  return (duration / 24) * 100;
};
export default DraggableEvent;
