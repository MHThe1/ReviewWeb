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
  sm: "text-sm",
  md: "text-lg",
  lg: "text-2xl",
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
    <div className="flex items-center gap-0.5">
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
                ? "cursor-pointer hover:scale-110 transition-transform"
                : "cursor-default"
            } ${filled ? "text-yellow-400" : "text-gray-300"}`}
            onClick={() => interactive && onChange?.(starIndex)}
            onMouseEnter={() => interactive && setHovered(starIndex)}
            onMouseLeave={() => interactive && setHovered(0)}
          >
            ★
          </button>
        );
      })}
    </div>
  );
}
