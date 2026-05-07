"use client";

import { useEffect, useState } from "react";

export default function SplashScreen() {
  const [visible, setVisible] = useState(true);
  const [fading, setFading] = useState(false);

  useEffect(() => {
    const fadeTimer = setTimeout(() => {
      setFading(true);
      window.dispatchEvent(new Event("splash-done"));
    }, 2200);
    const hideTimer = setTimeout(() => setVisible(false), 2800);
    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(hideTimer);
    };
  }, []);

  if (!visible) return null;

  return (
    <div className={`splash-screen ${fading ? "splash-fading" : ""}`}>
      <div className="loading-grid" />
      <div className="loading-scan-line" />
      <div className="loading-border-accent" />

      <div className="loading-logo">
        <div className="loading-wordmark">
          SULERTIA<span>MEDIA</span>
        </div>

        <div className="loading-signal">
          <div className="loading-bar" />
          <div className="loading-bar" />
          <div className="loading-bar" />
          <div className="loading-bar" />
          <div className="loading-bar" />
          <div className="loading-bar" />
          <div className="loading-bar" />
        </div>

        <div className="loading-status">
          <span className="loading-dot" />
          AI scanning world news
        </div>
      </div>
    </div>
  );
}