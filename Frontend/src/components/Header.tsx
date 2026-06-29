"use client";

import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

export default function Header() {
  const { user, loading, logout } = useAuth();

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold text-gray-900 hover:text-blue-600 transition-colors">
          ⭐ ReviewPlatform
        </Link>

        <nav className="flex items-center gap-4">
          {loading ? (
            <div className="h-8 w-20 bg-gray-200 rounded animate-pulse" />
          ) : user ? (
            <>
              {user.is_admin && (
                <Link
                  href="/admin"
                  className="text-sm text-purple-600 hover:text-purple-800 font-medium transition-colors"
                >
                  Admin
                </Link>
              )}
              <span className="text-sm text-gray-600">
                Hello, <span className="font-medium text-gray-900">{user.name}</span>
              </span>
              <button
                onClick={logout}
                className="text-sm text-gray-600 hover:text-red-600 transition-colors cursor-pointer"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
              >
                Login
              </Link>
              <Link
                href="/register"
                className="text-sm bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
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
