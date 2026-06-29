"use client";

import { useState, FormEvent } from "react";
import { Product } from "@/types";
import StarRating from "@/components/ui/StarRating";

interface AdminProductsTabProps {
  products: Product[];
  onAddProduct: (title: string, description: string, imageUrl: string) => Promise<void>;
  onLoadReviews: (productId: number) => void;
  onEditProduct: (product: Product) => void;
  onDeleteProduct: (product: Product) => void;
}

export default function AdminProductsTab({
  products,
  onAddProduct,
  onLoadReviews,
  onEditProduct,
  onDeleteProduct,
}: AdminProductsTabProps) {
  const [newTitle, setNewTitle] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [newImageUrl, setNewImageUrl] = useState("");
  const [addError, setAddError] = useState<string | null>(null);
  const [adding, setAdding] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setAddError(null);
    setAdding(true);
    try {
      await onAddProduct(newTitle, newDescription, newImageUrl);
      setNewTitle("");
      setNewDescription("");
      setNewImageUrl("");
    } catch (err: unknown) {
      setAddError(err instanceof Error ? err.message : "Failed to add product");
    } finally {
      setAdding(false);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in text-left">
      {/* Add Product Card Form */}
      <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm">
        <h2 className="text-base font-extrabold text-slate-900 mb-4 flex items-center gap-2">
          <svg
            className="text-indigo-600"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          Add New Product
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {addError && (
            <div className="bg-red-50 border border-red-100 text-red-600 text-sm rounded-xl p-3.5 font-medium">
              {addError}
            </div>
          )}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex flex-col">
              <input
                type="text"
                required
                placeholder="Product Title"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                className="w-full bg-slate-50/50 border border-slate-200/80 rounded-xl px-4 py-2.5 text-slate-900 placeholder:text-slate-400/80 focus:bg-white focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all duration-200 shadow-sm text-sm"
              />
            </div>
            <div className="flex flex-col">
              <input
                type="text"
                placeholder="Description (optional)"
                value={newDescription}
                onChange={(e) => setNewDescription(e.target.value)}
                className="w-full bg-slate-50/50 border border-slate-200/80 rounded-xl px-4 py-2.5 text-slate-900 placeholder:text-slate-400/80 focus:bg-white focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all duration-200 shadow-sm text-sm"
              />
            </div>
            <div className="flex flex-col">
              <input
                type="url"
                placeholder="Image URL (optional)"
                value={newImageUrl}
                onChange={(e) => setNewImageUrl(e.target.value)}
                className="w-full bg-slate-50/50 border border-slate-200/80 rounded-xl px-4 py-2.5 text-slate-900 placeholder:text-slate-400/80 focus:bg-white focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all duration-200 shadow-sm text-sm"
              />
            </div>
          </div>
          <button
            type="submit"
            disabled={adding}
            className="inline-flex items-center justify-center bg-gradient-to-r from-indigo-600 to-violet-600 text-white px-5 py-2.5 rounded-xl hover:shadow-lg hover:shadow-indigo-100 hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 transition-all font-bold cursor-pointer text-sm"
          >
            {adding ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Adding...
              </span>
            ) : (
              "Add Product"
            )}
          </button>
        </form>
      </div>

      {/* Products List */}
      <div className="space-y-4">
        <h2 className="text-base font-bold text-slate-900 mb-2 pl-1">Product Inventory</h2>
        {products.length === 0 ? (
          <div className="text-center py-8 bg-slate-50 border border-dashed border-slate-200 rounded-2xl">
            <p className="text-slate-400 text-sm font-semibold">No products created yet.</p>
          </div>
        ) : (
          products.map((product) => (
            <div
              key={product.id}
              className="bg-white border border-slate-100 rounded-2xl p-4 flex items-center justify-between gap-4 shadow-sm hover:shadow-md transition-all duration-200"
            >
              <div className="flex items-center gap-4 min-w-0">
                {product.image_url ? (
                  <img
                    src={product.image_url}
                    alt={product.title}
                    className="w-14 h-14 rounded-xl object-cover shrink-0 border border-slate-100"
                  />
                ) : (
                  <div className="w-14 h-14 rounded-xl bg-slate-50 flex items-center justify-center shrink-0 border border-slate-100 text-xl">
                    📦
                  </div>
                )}
                <div className="min-w-0">
                  <h3 className="font-bold text-slate-900 truncate text-sm">
                    {product.title}
                  </h3>
                  <div className="flex items-center gap-2 mt-1">
                    <StarRating
                      rating={Math.round(product.average_rating || 0)}
                      size="sm"
                    />
                    <span className="text-xs font-bold text-slate-400">
                      {product.review_count} {product.review_count === 1 ? "review" : "reviews"}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex gap-2 shrink-0">
                <button
                  onClick={() => onLoadReviews(product.id)}
                  className="text-xs font-bold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 px-3 py-2 rounded-xl transition-colors cursor-pointer"
                >
                  Reviews
                </button>
                <button
                  onClick={() => onEditProduct(product)}
                  className="text-xs font-bold text-slate-600 bg-slate-50 hover:bg-slate-100 px-3 py-2 rounded-xl transition-colors cursor-pointer"
                >
                  Edit
                </button>
                <button
                  onClick={() => onDeleteProduct(product)}
                  className="text-xs font-bold text-red-500 bg-red-50 hover:bg-red-100 px-3 py-2 rounded-xl transition-colors cursor-pointer"
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
