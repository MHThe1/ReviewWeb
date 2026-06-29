import axios from "axios";
import {
  Product,
  ProductDetail,
  Review,
  ReviewCreate,
  ReviewUpdate,
  LoginData,
  RegisterData,
  TokenResponse,
  User,
} from "@/types";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

const api = axios.create({
  baseURL: API_URL,
});

// Attach JWT token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Extract readable error messages from backend responses
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const detail = error.response?.data?.detail;

    let message: string;
    if (typeof detail === "string") {
      message = detail;
    } else if (Array.isArray(detail)) {
      // Pydantic validation errors: pick first one
      message = detail[0]?.msg || "Validation error";
    } else {
      message = "Something went wrong";
    }

    return Promise.reject(new Error(message));
  }
);

// Auth
export async function login(data: LoginData): Promise<TokenResponse> {
  const res = await api.post<TokenResponse>("/auth/login", data);
  return res.data;
}

export async function register(data: RegisterData): Promise<TokenResponse> {
  const res = await api.post<TokenResponse>("/auth/register", data);
  return res.data;
}

export async function getMe(token?: string): Promise<User> {
  const headers = token ? { Authorization: `Bearer ${token}` } : undefined;
  const res = await api.get<User>("/auth/me", { headers });
  return res.data;
}

// Products
export interface ProductFilters {
  search?: string;
  min_rating?: number;
}

export async function getProducts(filters?: ProductFilters): Promise<Product[]> {
  const params: Record<string, string> = {};
  if (filters?.search) params.search = filters.search;
  if (filters?.min_rating) params.min_rating = String(filters.min_rating);

  const res = await api.get<Product[]>("/products", { params });
  return res.data;
}

export async function getProduct(id: number): Promise<ProductDetail> {
  const res = await api.get<ProductDetail>(`/products/${id}`);
  return res.data;
}

// Reviews
export async function createReview(data: ReviewCreate): Promise<Review> {
  const res = await api.post<Review>("/reviews", data);
  return res.data;
}

export async function updateReview(
  id: number,
  data: ReviewUpdate
): Promise<Review> {
  const res = await api.put<Review>(`/reviews/${id}`, data);
  return res.data;
}

export async function deleteReview(id: number): Promise<void> {
  await api.delete(`/reviews/${id}`);
}

// Admin
export async function adminCreateProduct(data: {
  title: string;
  description?: string;
  image_url?: string;
}): Promise<Product> {
  const res = await api.post<Product>("/admin/products", data);
  return res.data;
}

export async function adminDeleteProduct(id: number): Promise<void> {
  await api.delete(`/admin/products/${id}`);
}

export async function adminDeleteReview(id: number): Promise<void> {
  await api.delete(`/admin/reviews/${id}`);
}

export async function adminGetUsers(): Promise<
  { id: number; name: string; email: string; is_admin: boolean; created_at: string }[]
> {
  const res = await api.get("/admin/users");
  return res.data;
}

export async function adminUpdateProduct(
  id: number,
  data: {
    title?: string;
    description?: string;
    image_url?: string;
  }
): Promise<Product> {
  const res = await api.put<Product>(`/admin/products/${id}`, data);
  return res.data;
}

export async function adminUpdateUser(
  id: number,
  data: {
    name?: string;
    email?: string;
    is_admin?: boolean;
  }
): Promise<{ id: number; name: string; email: string; is_admin: boolean; created_at: string }> {
  const res = await api.put(`/admin/users/${id}`, data);
  return res.data;
}

export async function adminDeleteUser(id: number): Promise<void> {
  await api.delete(`/admin/users/${id}`);
}
