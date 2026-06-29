"use client";

import { useEffect, useState, useCallback, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Product } from "@/types";
import { useAuth } from "@/context/AuthContext";
import {
  getProducts,
  adminCreateProduct,
  adminDeleteProduct,
  adminDeleteReview,
  adminGetUsers,
  getProduct,
} from "@/services/api";
import StarRating from "@/components/StarRating";
import ConfirmModal from "@/components/ConfirmModal";

interface AdminUser {
  id: number;
  name: string;
  email: string;
  is_admin: boolean;
  created_at: string;
}

export default function AdminPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  const [products, setProducts] = useState<Product[]>([]);
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"products" | "users">("products");

  // Add product form
  const [newTitle, setNewTitle] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [newImageUrl, setNewImageUrl] = useState("");
  const [addError, setAddError] = useState<string | null>(null);
  const [adding, setAdding] = useState(false);

  // Review deletion
  const [selectedProduct, setSelectedProduct] = useState<number | null>(null);
  const [productReviews, setProductReviews] = useState<
    { id: number; user_name: string; rating: number; comment: string }[]
  >([]);

  // Custom Confirmation Modal State
  const [deleteConfirm, setDeleteConfirm] = useState<{
    type: "product" | "review";
    id: number;
    title?: string;
  } | null>(null);

  const fetchProducts = useCallback(async () => {
    try {
      const data = await getProducts();
      setProducts(data);
    } catch {
      // silent
    }
  }, []);

  const fetchUsers = useCallback(async () => {
    try {
      const data = await adminGetUsers();
      setUsers(data);
    } catch {
      // silent
    }
  }, []);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
      return;
    }
    if (!authLoading && user && !user.is_admin) {
      router.push("/");
      return;
    }
    if (user?.is_admin) {
      Promise.all([fetchProducts(), fetchUsers()]).finally(() =>
        setLoading(false)
      );
    }
  }, [user, authLoading, router, fetchProducts, fetchUsers]);

  async function handleAddProduct(e: FormEvent) {
    e.preventDefault();
    setAddError(null);
    setAdding(true);
    try {
      await adminCreateProduct({
        title: newTitle,
        description: newDescription || undefined,
        image_url: newImageUrl || undefined,
      });
      setNewTitle("");
      setNewDescription("");
      setNewImageUrl("");
      fetchProducts();
    } catch (err: unknown) {
      setAddError(err instanceof Error ? err.message : "Failed to add product");
    } finally {
      setAdding(false);
    }
  }

  async function handleDeleteProduct(id: number) {
    try {
      await adminDeleteProduct(id);
      fetchProducts();
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Failed to delete");
    }
  }

  async function handleLoadReviews(productId: number) {
    setSelectedProduct(productId);
    try {
      const detail = await getProduct(productId);
      setProductReviews(detail.reviews);
    } catch {
      setProductReviews([]);
    }
  }

  async function handleDeleteReview(reviewId: number) {
    try {
      await adminDeleteReview(reviewId);
      if (selectedProduct) handleLoadReviews(selectedProduct);
      fetchProducts();
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Failed to delete review");
    }
  }

  if (authLoading || loading) {
    return (
      <div className="grid-bg min-h-screen py-10">
        <div className="max-w-6xl mx-auto px-4">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-slate-200 rounded-lg w-1/4" />
            <div className="h-10 bg-slate-200 rounded-xl w-1/3" />
            <div className="h-64 bg-slate-200 rounded-2xl" />
          </div>
        </div>
      </div>
    );
  }

  if (!user?.is_admin) return null;

  return (
    <div className="grid-bg min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 animate-fade-in">
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-6">
          Admin Portal
        </h1>

        {/* Tab switcher pills */}
        <div className="flex gap-2 mb-8 border-b border-slate-100 pb-3">
          <button
            onClick={() => setActiveTab("products")}
            className={`px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-xl transition-all cursor-pointer ${
              activeTab === "products"
                ? "bg-indigo-600 text-white shadow-sm shadow-indigo-100"
                : "text-slate-400 hover:text-slate-600 hover:bg-slate-100/50"
            }`}
          >
            Products ({products.length})
          </button>
          <button
            onClick={() => setActiveTab("users")}
            className={`px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-xl transition-all cursor-pointer ${
              activeTab === "users"
                ? "bg-indigo-600 text-white shadow-sm shadow-indigo-100"
                : "text-slate-400 hover:text-slate-600 hover:bg-slate-100/50"
            }`}
          >
            Users ({users.length})
          </button>
        </div>

        {/* Products Tab */}
        {activeTab === "products" && (
          <div className="space-y-8">
            {/* Add Product Form */}
            <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm">
              <h2 className="text-base font-bold text-slate-900 mb-4 flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-indigo-500">
                  <line x1="12" y1="5" x2="12" y2="19" />
                  <line x1="5" y1="12" x2="19" y2="12" />
                </svg>
                Add New Product
              </h2>
              <form onSubmit={handleAddProduct} className="space-y-4">
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
              {products.map((product) => (
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
                      onClick={() => handleLoadReviews(product.id)}
                      className="text-xs font-bold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 px-3 py-2 rounded-xl transition-colors cursor-pointer"
                    >
                      Reviews
                    </button>
                    <button
                      onClick={() =>
                        setDeleteConfirm({ type: "product", id: product.id, title: product.title })
                      }
                      className="text-xs font-bold text-red-500 bg-red-50 hover:bg-red-100 px-3 py-2 rounded-xl transition-colors cursor-pointer"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>

          </div>
        )}

        {/* Users Tab */}
        {activeTab === "users" && (
          <div className="bg-white border border-slate-100 rounded-2xl overflow-hidden shadow-sm">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  <th className="text-left text-xs font-bold uppercase tracking-wider text-slate-400 px-6 py-4">
                    Name
                  </th>
                  <th className="text-left text-xs font-bold uppercase tracking-wider text-slate-400 px-6 py-4">
                    Email
                  </th>
                  <th className="text-left text-xs font-bold uppercase tracking-wider text-slate-400 px-6 py-4">
                    Role
                  </th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id} className="border-b border-slate-100/60 last:border-0 hover:bg-slate-50/40 transition-colors">
                    <td className="px-6 py-4 text-sm font-semibold text-slate-800">{u.name}</td>
                    <td className="px-6 py-4 text-sm text-slate-500">{u.email}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-full border ${
                          u.is_admin
                            ? "bg-indigo-50 text-indigo-600 border-indigo-100/50"
                            : "bg-slate-50 text-slate-400 border-slate-200/30"
                        }`}
                      >
                        {u.is_admin ? "Admin" : "User"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modals rendered OUTSIDE the animate-fade-in wrapper to avoid transform coordinate traps */}
      {/* Review Management Modal */}
      {selectedProduct && (
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-fade-in"
          onClick={() => {
            setSelectedProduct(null);
            setProductReviews([]);
          }}
        >
          <div 
            className="relative w-full max-w-2xl bg-white border border-slate-100 rounded-3xl shadow-xl flex flex-col max-h-[80vh] overflow-hidden animate-fade-in"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="px-6 py-4.5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div>
                <h2 className="text-base font-extrabold text-slate-900">
                  Reviews Console
                </h2>
                <p className="text-xs text-slate-400 font-semibold mt-0.5">
                  {products.find((p) => p.id === selectedProduct)?.title || `Product #${selectedProduct}`}
                </p>
              </div>
              <button
                onClick={() => {
                  setSelectedProduct(null);
                  setProductReviews([]);
                }}
                className="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer font-bold text-sm"
                aria-label="Close modal"
              >
                ✕
              </button>
            </div>

            {/* Content */}
            <div className="p-6 overflow-y-auto space-y-4 flex-1">
              {productReviews.length === 0 ? (
                <div className="text-center py-10">
                  <span className="text-3xl mb-2.5 block select-none">💬</span>
                  <p className="text-slate-400 font-semibold text-sm">No reviews present on this product.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {productReviews.map((r) => (
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
                        onClick={() => setDeleteConfirm({ type: "review", id: r.id })}
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
                onClick={() => {
                  setSelectedProduct(null);
                  setProductReviews([]);
                }}
                className="text-xs font-bold text-slate-500 hover:text-slate-800 bg-slate-100 hover:bg-slate-200 px-4 py-2 rounded-xl transition-all cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Screen Overlay Confirm Modal */}
      <ConfirmModal
        isOpen={deleteConfirm !== null}
        onClose={() => setDeleteConfirm(null)}
        onConfirm={async () => {
          if (!deleteConfirm) return;
          const { type, id } = deleteConfirm;
          if (type === "product") {
            await handleDeleteProduct(id);
          } else {
            await handleDeleteReview(id);
          }
        }}
        title={deleteConfirm ? `Delete ${deleteConfirm.type === "product" ? "Product" : "Review"}` : ""}
        message={
          deleteConfirm
            ? deleteConfirm.type === "product"
              ? `Are you sure you want to delete "${deleteConfirm.title}"? This will permanently remove all associated reviews too.`
              : "Are you sure you want to delete this review? This action cannot be undone."
            : ""
        }
      />
    </div>
  );
}


