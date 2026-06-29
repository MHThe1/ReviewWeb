export interface User {
  id: number;
  name: string;
  email: string;
  is_admin: boolean;
  created_at: string;
}

export interface Product {
  id: number;
  title: string;
  description: string | null;
  image_url: string | null;
  average_rating: number | null;
  review_count: number;
  created_at: string;
}

export interface ReviewInProduct {
  id: number;
  user_name: string;
  rating: number;
  comment: string;
  created_at: string;
}

export interface ProductDetail extends Product {
  reviews: ReviewInProduct[];
}

export interface Review {
  id: number;
  user_name: string;
  rating: number;
  comment: string;
  created_at: string;
}

export interface ReviewCreate {
  product_id: number;
  rating: number;
  comment: string;
}

export interface ReviewUpdate {
  rating?: number;
  comment?: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
}

export interface TokenResponse {
  access_token: string;
  token_type: string;
}
