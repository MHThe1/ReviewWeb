"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Product } from "@/types";
import { getProducts } from "@/services/api";
import StarRating from "@/components/StarRating";

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getProducts()
      .then(setProducts)
      .catch(() => setError("Failed to load products. Is the backend running?"))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Products</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="bg-white rounded-xl border border-gray-200 overflow-hidden animate-pulse">
              <div className="h-48 bg-gray-200" />
              <div className="p-4 space-y-3">
                <div className="h-5 bg-gray-200 rounded w-3/4" />
                <div className="h-4 bg-gray-200 rounded w-1/2" />
                <div className="h-4 bg-gray-200 rounded w-1/3" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <p className="text-red-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Products</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <Link
            key={product.id}
            href={`/products/${product.id}`}
            className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow"
          >
            <div className="h-48 bg-gray-100 flex items-center justify-center">
              {product.image_url ? (
                <img
                  src={product.image_url}
                  alt={product.title}
                  className="h-full w-full object-cover"
                />
              ) : (
                <span className="text-gray-400 text-4xl">📦</span>
              )}
            </div>
            <div className="p-4">
              <h2 className="text-lg font-semibold text-gray-900 mb-2">
                {product.title}
              </h2>
              <div className="flex items-center gap-2 mb-1">
                <StarRating rating={Math.round(product.average_rating || 0)} size="sm" />
                <span className="text-sm font-medium text-gray-700">
                  {product.average_rating?.toFixed(1) ?? "N/A"}
                </span>
              </div>
              <p className="text-sm text-gray-500">
                {product.review_count} {product.review_count === 1 ? "Review" : "Reviews"}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
