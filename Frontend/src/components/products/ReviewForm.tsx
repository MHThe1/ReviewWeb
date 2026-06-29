"use client";

import { useState, FormEvent } from "react";
import { createReview } from "@/services/api";
import StarRating from "@/components/ui/StarRating";

interface ReviewFormProps {
  productId: number;
  onSuccess: () => void;
}

export default function ReviewForm({ productId, onSuccess }: ReviewFormProps) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (rating === 0) {
      setError("Please select a rating");
      return;
    }

    setError(null);
    setSubmitting(true);

    try {
      await createReview({ product_id: productId, rating, comment });
      setRating(0);
      setComment("");
      onSuccess();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to submit review");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm transition-all hover:shadow-md">
      <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-indigo-500">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        </svg>
        Write a Review
      </h3>

      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="bg-red-50 border border-red-100 text-red-600 text-sm rounded-xl p-3.5 font-medium">
            {error}
          </div>
        )}

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
            Rating
          </label>
          <div className="py-1">
            <StarRating rating={rating} interactive onChange={setRating} size="lg" />
          </div>
        </div>

        <div>
          <label htmlFor="comment" className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
            Comment
          </label>
          <textarea
            id="comment"
            required
            rows={4}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="w-full bg-slate-50/50 border border-slate-200/80 rounded-xl px-4 py-3 text-slate-900 placeholder:text-slate-400/80 focus:bg-white focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all duration-200 shadow-sm resize-none"
            placeholder="Share your thoughts about this product..."
          />
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="w-full sm:w-auto inline-flex items-center justify-center bg-gradient-to-r from-indigo-600 to-violet-600 text-white px-6 py-2.5 rounded-xl hover:shadow-lg hover:shadow-indigo-100 hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 disabled:pointer-events-none transition-all font-semibold cursor-pointer text-sm"
        >
          {submitting ? (
            <span className="flex items-center gap-2">
              <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Submitting...
            </span>
          ) : (
            "Submit Review"
          )}
        </button>
      </form>
    </div>
  );
}

