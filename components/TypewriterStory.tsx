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
  const rafRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
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
      // Line done — remove cursor from this line, move to next
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
  }, [currentItem, currentChar, items]);

  return (
    <div className="numbered-story">
      {items.map((_, index) => (
        <div className="numbered-row" key={index}>
          <span className="numbered-index">{index + 1}.</span>
          <span
            className={[
              "numbered-content",
              "typewriter-line",
              index === currentItem ? "typewriter-active" : "",
              doneItems[index] ? "typewriter-done" : "",
            ]
              .filter(Boolean)
              .join(" ")}
          >
            {displayedItems[index]}
          </span>
        </div>
      ))}
    </div>
  );
}