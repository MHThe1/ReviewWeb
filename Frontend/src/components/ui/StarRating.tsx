"use client";

import { useState } from "react";

interface StarRatingProps {
  rating?: number;
  max?: number;
  size?: "sm" | "md" | "lg";
  interactive?: boolean;
  onChange?: (rating: number) => void;
}

const sizeMap = {
  sm: "w-4 h-4",
  md: "w-5.5 h-5.5",
  lg: "w-8 h-8",
};

export default function StarRating({
  rating = 0,
  max = 5,
  size = "md",
  interactive = false,
  onChange,
}: StarRatingProps) {
  const [hovered, setHovered] = useState(0);

  const displayRating = interactive && hovered > 0 ? hovered : rating;

  return (
    <div className="flex items-center gap-0.5 select-none">
      {Array.from({ length: max }, (_, i) => {
        const starIndex = i + 1;
        const filled = starIndex <= displayRating;

        return (
          <button
            key={i}
            type="button"
            disabled={!interactive}
            className={`${sizeMap[size]} ${
              interactive
                ? "cursor-pointer hover:scale-120 hover:-rotate-6 active:scale-95 transition-all duration-150"
                : "cursor-default"
            } focus:outline-none`}
            onClick={() => interactive && onChange?.(starIndex)}
            onMouseEnter={() => interactive && setHovered(starIndex)}
            onMouseLeave={() => interactive && setHovered(0)}
            aria-label={`Rate ${starIndex} out of ${max}`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill={filled ? "currentColor" : "none"}
              stroke={filled ? "none" : "currentColor"}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className={`w-full h-full transition-colors duration-150 ${
                filled
                  ? "text-amber-400 drop-shadow-[0_2px_5px_rgba(245,158,11,0.35)]"
                  : "text-slate-300 hover:text-slate-400"
              }`}
            >
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
            </svg>
          </button>
        );
      })}
    </div>
  );
}

