"use client";

import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

export default function Header() {
  const { user, loading, logout } = useAuth();

  return (
    <header className="bg-white border-b border-stone-200 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold text-stone-900 hover:text-indigo-600 transition-colors">
          ⭐ ReviewPlatform
        </Link>

        <nav className="flex items-center gap-4">
          {loading ? (
            <div className="h-8 w-20 bg-stone-200 rounded animate-pulse" />
          ) : user ? (
            <>
              {user.is_admin && (
                <Link
                  href="/admin"
                  className="text-sm text-indigo-600 hover:text-indigo-800 font-medium transition-colors"
                >
                  Admin
                </Link>
              )}
              <span className="text-sm text-stone-500">
                Hello, <span className="font-medium text-stone-800">{user.name}</span>
              </span>
              <button
                onClick={logout}
                className="text-sm text-stone-400 hover:text-red-500 transition-colors cursor-pointer"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="text-sm text-stone-600 hover:text-stone-900 transition-colors"
              >
                Login
              </Link>
              <Link
                href="/register"
                className="text-sm bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors font-medium"
              >
                Register
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
