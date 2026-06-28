"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ProductDetail, ReviewInProduct } from "@/types";
import { getProduct, updateReview, deleteReview } from "@/services/api";
import { useAuth } from "@/context/AuthContext";
import StarRating from "@/components/StarRating";
import ReviewForm from "@/components/ReviewForm";

export default function ProductDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();

  const [product, setProduct] = useState<ProductDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/3" />
          <div className="h-64 bg-gray-200 rounded-xl" />
          <div className="h-6 bg-gray-200 rounded w-1/4" />
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-24 bg-gray-200 rounded-lg" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <p className="text-red-600">{error || "Product not found"}</p>
          <Link href="/" className="text-blue-600 hover:underline mt-2 inline-block">
            ← Back to products
          </Link>
        </div>
      </div>
    );
  }

  // Check if current user already has a review
  const userReview = user
    ? product.reviews.find((r) => r.user_name === user.name)
    : undefined;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Back link */}
      <Link href="/" className="text-blue-600 hover:underline text-sm mb-6 inline-block">
        ← Back to products
      </Link>

      {/* Product header */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden mb-8">
        {product.image_url && (
          <img
            src={product.image_url}
            alt={product.title}
            className="w-full h-64 object-cover"
          />
        )}
        <div className="p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-3">{product.title}</h1>
          {product.description && (
            <p className="text-gray-600 mb-4">{product.description}</p>
          )}
          <div className="flex items-center gap-3">
            <StarRating rating={Math.round(product.average_rating || 0)} size="lg" />
            <span className="text-lg font-semibold text-gray-800">
              {product.average_rating?.toFixed(1) ?? "N/A"}
            </span>
            <span className="text-gray-500">
              ({product.review_count} {product.review_count === 1 ? "review" : "reviews"})
            </span>
          </div>
        </div>
      </div>

      {/* Review form */}
      {user && !userReview && (
        <div className="mb-8">
          <ReviewForm productId={product.id} onSuccess={fetchProduct} />
        </div>
      )}

      {!user && (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-8 text-center">
          <p className="text-gray-600">
            <Link href="/login" className="text-blue-600 hover:underline font-medium">
              Login
            </Link>{" "}
            to write a review.
          </p>
        </div>
      )}

      {/* Reviews list */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Reviews ({product.reviews.length})
        </h2>

        {product.reviews.length === 0 ? (
          <p className="text-gray-500 text-center py-8">
            No reviews yet. Be the first to review this product!
          </p>
        ) : (
          <div className="space-y-4">
            {product.reviews.map((review) => (
              <ReviewCard
                key={review.id}
                review={review}
                isOwn={user?.name === review.user_name}
                onUpdated={fetchProduct}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// --- Review card sub-component ---

function ReviewCard({
  review,
  isOwn,
  onUpdated,
}: {
  review: ReviewInProduct;
  isOwn: boolean;
  onUpdated: () => void;
}) {
  const [editing, setEditing] = useState(false);
  const [editRating, setEditRating] = useState(review.rating);
  const [editComment, setEditComment] = useState(review.comment);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

  async function handleDelete() {
    if (!confirm("Delete this review?")) return;
    try {
      await deleteReview(review.id);
      onUpdated();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Delete failed");
    }
  }

  if (editing) {
    return (
      <div className="bg-white border border-blue-200 rounded-lg p-4 space-y-3">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded p-2">
            {error}
          </div>
        )}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Rating</label>
          <StarRating rating={editRating} interactive onChange={setEditRating} />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Comment</label>
          <textarea
            value={editComment}
            onChange={(e) => setEditComment(e.target.value)}
            rows={3}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleSave}
            disabled={saving}
            className="bg-blue-600 text-white px-4 py-1.5 rounded-lg text-sm hover:bg-blue-700 disabled:opacity-50 cursor-pointer"
          >
            {saving ? "Saving..." : "Save"}
          </button>
          <button
            onClick={() => {
              setEditing(false);
              setEditRating(review.rating);
              setEditComment(review.comment);
            }}
            className="text-gray-600 px-4 py-1.5 rounded-lg text-sm hover:bg-gray-100 cursor-pointer"
          >
            Cancel
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded p-2 mb-2">
          {error}
        </div>
      )}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="font-medium text-gray-900">{review.user_name}</span>
            <StarRating rating={review.rating} size="sm" />
          </div>
          <p className="text-gray-700">{review.comment}</p>
          <p className="text-xs text-gray-400 mt-2">
            {new Date(review.created_at).toLocaleDateString()}
          </p>
        </div>
        {isOwn && (
          <div className="flex gap-2 ml-4 shrink-0">
            <button
              onClick={() => setEditing(true)}
              className="text-sm text-blue-600 hover:underline cursor-pointer"
            >
              Edit
            </button>
            <button
              onClick={handleDelete}
              className="text-sm text-red-600 hover:underline cursor-pointer"
            >
              Delete
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
