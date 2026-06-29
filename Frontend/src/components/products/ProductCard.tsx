"use client";

import Link from "next/link";
import { Product } from "@/types";
import StarRating from "@/components/ui/StarRating";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <Link
      href={`/products/${product.id}`}
      className="group bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm hover:shadow-lg hover:border-indigo-500/20 hover:-translate-y-1 transition-all duration-300 flex flex-col h-full text-left"
    >
      <div className="aspect-square bg-slate-50 flex items-center justify-center relative overflow-hidden shrink-0 border-b border-slate-100/50">
        <div className="absolute inset-0 bg-slate-900/0 group-hover:bg-slate-900/2 transition-colors duration-300 z-10" />
        {product.image_url ? (
          <img
            src={product.image_url}
            alt={product.title}
            className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <span className="text-slate-300 text-4xl group-hover:scale-110 transition-transform duration-500">📦</span>
        )}
      </div>
      <div className="p-5 flex flex-col flex-grow">
        <h2 className="text-base font-bold text-slate-900 mb-1.5 group-hover:text-indigo-600 transition-colors line-clamp-1">
          {product.title}
        </h2>
        {product.description && (
          <p className="text-slate-500 text-xs line-clamp-2 mb-4 leading-relaxed flex-grow">
            {product.description}
          </p>
        )}
        <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-50">
          <div className="flex items-center gap-1.5">
            <StarRating
              rating={Math.round(product.average_rating || 0)}
              size="sm"
            />
            <span className="text-xs font-bold text-slate-700">
              {product.average_rating?.toFixed(1) ?? "N/A"}
            </span>
          </div>
          <span className="text-xs font-semibold text-slate-400 hover:text-slate-500 transition-colors">
            {product.review_count}{" "}
            {product.review_count === 1 ? "Review" : "Reviews"}
          </span>
        </div>
      </div>
    </Link>
  );
}
