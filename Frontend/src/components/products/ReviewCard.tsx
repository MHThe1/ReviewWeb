"use client";

import { useState, useEffect } from "react";
import { ReviewInProduct } from "@/types";
import { updateReview } from "@/services/api";
import StarRating from "@/components/ui/StarRating";

interface ReviewCardProps {
  review: ReviewInProduct;
  isOwn: boolean;
  onUpdated: () => void;
  onDelete: () => void;
}

export default function ReviewCard({
  review,
  isOwn,
  onUpdated,
  onDelete,
}: ReviewCardProps) {
  const [editing, setEditing] = useState(false);
  const [editRating, setEditRating] = useState(review.rating);
  const [editComment, setEditComment] = useState(review.comment);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Sync edits if review changes
  useEffect(() => {
    setEditRating(review.rating);
    setEditComment(review.comment);
    setError(null);
  }, [review]);

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  async function handleSave() {
    setSaving(true);
    setError(null);
    try {
      await updateReview(review.id, { rating: editRating, comment: editComment });
      setEditing(false);
      onUpdated();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Update failed");
    } finally {
      setSaving(false);
    }
  }

  if (editing) {
    return (
      <div className="bg-white border border-indigo-200 rounded-2xl p-5 space-y-4 shadow-sm animate-fade-in text-left">
        {error && (
          <div className="bg-red-50 border border-red-100 text-red-600 text-sm rounded-xl p-3 font-semibold">
            {error}
          </div>
        )}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">Rating</label>
          <div className="py-1">
            <StarRating rating={editRating} interactive onChange={setEditRating} size="md" />
          </div>
        </div>
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">Comment</label>
          <textarea
            value={editComment}
            onChange={(e) => setEditComment(e.target.value)}
            rows={3}
            className="w-full bg-slate-50/50 border border-slate-200/80 rounded-xl px-4 py-2.5 text-slate-900 placeholder:text-slate-400/80 focus:bg-white focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all duration-200 shadow-sm resize-none"
          />
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleSave}
            disabled={saving}
            className="bg-indigo-600 text-white px-4 py-2 rounded-xl text-xs font-bold hover:bg-indigo-700 disabled:opacity-50 cursor-pointer hover:shadow-md transition-all duration-150"
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
          <button
            onClick={() => {
              setEditing(false);
              setEditRating(review.rating);
              setEditComment(review.comment);
            }}
            className="text-slate-500 bg-slate-50 hover:bg-slate-100 px-4 py-2 rounded-xl text-xs font-bold cursor-pointer transition-all duration-150"
          >
            Cancel
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-xs hover:shadow-md hover:border-slate-200/50 transition-all duration-300 text-left">
      {error && (
        <div className="bg-red-50 border border-red-100 text-red-600 text-sm rounded-xl p-3 mb-3 font-semibold">
          {error}
        </div>
      )}
      <div className="flex items-start justify-between">
        <div className="flex gap-4">
          <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-indigo-100 to-purple-100 flex items-center justify-center text-indigo-700 text-xs font-bold shadow-inner shrink-0 mt-0.5">
            {getInitials(review.user_name)}
          </div>
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center gap-1.5 mb-1.5">
              <span className="font-bold text-slate-800 text-sm leading-none">{review.user_name}</span>
              <div className="flex items-center gap-1">
                <span className="text-[10px] text-slate-300 hidden sm:inline">•</span>
                <StarRating rating={review.rating} size="sm" />
              </div>
            </div>
            <p className="text-slate-600 text-sm leading-relaxed">{review.comment}</p>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-2.5">
              {new Date(review.created_at).toLocaleDateString(undefined, {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
              })}
            </p>
          </div>
        </div>
        {isOwn && (
          <div className="flex gap-1.5 ml-4 shrink-0">
            <button
              onClick={() => setEditing(true)}
              className="text-[11px] font-extrabold text-indigo-600 bg-indigo-50/70 hover:bg-indigo-100/70 px-2.5 py-1.5 rounded-lg cursor-pointer transition-all duration-150"
            >
              Edit
            </button>
            <button
              onClick={onDelete}
              className="text-[11px] font-extrabold text-red-500 bg-red-50/70 hover:bg-red-100/70 px-2.5 py-1.5 rounded-lg cursor-pointer transition-all duration-150"
            >
              Delete
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
