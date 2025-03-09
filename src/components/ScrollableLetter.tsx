"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowUp, faArrowDown } from "@fortawesome/free-solid-svg-icons";
import { useState, useEffect } from "react";
import { TypeAnimation } from "react-type-animation";

interface ScrollableLetterProps {
  sentences: string[];
}

const ScrollableLetter = ({ sentences }: ScrollableLetterProps) => {
  const [index, setIndex] = useState(0);
  const [isScrolling, setIsScrolling] = useState(false);

  useEffect(() => {
    const handleScroll = (event: Event) => {
      if (isScrolling) return;

      event.preventDefault();
      event.stopPropagation();

      const deltaY = (event as WheelEvent).deltaY;
      if (deltaY < 0) {
        if (index > 0) {
          setIndex(index - 1);
        }
      } else if (deltaY > 0) {
        if (index < sentences.length - 1) {
          setIndex(index + 1);
        }
      }

      setIsScrolling(true);
      setTimeout(() => {
        setIsScrolling(false);
      }, 500); // Adjust the timeout duration as needed
    };

    const handleTouchStart = (event: TouchEvent) => {
      const touchStartY = event.touches[0].clientY;

      const handleTouchMove = (moveEvent: TouchEvent) => {
        if (isScrolling) return;

        const touchEndY = moveEvent.touches[0].clientY;
        const deltaY = touchStartY - touchEndY;

        if (deltaY < 0) {
          if (index > 0) {
            setIndex(index - 1);
          }
        } else if (deltaY > 0) {
          if (index < sentences.length - 1) {
            setIndex(index + 1);
          }
        }

        setIsScrolling(true);
        setTimeout(() => {
          setIsScrolling(false);
        }, 500); // Adjust the timeout duration as needed
      };

      window.addEventListener("touchmove", handleTouchMove, { passive: false });

      window.addEventListener(
        "touchend",
        () => {
          window.removeEventListener("touchmove", handleTouchMove);
        },
        { once: true }
      );
    };

    window.addEventListener("wheel", handleScroll, { passive: false });
    window.addEventListener("touchstart", handleTouchStart, { passive: false });

    return () => {
      window.removeEventListener("wheel", handleScroll);
      window.removeEventListener("touchstart", handleTouchStart);
    };
  }, [index, sentences.length, isScrolling]);

  const scrollToIndex = (idx: number) => {
    const element = document.getElementById(`sentence-${idx}`);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  useEffect(() => {
    scrollToIndex(index);
  }, [index]);

  return (
    <div className="h-screen w-screen overflow-hidden relative">
      {index > 0 && (
        <button
          onClick={() => setIndex(index - 1)}
          className="fixed w-screen top-0 bg-gray-900 text-white py-2 rounded opacity-30 hover:opacity-50"
        >
          <FontAwesomeIcon icon={faArrowUp} />
        </button>
      )}
      {sentences.map((sentence, idx) => (
        <div
          id={`sentence-${idx}`}
          className="h-screen w-screen flex flex-col justify-center items-center"
          key={idx}
        >
          {index === idx ? (
            <TypeAnimation
              key={
                index === idx ? `animation-${idx}-${index}` : `animation-${idx}`
              }
              sequence={[sentence, 1000]} // Adjust the delay as needed
              wrapper="p"
              cursor={false}
              repeat={0}
              className="text-2xl text-center p-5"
            />
          ) : (
            <p className="text-2xl text-center p-5">{sentence}</p>
          )}
        </div>
      ))}
      {index < sentences.length - 1 && (
        <button
          onClick={() => setIndex(index + 1)}
          className="fixed bottom-0 w-screen bg-gray-900 text-white py-2 rounded opacity-30 hover:opacity-50"
        >
          <FontAwesomeIcon icon={faArrowDown} />
        </button>
      )}
    </div>
  );
};

export default ScrollableLetter;
