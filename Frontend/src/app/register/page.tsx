"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import PasswordInput from "@/components/PasswordInput";
import { showToast } from "@/utils/toast";

export default function RegisterPage() {
  const { register } = useAuth();
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await register({ name, email, password });
      showToast.success("Welcome! Account created successfully.");
      router.push("/");
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Registration failed";
      setError(message);
      showToast.error(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex-1 flex items-center justify-center px-4 py-16 grid-bg relative overflow-hidden min-h-[calc(100vh-4rem)]">
      {/* Decorative radial gradients */}
      <div className="absolute top-1/4 left-1/3 w-80 h-80 bg-indigo-200/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/3 w-80 h-80 bg-purple-200/20 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md relative z-10 animate-fade-in">
        <div className="bg-white border border-slate-100 rounded-3xl p-8 shadow-md">
          <div className="text-center mb-8">
            <span className="text-4xl mb-2.5 block hover:rotate-12 transition-transform duration-300 select-none">✨</span>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">
              Create Account
            </h1>
            <p className="text-xs text-slate-400 font-semibold mt-1">
              Join to share your feedback and review products
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-red-50 border border-red-100 text-red-600 text-sm rounded-xl p-3.5 font-medium">
                {error}
              </div>
            )}

            <div>
              <label 
                htmlFor="name" 
                className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5"
              >
                Full Name
              </label>
              <input
                id="name"
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-slate-50/50 border border-slate-200/80 rounded-xl px-4 py-2.5 text-slate-900 placeholder:text-slate-400/80 focus:bg-white focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all duration-200 shadow-sm text-sm"
                placeholder="John Doe"
              />
            </div>

            <div>
              <label 
                htmlFor="email" 
                className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5"
              >
                Email Address
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-50/50 border border-slate-200/80 rounded-xl px-4 py-2.5 text-slate-900 placeholder:text-slate-400/80 focus:bg-white focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all duration-200 shadow-sm text-sm"
                placeholder="john@example.com"
              />
            </div>

            <PasswordInput
              label="Password"
              id="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="At least 6 characters"
            />

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full inline-flex items-center justify-center bg-gradient-to-r from-indigo-600 to-violet-600 text-white py-3 rounded-xl hover:shadow-lg hover:shadow-indigo-100 hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 disabled:pointer-events-none transition-all font-bold cursor-pointer text-sm"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Creating account...
                  </span>
                ) : (
                  "Register"
                )}
              </button>
            </div>

            <p className="text-xs text-center text-slate-500 pt-3 border-t border-slate-50">
              Already have an account?{" "}
              <Link href="/login" className="text-indigo-600 hover:text-indigo-800 font-bold transition-colors">
                Login
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}

