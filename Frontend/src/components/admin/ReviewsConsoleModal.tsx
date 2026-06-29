"use client";

import { useEffect } from "react";
import StarRating from "@/components/ui/StarRating";

interface ReviewItem {
  id: number;
  user_name: string;
  rating: number;
  comment: string;
}

interface ReviewsConsoleModalProps {
  isOpen: boolean;
  onClose: () => void;
  productTitle: string;
  reviews: ReviewItem[];
  onDeleteReview: (reviewId: number) => void;
}

export default function ReviewsConsoleModal({
  isOpen,
  onClose,
  productTitle,
  reviews,
  onDeleteReview,
}: ReviewsConsoleModalProps) {
  // Escape key dismiss
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-fade-in"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-2xl bg-white border border-slate-100 rounded-3xl shadow-xl flex flex-col max-h-[80vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4.5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="text-left">
            <h2 className="text-base font-extrabold text-slate-900">
              Reviews Console
            </h2>
            <p className="text-xs text-slate-400 font-semibold mt-0.5">
              {productTitle}
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer font-bold text-sm"
            aria-label="Close modal"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-4 flex-1">
          {reviews.length === 0 ? (
            <div className="text-center py-10">
              <span className="text-3xl mb-2.5 block select-none">💬</span>
              <p className="text-slate-400 font-semibold text-sm">No reviews present on this product.</p>
            </div>
          ) : (
            <div className="space-y-3 text-left">
              {reviews.map((r) => (
                <div
                  key={r.id}
                  className="border border-slate-100 rounded-2xl p-4 flex items-start justify-between hover:border-slate-200 transition-colors"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                      <span className="font-bold text-slate-800 text-sm leading-none">
                        {r.user_name}
                      </span>
                      <StarRating rating={r.rating} size="sm" />
                    </div>
                    <p className="text-slate-600 text-xs sm:text-sm leading-relaxed break-words">{r.comment}</p>
                  </div>
                  <button
                    onClick={() => onDeleteReview(r.id)}
                    className="text-[11px] font-bold text-red-500 bg-red-50 hover:bg-red-100 px-3 py-2 rounded-xl cursor-pointer transition-colors shrink-0 ml-4"
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-100 flex justify-end bg-slate-50/50">
          <button
            onClick={onClose}
            className="text-xs font-bold text-slate-500 hover:text-slate-800 bg-slate-100 hover:bg-slate-200 px-4 py-2 rounded-xl transition-all cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
