"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { Product } from "@/types";
import { getProducts } from "@/services/api";
import { useDebounce } from "@/hooks/useDebounce";
import StarRating from "@/components/ui/StarRating";
import ProductCard from "@/components/products/ProductCard";

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
    <div className="grid-bg min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Modern light Hero Section */}
        <div className="relative overflow-hidden bg-gradient-to-tr from-indigo-50/80 via-purple-50/50 to-pink-50/30 border border-indigo-100/30 rounded-3xl p-8 sm:p-12 mb-10 shadow-sm">
          {/* Subtle gradient blobs */}
          <div className="absolute -right-12 -top-12 w-64 h-64 bg-indigo-200/25 rounded-full blur-3xl" />
          <div className="absolute -left-12 -bottom-12 w-64 h-64 bg-purple-200/25 rounded-full blur-3xl" />

          <div className="relative z-10 max-w-2xl animate-fade-in">
            <h1 className="text-3xl sm:text-4.5xl font-extrabold tracking-tight mb-4 leading-tight text-slate-900">
              Honest Feedback. <br />
              <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-violet-600 bg-clip-text text-transparent">
                Better Tech Decisions.
              </span>
            </h1>
            <p className="text-slate-500 text-sm sm:text-base leading-relaxed max-w-xl">
              Explore real reviews from verified users on tech gadgets and workspace accessories to find the perfect gear.
            </p>
          </div>
        </div>

        {/* Search & Filter bar */}
        <div className="flex flex-col sm:flex-row gap-3 mb-8 animate-fade-in">
          <div className="relative flex-1">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search products by title..."
              className="w-full bg-white border border-slate-200/80 rounded-2xl pl-11 pr-4 py-3 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all duration-200 shadow-sm text-sm"
            />
            <svg
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </div>

          <div className="relative">
            <select
              value={minRating}
              onChange={(e) => setMinRating(e.target.value)}
              className="w-full sm:w-auto appearance-none bg-white border border-slate-200/80 rounded-2xl pl-4 pr-10 py-3 text-slate-700 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 cursor-pointer shadow-sm text-sm transition-all duration-200"
            >
              <option value="">Any rating</option>
              <option value="2">2+ stars</option>
              <option value="3">3+ stars</option>
              <option value="4">4+ stars</option>
              <option value="4.5">4.5+ stars</option>
            </select>
            <svg
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm animate-pulse"
              >
                <div className="h-48 bg-slate-100" />
                <div className="p-5 space-y-3">
                  <div className="h-5 bg-slate-100 rounded-lg w-3/4" />
                  <div className="h-4 bg-slate-100 rounded-lg w-5/6" />
                  <div className="h-4 bg-slate-100 rounded-lg w-1/3" />
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-100 rounded-2xl p-6 text-center shadow-sm">
            <p className="text-red-600 font-semibold">{error}</p>
          </div>
        ) : products.length === 0 ? (
          <div className="bg-white border border-slate-100 rounded-2xl p-10 text-center shadow-sm max-w-md mx-auto animate-fade-in">
            <span className="text-4xl mb-4 block">🔍</span>
            <p className="text-slate-500 font-semibold text-lg">No products found.</p>
            {(search || minRating) && (
              <button
                onClick={() => {
                  setSearch("");
                  setMinRating("");
                }}
                className="bg-indigo-50 text-indigo-600 px-4 py-2 rounded-xl hover:bg-indigo-100 transition-all font-bold text-sm cursor-pointer mt-3"
              >
                Clear filters
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

