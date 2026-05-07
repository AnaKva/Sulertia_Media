"use client";

import { useEffect, useState } from "react";
import WalkingRobot from "@/components/WalkingRobot";

export default function DelayedRobot() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const handler = () => setReady(true);
    window.addEventListener("splash-done", handler);
    return () => window.removeEventListener("splash-done", handler);
  }, []);

  if (!ready) return null;

  return <WalkingRobot />;
}