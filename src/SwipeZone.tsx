import React, { useRef } from "react";
import { Direction } from "./type";

const threshold = 5;

interface SwipeZoneProps {
  handleTouched: (direction: Direction) => void;
}

export const SwipeZone: React.FC<SwipeZoneProps> = ({ handleTouched }) => {
  const elementRef = useRef<HTMLDivElement>(null);

  let startX: number;
  let startY: number;

  const handleTouchStart = (
    event: React.TouchEvent<HTMLDivElement> | React.MouseEvent<HTMLDivElement>
  ) => {
    startX = (event as React.TouchEvent<HTMLDivElement>).touches
      ? (event as React.TouchEvent<HTMLDivElement>).touches[0].clientX
      : (event as React.MouseEvent<HTMLDivElement>).clientX;
    startY = (event as React.TouchEvent<HTMLDivElement>).touches
      ? (event as React.TouchEvent<HTMLDivElement>).touches[0].clientY
      : (event as React.MouseEvent<HTMLDivElement>).clientY;
  };

  const handleTouchEnd = (
    event: React.TouchEvent<HTMLDivElement> | React.MouseEvent<HTMLDivElement>
  ) => {
    let endX = (event as React.TouchEvent<HTMLDivElement>).changedTouches
      ? (event as React.TouchEvent<HTMLDivElement>).changedTouches[0].clientX
      : (event as React.MouseEvent<HTMLDivElement>).clientX;
    let endY = (event as React.TouchEvent<HTMLDivElement>).changedTouches
      ? (event as React.TouchEvent<HTMLDivElement>).changedTouches[0].clientY
      : (event as React.MouseEvent<HTMLDivElement>).clientY;

    let deltaX = endX - startX;
    let deltaY = endY - startY;

    if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > threshold) {
      if (deltaX > 0) {
        handleTouched(Direction.RIGHT);
      } else {
        handleTouched(Direction.LEFT);
      }
    }

    if (Math.abs(deltaY) > Math.abs(deltaX) && Math.abs(deltaY) > threshold) {
      if (deltaY > 0) {
        handleTouched(Direction.DOWN);
      } else {
        handleTouched(Direction.UP);
      }
    }
  };
  if (import.meta.env.VITE_GAME_CONTROL_MODE === "button") {
    return (
      <div
        style={{
          position: "absolute",
          bottom: 16,
          left: 16,
          right: 16,
          zIndex: 10,
          background: "transparent",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          margin: "auto",
        }}
      >
        <button
          style={{ width: 150 }}
          onClick={() => handleTouched(Direction.RIGHT)}
        >
          SKIP
        </button>
        <button
          style={{ width: 150 }}
          onClick={() => handleTouched(Direction.LEFT)}
        >
          CORRECT
        </button>
      </div>
    );
  }

  return (
    <div
      ref={elementRef}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onMouseDown={handleTouchStart}
      onMouseUp={handleTouchEnd}
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 10,
        background: "transparent",
      }}
    />
  );
};

export default SwipeZone;
