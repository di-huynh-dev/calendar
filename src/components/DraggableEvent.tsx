import React, { useState, useEffect } from "react";
import { useDraggable } from "@dnd-kit/core";
import dayjs from "dayjs";

interface Event {
  id: string;
  title: string;
  start: Date;
  end: Date;
  width: string;
  left: string;
  colorTag: string;
}

interface DraggableEventProps {
  event: Event;
  onDrop: (newStartTime: Date) => void;
  style?: React.CSSProperties;
}

const DraggableEvent: React.FC<DraggableEventProps> = ({
  event,
  style,
  onDrop,
}) => {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: event.id,
  });

  const [newStartTime, setNewStartTime] = useState<Date>(event.start);

  useEffect(() => {
    if (transform) {
      const offsetY = transform.y;
      const minutesToAdd = Math.round(offsetY / 30) * 15;
      const updatedStartTime = dayjs(event.start)
        .add(minutesToAdd, "minute")
        .toDate();
      setNewStartTime(roundToNearestQuarterHour(updatedStartTime));
    }
  }, [transform, event.start]);

  const handleDrop = () => {
    onDrop(newStartTime);
  };

  const startTime = new Date(event.start);
  const endTime = new Date(event.end);

  if (isNaN(startTime.getTime()) || isNaN(endTime.getTime())) {
    return null;
  }
  const roundToNearestQuarterHour = (date: Date): Date => {
    const minutes = date.getMinutes();
    const roundedMinutes = Math.round(minutes / 15) * 15;
    date.setMinutes(roundedMinutes);
    date.setSeconds(0);
    date.setMilliseconds(0);
    return date;
  };
  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      onPointerUp={handleDrop}
      style={{
        ...style,
        top: `${calculatePositionFromTime(startTime)}%`,
        height: `${calculateEventHeight(startTime, endTime)}%`,
        width: event.width,
        left: event.left,
        transform: transform ? `translateY(${transform.y}px)` : undefined,
        position: "absolute",
        color: "white",
        textAlign: "left",
        borderRadius: "0.75rem",
        padding: "0.5rem",
        borderLeft: "2px solid white",
        backgroundColor: event.colorTag ? event.colorTag : "#3b82f6",
      }}
    >
      <div
        className={`text-md ${
          endTime.getTime() - startTime.getTime() < 31 * 60 * 1000
            ? "flex items-center gap-2 text-xs"
            : ""
        }`}
      >
        <p>{event.title}</p>
        <p>
          {dayjs(newStartTime).format("HH:mm")} -{" "}
          {dayjs(newStartTime)
            .add(dayjs(event.end).diff(dayjs(event.start)), "millisecond")
            .format("HH:mm")}
        </p>
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
