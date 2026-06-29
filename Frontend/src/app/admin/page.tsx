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

  async function handleDeleteProduct(id: number, title: string) {
    if (!confirm(`Delete "${title}"? This removes all its reviews too.`)) return;
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
    if (!confirm("Delete this review?")) return;
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
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4" />
          <div className="h-64 bg-gray-200 rounded-xl" />
        </div>
      </div>
    );
  }

  if (!user?.is_admin) return null;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Admin Panel</h1>

      {/* Tabs */}
      <div className="flex gap-4 mb-6 border-b border-gray-200">
        <button
          onClick={() => setActiveTab("products")}
          className={`pb-3 px-1 text-sm font-medium border-b-2 transition-colors cursor-pointer ${
            activeTab === "products"
              ? "border-blue-600 text-blue-600"
              : "border-transparent text-gray-500 hover:text-gray-700"
          }`}
        >
          Products ({products.length})
        </button>
        <button
          onClick={() => setActiveTab("users")}
          className={`pb-3 px-1 text-sm font-medium border-b-2 transition-colors cursor-pointer ${
            activeTab === "users"
              ? "border-blue-600 text-blue-600"
              : "border-transparent text-gray-500 hover:text-gray-700"
          }`}
        >
          Users ({users.length})
        </button>
      </div>

      {/* Products Tab */}
      {activeTab === "products" && (
        <div className="space-y-8">
          {/* Add Product Form */}
          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Add Product
            </h2>
            <form onSubmit={handleAddProduct} className="space-y-4">
              {addError && (
                <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg p-3">
                  {addError}
                </div>
              )}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <input
                  type="text"
                  required
                  placeholder="Product title"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="text"
                  placeholder="Description (optional)"
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="url"
                  placeholder="Image URL (optional)"
                  value={newImageUrl}
                  onChange={(e) => setNewImageUrl(e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <button
                type="submit"
                disabled={adding}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 cursor-pointer"
              >
                {adding ? "Adding..." : "Add Product"}
              </button>
            </form>
          </div>

          {/* Products List */}
          <div className="space-y-3">
            {products.map((product) => (
              <div
                key={product.id}
                className="bg-white border border-gray-200 rounded-lg p-4 flex items-center justify-between gap-4"
              >
                <div className="flex items-center gap-4 min-w-0">
                  {product.image_url ? (
                    <img
                      src={product.image_url}
                      alt={product.title}
                      className="w-16 h-16 rounded object-cover shrink-0"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded bg-gray-100 flex items-center justify-center shrink-0">
                      📦
                    </div>
                  )}
                  <div className="min-w-0">
                    <h3 className="font-medium text-gray-900 truncate">
                      {product.title}
                    </h3>
                    <div className="flex items-center gap-2">
                      <StarRating
                        rating={Math.round(product.average_rating || 0)}
                        size="sm"
                      />
                      <span className="text-sm text-gray-500">
                        {product.review_count} reviews
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2 shrink-0">
                  <button
                    onClick={() => handleLoadReviews(product.id)}
                    className="text-sm text-blue-600 hover:underline cursor-pointer"
                  >
                    Reviews
                  </button>
                  <button
                    onClick={() =>
                      handleDeleteProduct(product.id, product.title)
                    }
                    className="text-sm text-red-600 hover:underline cursor-pointer"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Review Management Modal */}
          {selectedProduct && (
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">
                  Reviews for Product #{selectedProduct}
                </h2>
                <button
                  onClick={() => {
                    setSelectedProduct(null);
                    setProductReviews([]);
                  }}
                  className="text-gray-500 hover:text-gray-700 cursor-pointer"
                >
                  ✕ Close
                </button>
              </div>
              {productReviews.length === 0 ? (
                <p className="text-gray-500">No reviews.</p>
              ) : (
                <div className="space-y-3">
                  {productReviews.map((r) => (
                    <div
                      key={r.id}
                      className="bg-white border border-gray-200 rounded-lg p-3 flex items-start justify-between"
                    >
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium text-gray-900">
                            {r.user_name}
                          </span>
                          <StarRating rating={r.rating} size="sm" />
                        </div>
                        <p className="text-gray-700 text-sm">{r.comment}</p>
                      </div>
                      <button
                        onClick={() => handleDeleteReview(r.id)}
                        className="text-sm text-red-600 hover:underline cursor-pointer shrink-0 ml-4"
                      >
                        Delete
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Users Tab */}
      {activeTab === "users" && (
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left text-sm font-medium text-gray-700 px-4 py-3">
                  Name
                </th>
                <th className="text-left text-sm font-medium text-gray-700 px-4 py-3">
                  Email
                </th>
                <th className="text-left text-sm font-medium text-gray-700 px-4 py-3">
                  Role
                </th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id} className="border-b border-gray-100 last:border-0">
                  <td className="px-4 py-3 text-sm text-gray-900">{u.name}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{u.email}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                        u.is_admin
                          ? "bg-purple-100 text-purple-700"
                          : "bg-gray-100 text-gray-600"
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
  );
}
