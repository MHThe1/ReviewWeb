"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ProductDetail, ReviewInProduct } from "@/types";
import { getProduct, updateReview, deleteReview } from "@/services/api";
import { useAuth } from "@/context/AuthContext";
import StarRating from "@/components/StarRating";
import ReviewForm from "@/components/ReviewForm";
import ConfirmModal from "@/components/ConfirmModal";

export default function ProductDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();

  const [product, setProduct] = useState<ProductDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // E-commerce Magnifying Zoom State
  const [zoomStyle, setZoomStyle] = useState<React.CSSProperties>({
    transformOrigin: "center center",
    transform: "scale(1)",
  });

  // State to track review being deleted for custom overlay modal
  const [deletingReviewId, setDeletingReviewId] = useState<number | null>(null);

  async function executeDeleteReview() {
    if (deletingReviewId === null) return;
    try {
      await deleteReview(deletingReviewId);
      fetchProduct();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to delete review");
    } finally {
      setDeletingReviewId(null);
    }
  }

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setZoomStyle({
      transformOrigin: `${x}% ${y}%`,
      transform: "scale(2.2)",
    });
  };

  const handleMouseLeave = () => {
    setZoomStyle({
      transformOrigin: "center center",
      transform: "scale(1)",
    });
  };

  const fetchProduct = useCallback(async () => {
    try {
      const data = await getProduct(Number(id));
      setProduct(data);
    } catch {
      setError("Failed to load product.");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchProduct();
  }, [fetchProduct]);

  if (loading) {
    return (
      <div className="grid-bg min-h-screen py-10">
        <div className="max-w-5xl mx-auto px-4">
          <div className="animate-pulse space-y-6">
            <div className="h-6 bg-slate-200 rounded-lg w-28" />
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              <div className="lg:col-span-5 space-y-6">
                <div className="h-72 bg-slate-200 rounded-2xl" />
                <div className="h-40 bg-slate-200 rounded-2xl" />
              </div>
              <div className="lg:col-span-7 space-y-4">
                <div className="h-10 bg-slate-200 rounded-lg w-1/3" />
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-28 bg-slate-200 rounded-2xl" />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="grid-bg min-h-screen py-10">
        <div className="max-w-md mx-auto px-4">
          <div className="bg-white border border-red-100 rounded-2xl p-6 text-center shadow-sm">
            <span className="text-4xl mb-4 block">⚠️</span>
            <p className="text-red-600 font-semibold mb-4">{error || "Product not found"}</p>
            <Link 
              href="/" 
              className="inline-flex items-center gap-2 bg-slate-50 text-slate-700 px-4 py-2 rounded-xl border border-slate-200 hover:bg-slate-100 transition-colors text-sm font-semibold"
            >
              ← Back to products
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const userReview = user
    ? product.reviews.find((r) => r.user_name === user.name)
    : undefined;

  return (
    <div className="grid-bg min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 animate-fade-in">
        {/* Sleek back arrow */}
        <Link 
          href="/" 
          className="inline-flex items-center gap-2 text-indigo-600 hover:text-indigo-800 text-sm font-bold mb-6 group transition-colors duration-200"
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width="16" 
            height="16" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="3.5" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            className="group-hover:-translate-x-1 transition-transform duration-200"
          >
            <line x1="19" y1="12" x2="5" y2="12" />
            <polyline points="12 19 5 12 12 5" />
          </svg>
          Back to products
        </Link>
        {/* Top Section - Product info horizontal layout */}
        <div className="bg-white border border-slate-100 rounded-3xl overflow-hidden shadow-sm p-6 sm:p-8 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            {/* Left: Interactive zoom image */}
            {product.image_url && (
              <div 
                className="aspect-square bg-slate-50 flex items-center justify-center relative overflow-hidden border border-slate-100 rounded-2xl cursor-zoom-in"
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
              >
                <img
                  src={product.image_url}
                  alt={product.title}
                  className="w-full h-full object-cover transition-transform duration-100 ease-out pointer-events-none"
                  style={zoomStyle}
                />
              </div>
            )}

            {/* Right: Product Text Details & Rating summary */}
            <div className="flex flex-col h-full justify-between py-2">
              <div>
                <h1 className="text-2xl sm:text-3.5xl font-black text-slate-900 tracking-tight mb-4">
                  {product.title}
                </h1>
                {product.description && (
                  <p className="text-slate-500 text-sm sm:text-base leading-relaxed mb-6">
                    {product.description}
                  </p>
                )}
              </div>

              <div className="flex items-center gap-4 bg-slate-50/50 p-4 sm:p-5 rounded-2xl border border-slate-100 mt-auto">
                <div className="text-center pr-5 border-r border-slate-200">
                  <span className="text-3xl sm:text-4xl font-extrabold text-slate-900 block leading-none mb-1">
                    {product.average_rating?.toFixed(1) ?? "0.0"}
                  </span>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Out of 5</span>
                </div>
                <div>
                  <div className="flex items-center gap-1.5 mb-1.5">
                    <StarRating rating={Math.round(product.average_rating || 0)} size="sm" />
                  </div>
                  <span className="text-xs sm:text-sm font-semibold text-slate-400">
                    Based on {product.review_count} {product.review_count === 1 ? "review" : "reviews"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section - Review Composer & Timeline */}
        {user && !userReview ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mt-10">
            {/* Left: Review form */}
            <div className="lg:col-span-5 space-y-6">
              <ReviewForm productId={product.id} onSuccess={fetchProduct} />
            </div>

            {/* Right: Timeline chronological reviews */}
            <div className="lg:col-span-7 space-y-6">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h2 className="text-lg font-extrabold text-slate-900">
                  Reviews Timeline ({product.reviews.length})
                </h2>
              </div>

              {product.reviews.length === 0 ? (
                <div className="bg-white border border-slate-100 rounded-2xl p-10 text-center shadow-sm">
                  <span className="text-4xl mb-3 block">✍️</span>
                  <p className="text-slate-400 font-semibold text-base">No reviews yet.</p>
                  <p className="text-slate-400 text-xs mt-1">Be the first to review this product!</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {product.reviews.map((review) => (
                    <ReviewCard
                      key={review.id}
                      review={review}
                      isOwn={user?.name === review.user_name}
                      onUpdated={fetchProduct}
                      onDelete={() => setDeletingReviewId(review.id)}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="max-w-3xl mx-auto mt-10 space-y-6">
            {!user && (
              <div className="bg-gradient-to-r from-indigo-50/40 via-purple-50/40 to-pink-50/40 border border-slate-100 rounded-2xl p-6 text-center shadow-xs">
                <p className="text-slate-600 text-sm font-semibold">
                  Share your experience with this product!{" "}
                  <Link href="/login" className="text-indigo-600 hover:text-indigo-800 underline transition-colors">
                    Login here
                  </Link>{" "}
                  to write a review.
                </p>
              </div>
            )}

            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h2 className="text-lg font-extrabold text-slate-900">
                Reviews Timeline ({product.reviews.length})
              </h2>
            </div>

            {product.reviews.length === 0 ? (
              <div className="bg-white border border-slate-100 rounded-2xl p-10 text-center shadow-sm">
                <span className="text-4xl mb-3 block">✍️</span>
                <p className="text-slate-400 font-semibold text-base">No reviews yet.</p>
                <p className="text-slate-400 text-xs mt-1">Be the first to review this product!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {product.reviews.map((review) => (
                  <ReviewCard
                    key={review.id}
                    review={review}
                    isOwn={user?.name === review.user_name}
                    onUpdated={fetchProduct}
                    onDelete={() => setDeletingReviewId(review.id)}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Screen Overlay Confirm Modal (Outside animated container to avoid transform coordinate traps) */}
      <ConfirmModal
        isOpen={deletingReviewId !== null}
        onClose={() => setDeletingReviewId(null)}
        onConfirm={executeDeleteReview}
        title="Delete Review"
        message="Are you sure you want to delete this review? This action cannot be undone."
      />
    </div>
  );
}

// --- Review card sub-component ---

function ReviewCard({
  review,
  isOwn,
  onUpdated,
  onDelete,
}: {
  review: ReviewInProduct;
  isOwn: boolean;
  onUpdated: () => void;
  onDelete: () => void;
}) {
  const [editing, setEditing] = useState(false);
  const [editRating, setEditRating] = useState(review.rating);
  const [editComment, setEditComment] = useState(review.comment);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
      <div className="bg-white border border-indigo-200 rounded-2xl p-5 space-y-4 shadow-sm animate-fade-in">
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
    <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-xs hover:shadow-md hover:border-slate-200/50 transition-all duration-300">
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

