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

// Auth
export async function login(data: LoginData): Promise<TokenResponse> {
  const res = await api.post<TokenResponse>("/auth/login", data);
  return res.data;
}

export async function register(data: RegisterData): Promise<TokenResponse> {
  const res = await api.post<TokenResponse>("/auth/register", data);
  return res.data;
}

export async function getMe(): Promise<User> {
  const res = await api.get<User>("/auth/me");
  return res.data;
}

// Products
export async function getProducts(): Promise<Product[]> {
  const res = await api.get<Product[]>("/products");
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
