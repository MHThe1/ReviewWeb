"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { Product } from "@/types";
import { getProducts } from "@/services/api";
import { useDebounce } from "@/hooks/useDebounce";
import StarRating from "@/components/StarRating";

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filter state
  const [search, setSearch] = useState("");
  const [minRating, setMinRating] = useState<string>("");
  const debouncedSearch = useDebounce(search, 400);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const filters: Record<string, string | number> = {};
      if (debouncedSearch.trim()) filters.search = debouncedSearch.trim();
      if (minRating) filters.min_rating = Number(minRating);

      const data = await getProducts(
        Object.keys(filters).length > 0 ? filters : undefined
      );
      setProducts(data);
    } catch {
      setError("Failed to load products. Is the backend running?");
    } finally {
      setLoading(false);
    }
  }, [debouncedSearch, minRating]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-stone-900 mb-6">Products</h1>

      {/* Search & Filter bar */}
      <div className="flex flex-col sm:flex-row gap-3 mb-8">
        <div className="relative flex-1">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search products..."
            className="w-full bg-white border border-stone-300 rounded-lg pl-10 pr-3 py-2 text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent shadow-sm"
          />
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
        </div>

        <select
          value={minRating}
          onChange={(e) => setMinRating(e.target.value)}
          className="bg-white border border-stone-300 rounded-lg px-3 py-2 text-stone-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent cursor-pointer shadow-sm"
        >
          <option value="">Any rating</option>
          <option value="2">2+ stars</option>
          <option value="3">3+ stars</option>
          <option value="4">4+ stars</option>
          <option value="4.5">4.5+ stars</option>
        </select>
      </div>

      {/* Content */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="bg-white rounded-xl border border-stone-200 overflow-hidden shadow-sm animate-pulse"
            >
              <div className="h-48 bg-stone-200" />
              <div className="p-4 space-y-3">
                <div className="h-5 bg-stone-200 rounded w-3/4" />
                <div className="h-4 bg-stone-200 rounded w-1/2" />
                <div className="h-4 bg-stone-200 rounded w-1/3" />
              </div>
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <p className="text-red-600">{error}</p>
        </div>
      ) : products.length === 0 ? (
        <div className="bg-white border border-stone-200 rounded-lg p-8 text-center shadow-sm">
          <p className="text-stone-500 text-lg">No products found.</p>
          {(search || minRating) && (
            <button
              onClick={() => {
                setSearch("");
                setMinRating("");
              }}
              className="text-indigo-600 hover:text-indigo-800 mt-2 cursor-pointer font-medium"
            >
              Clear filters
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <Link
              key={product.id}
              href={`/products/${product.id}`}
              className="bg-white rounded-xl border border-stone-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="h-48 bg-stone-100 flex items-center justify-center">
                {product.image_url ? (
                  <img
                    src={product.image_url}
                    alt={product.title}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <span className="text-stone-300 text-4xl">📦</span>
                )}
              </div>
              <div className="p-4">
                <h2 className="text-lg font-semibold text-stone-900 mb-2">
                  {product.title}
                </h2>
                <div className="flex items-center gap-2 mb-1">
                  <StarRating
                    rating={Math.round(product.average_rating || 0)}
                    size="sm"
                  />
                  <span className="text-sm font-medium text-stone-700">
                    {product.average_rating?.toFixed(1) ?? "N/A"}
                  </span>
                </div>
                <p className="text-sm text-stone-400">
                  {product.review_count}{" "}
                  {product.review_count === 1 ? "Review" : "Reviews"}
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
