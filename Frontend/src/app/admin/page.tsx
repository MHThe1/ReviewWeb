"use client";

import { useEffect, useState, useCallback } from "react";
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
  adminUpdateProduct,
  adminUpdateUser,
  adminDeleteUser,
} from "@/services/api";
import ConfirmModal from "@/components/ui/ConfirmModal";
import EditProductModal from "@/components/admin/EditProductModal";
import EditUserModal from "@/components/admin/EditUserModal";
import ReviewsConsoleModal from "@/components/admin/ReviewsConsoleModal";
import AdminProductsTab from "@/components/admin/AdminProductsTab";
import AdminUsersTab from "@/components/admin/AdminUsersTab";

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



  // Review deletion
  const [selectedProduct, setSelectedProduct] = useState<number | null>(null);
  const [productReviews, setProductReviews] = useState<
    { id: number; user_name: string; rating: number; comment: string }[]
  >([]);

  // Custom Confirmation Modal State
  const [deleteConfirm, setDeleteConfirm] = useState<{
    type: "product" | "review" | "user";
    id: number;
    title?: string;
  } | null>(null);

  // Edit Product Modal State
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Edit User Modal State
  const [editingUser, setEditingUser] = useState<AdminUser | null>(null);

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

  async function handleAddProduct(title: string, description: string, imageUrl: string) {
    await adminCreateProduct({
      title,
      description: description || undefined,
      image_url: imageUrl || undefined,
    });
    fetchProducts();
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

  async function handleDeleteUser(userId: number) {
    try {
      await adminDeleteUser(userId);
      fetchUsers();
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Failed to delete user");
    }
  }

  async function handleUpdateProduct(title: string, description: string, imageUrl: string) {
    if (!editingProduct) return;
    await adminUpdateProduct(editingProduct.id, {
      title,
      description: description || undefined,
      image_url: imageUrl || undefined,
    });
    fetchProducts();
  }

  async function handleUpdateUser(name: string, email: string, isAdmin: boolean) {
    if (!editingUser) return;
    await adminUpdateUser(editingUser.id, {
      name,
      email,
      is_admin: isAdmin,
    });
    fetchUsers();
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
            className={`px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-xl transition-all cursor-pointer ${activeTab === "products"
                ? "bg-indigo-600 text-white shadow-sm shadow-indigo-100"
                : "text-slate-400 hover:text-slate-600 hover:bg-slate-100/50"
              }`}
          >
            Products ({products.length})
          </button>
          <button
            onClick={() => setActiveTab("users")}
            className={`px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-xl transition-all cursor-pointer ${activeTab === "users"
                ? "bg-indigo-600 text-white shadow-sm shadow-indigo-100"
                : "text-slate-400 hover:text-slate-600 hover:bg-slate-100/50"
              }`}
          >
            Users ({users.length})
          </button>
        </div>

        {/* Products Tab */}
        {activeTab === "products" && (
          <AdminProductsTab
            products={products}
            onAddProduct={handleAddProduct}
            onLoadReviews={handleLoadReviews}
            onEditProduct={(p) => setEditingProduct(p)}
            onDeleteProduct={(p) => setDeleteConfirm({ type: "product", id: p.id, title: p.title })}
          />
        )}

        {/* Users Tab */}
        {activeTab === "users" && (
          <AdminUsersTab
            users={users}
            currentAdminEmail={user?.email}
            onEditUser={(u) => setEditingUser(u)}
            onDeleteUser={(u) => setDeleteConfirm({ type: "user", id: u.id, title: u.name })}
          />
        )}
      </div>

      {/* Modals rendered OUTSIDE the animate-fade-in wrapper to avoid transform coordinate traps */}
      {/* Review Management Modal */}
      <ReviewsConsoleModal
        isOpen={selectedProduct !== null}
        onClose={() => {
          setSelectedProduct(null);
          setProductReviews([]);
        }}
        productTitle={products.find((p) => p.id === selectedProduct)?.title || `Product #${selectedProduct}`}
        reviews={productReviews}
        onDeleteReview={(reviewId) => setDeleteConfirm({ type: "review", id: reviewId })}
      />

      {/* Screen Overlay Confirm Modal */}
      <ConfirmModal
        isOpen={deleteConfirm !== null}
        onClose={() => setDeleteConfirm(null)}
        onConfirm={async () => {
          if (!deleteConfirm) return;
          const { type, id } = deleteConfirm;
          if (type === "product") {
            await handleDeleteProduct(id);
          } else if (type === "review") {
            await handleDeleteReview(id);
          } else if (type === "user") {
            await handleDeleteUser(id);
          }
        }}
        title={
          deleteConfirm
            ? `Delete ${deleteConfirm.type === "product"
              ? "Product"
              : deleteConfirm.type === "review"
                ? "Review"
                : "User Account"
            }`
            : ""
        }
        message={
          deleteConfirm
            ? deleteConfirm.type === "product"
              ? `Are you sure you want to delete "${deleteConfirm.title}"? This will permanently remove all associated reviews too.`
              : deleteConfirm.type === "review"
                ? "Are you sure you want to delete this review? This action cannot be undone."
                : `Are you sure you want to delete the user account for "${deleteConfirm.title}"? This will permanently remove their user data including their reviews.`
            : ""
        }
      />

      {/* Edit Product Modal */}
      {editingProduct && (
        <EditProductModal
          isOpen={editingProduct !== null}
          onClose={() => setEditingProduct(null)}
          onSave={handleUpdateProduct}
          productId={editingProduct.id}
          initialTitle={editingProduct.title}
          initialDescription={editingProduct.description || ""}
          initialImageUrl={editingProduct.image_url || ""}
        />
      )}

      {/* Edit User Modal */}
      {editingUser && (
        <EditUserModal
          isOpen={editingUser !== null}
          onClose={() => setEditingUser(null)}
          onSave={handleUpdateUser}
          userId={editingUser.id}
          initialName={editingUser.name}
          initialEmail={editingUser.email}
          initialIsAdmin={editingUser.is_admin}
        />
      )}
    </div>
  );
}


