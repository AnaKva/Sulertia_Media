"use client";

import { useEffect, useRef, useState } from "react";

interface Props {
  items: string[];
}

export default function TypewriterStory({ items }: Props) {
  const [displayedItems, setDisplayedItems] = useState<string[]>(
    items.map(() => "")
  );
  const [currentItem, setCurrentItem] = useState(0);
  const [currentChar, setCurrentChar] = useState(0);
  const [doneItems, setDoneItems] = useState<boolean[]>(items.map(() => false));
  const [started, setStarted] = useState(false);
  const rafRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const startDelay = setTimeout(() => setStarted(true), 120);
    return () => clearTimeout(startDelay);
  }, []);

  useEffect(() => {
    if (!started) return;
    if (currentItem >= items.length) return;

    const text = items[currentItem];

    if (currentChar < text.length) {
      rafRef.current = setTimeout(() => {
        setDisplayedItems((prev) => {
          const next = [...prev];
          next[currentItem] = text.slice(0, currentChar + 1);
          return next;
        });
        setCurrentChar((c) => c + 1);
      }, 22);
    } else {
      setDoneItems((prev) => {
        const next = [...prev];
        next[currentItem] = true;
        return next;
      });
      rafRef.current = setTimeout(() => {
        setCurrentItem((i) => i + 1);
        setCurrentChar(0);
      }, 110);
    }

    return () => {
      if (rafRef.current) clearTimeout(rafRef.current);
    };
  }, [started, currentItem, currentChar, items]);

  return (
    <div className="numbered-story">
      {items.map((fullText, index) => {
        const isActive = index === currentItem && started;
        const isDone = doneItems[index];
        const text = isDone || !started ? fullText : displayedItems[index];

        return (
          <div className="numbered-row" key={index}>
            <span className="numbered-index">{index + 1}.</span>
            <span
              className={[
                "numbered-content",
                "typewriter-line",
                isActive ? "typewriter-active" : "",
                isDone ? "typewriter-done" : "",
                !started ? "typewriter-done" : "",
              ]
                .filter(Boolean)
                .join(" ")}
            >
              {text}
            </span>
          </div>
        );
      })}
    </div>
  );
}