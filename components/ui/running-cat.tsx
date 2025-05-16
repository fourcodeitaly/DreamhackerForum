"use client";

import { useEffect, useState } from "react";

export function RunningCat() {
  const [position, setPosition] = useState(-200);

  useEffect(() => {
    const interval = setInterval(() => {
      setPosition((prev) => {
        if (prev >= window.innerWidth) {
          clearInterval(interval);
        }
        return prev + 8; // Speed of the cat
      });
    }, 50);

    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className="fixed bottom-0 z-50"
      style={{
        transform: `translateX(${position}px)`,
        transition: "transform 0.05s linear",
      }}
    >
      <div className="relative size-40">
        {/* Cat body */}
        <img
          src="https://i.pinimg.com/originals/d4/8a/bd/d48abd7e0c734ee82d697deea9410acb.gif"
          alt="Cat"
          className="absolute bottom-0 w-40 h-32 rounded-full"
        />
      </div>
    </div>
  );
}
