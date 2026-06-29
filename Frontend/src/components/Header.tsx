"use client";

import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

export default function Header() {
  const { user, loading, logout } = useAuth();

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <header className="bg-white/85 backdrop-blur-md border-b border-slate-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link 
          href="/" 
          className="text-xl font-extrabold tracking-tight flex items-center gap-1.5 select-none"
        >
          <span className="text-xl hover:rotate-12 transition-transform duration-300">⭐</span>
          <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-violet-600 bg-clip-text text-transparent">
            ReviewPlatform
          </span>
        </Link>

        <nav className="flex items-center gap-4">
          {loading ? (
            <div className="h-8 w-20 bg-slate-100 rounded-full animate-pulse" />
          ) : user ? (
            <div className="flex items-center gap-4">
              {user.is_admin && (
                <Link
                  href="/admin"
                  className="text-xs bg-indigo-50 text-indigo-600 px-3 py-1.5 rounded-full font-semibold hover:bg-indigo-100 transition-all"
                >
                  Admin Portal
                </Link>
              )}
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 via-purple-500 to-violet-500 flex items-center justify-center text-white text-xs font-semibold shadow-sm">
                  {getInitials(user.name)}
                </div>
                <span className="text-sm text-slate-500 hidden sm:inline">
                  Hello, <span className="font-semibold text-slate-800">{user.name}</span>
                </span>
              </div>
              <button
                onClick={logout}
                className="text-sm text-slate-400 hover:text-red-500 transition-colors cursor-pointer font-medium"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <Link
                href="/login"
                className="text-sm text-slate-600 hover:text-slate-900 transition-colors font-medium"
              >
                Login
              </Link>
              <Link
                href="/register"
                className="text-sm bg-gradient-to-r from-indigo-600 to-violet-600 text-white px-4.5 py-2 rounded-xl hover:shadow-lg hover:shadow-indigo-100 hover:-translate-y-0.5 active:translate-y-0 transition-all font-semibold"
              >
                Register
              </Link>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
}

