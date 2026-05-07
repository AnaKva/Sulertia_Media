"use client";

import { useEffect, useRef, useState } from "react";

interface Props {
  items: string[];
}

export default function TypewriterStory({ items }: Props) {
  const [displayedItems, setDisplayedItems] = useState<string[]>(
    items.map(() => ""),
  );

  const [currentItem, setCurrentItem] = useState(0);
  const [currentChar, setCurrentChar] = useState(0);
  const [done, setDone] = useState(false);
  const [started, setStarted] = useState(false);

  const [globalIndex, setGlobalIndex] = useState(-1);

  const rafRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const readRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    const startDelay = setTimeout(() => setStarted(true), 120);
    return () => clearTimeout(startDelay);
  }, []);

  // flatten words once
  const flatWords: { item: number; word: number }[] = [];
  items.forEach((text, itemIndex) => {
    text.split(" ").forEach((_, wordIndex) => {
      flatWords.push({ item: itemIndex, word: wordIndex });
    });
  });

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
      setCurrentItem((i) => i + 1);
      setCurrentChar(0);
    }

    // start reading after last line finishes
    if (currentItem === items.length - 1 && currentChar >= text.length) {
      setDone(true);

      setTimeout(() => {
        let i = 0;

        readRef.current = setInterval(() => {
          setGlobalIndex(i);
          i++;

          if (i >= flatWords.length) {
            clearInterval(readRef.current!);
          }
        }, 350);
      }, 400);
    }

    return () => {
      if (rafRef.current) clearTimeout(rafRef.current);
    };
  }, [started, currentItem, currentChar, items]);

  return (
    <div className="numbered-story">
      {items.map((fullText, itemIndex) => {
        const text = done || !started ? fullText : displayedItems[itemIndex];

        const words = text.split(" ");

        return (
          <div className="numbered-row" key={itemIndex}>
            <span className="numbered-index">{itemIndex + 1}.</span>

            <span className="numbered-content">
              {words.map((word, wordIndex) => {
                const flatPos = flatWords.findIndex(
                  (w) => w.item === itemIndex && w.word === wordIndex,
                );

                const isActive = flatPos === globalIndex;

                return (
                  <span
                    key={wordIndex}
                    style={{
                      color: isActive ? "orange" : "white",
                      transition: "color 0.2s ease",
                      display: "inline",
                    }}
                  >
                    {word}&nbsp;
                  </span>
                );
              })}
            </span>
          </div>
        );
      })}
    </div>
  );
}
