"use client";

import { useEffect, useState } from "react";

export default function WalkingRobot() {
  const [timeLeft, setTimeLeft] = useState("--:--:--");
  const [animationKey, setAnimationKey] = useState(0);

  useEffect(() => {
    function getNext7AM() {
      const now = new Date();
      const target = new Date();

      target.setHours(7, 0, 0, 0);

      if (now > target) {
        target.setDate(target.getDate() + 1);
      }

      return target;
    }

    function updateTimer() {
      const now = new Date();
      const target = getNext7AM();
      const diff = target.getTime() - now.getTime();

      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff / (1000 * 60)) % 60);
      const seconds = Math.floor((diff / 1000) % 60);

      setTimeLeft(
        `${String(hours).padStart(2, "0")}:` +
          `${String(minutes).padStart(2, "0")}:` +
          `${String(seconds).padStart(2, "0")}`
      );
    }

    updateTimer();

    const timerInterval = setInterval(updateTimer, 1000);
    const animationInterval = setInterval(() => {
      setAnimationKey((prev) => prev + 1);
    }, 40000);

    return () => {
      clearInterval(timerInterval);
      clearInterval(animationInterval);
    };
  }, []);

  return (
    <div key={animationKey} className="robot-wrapper robot-move">
      <div className="robot-timer">{timeLeft}</div>
      <img className="robot-video" src="/robot.apng" alt="Walking robot" />
    </div>
  );
}