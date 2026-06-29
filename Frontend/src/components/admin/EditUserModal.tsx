"use client";

import { useState, useEffect, FormEvent } from "react";

interface EditUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (name: string, email: string, isAdmin: boolean) => Promise<void>;
  userId: number;
  initialName: string;
  initialEmail: string;
  initialIsAdmin: boolean;
}

export default function EditUserModal({
  isOpen,
  onClose,
  onSave,
  userId,
  initialName,
  initialEmail,
  initialIsAdmin,
}: EditUserModalProps) {
  const [name, setName] = useState(initialName);
  const [email, setEmail] = useState(initialEmail);
  const [isAdmin, setIsAdmin] = useState(initialIsAdmin);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  // Sync state if initial props change
  useEffect(() => {
    setName(initialName);
    setEmail(initialEmail);
    setIsAdmin(initialIsAdmin);
    setError(null);
  }, [initialName, initialEmail, initialIsAdmin, isOpen]);

  // Escape key dismiss
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setSaving(true);
    try {
      await onSave(name, email, isAdmin);
      onClose();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to save user updates");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div 
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-fade-in"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-md bg-white border border-slate-100 rounded-3xl shadow-xl flex flex-col max-h-[90vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4.5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div>
            <h2 className="text-base font-extrabold text-slate-900">Edit User Details</h2>
            <p className="text-xs text-slate-400 font-semibold mt-0.5">User ID: #{userId}</p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer font-bold text-sm"
          >
            ✕
          </button>
        </div>

        {/* Form Content */}
        <form onSubmit={handleSubmit} className="flex-1 flex flex-col overflow-hidden">
          <div className="p-6 overflow-y-auto space-y-4 flex-1">
            {error && (
              <div className="bg-red-50 border border-red-100 text-red-600 text-sm rounded-xl p-3 font-semibold text-left">
                {error}
              </div>
            )}
            <div className="text-left">
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">Full Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-slate-50/50 border border-slate-200/80 rounded-xl px-4 py-2.5 text-slate-900 focus:bg-white focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all duration-200 text-sm shadow-sm"
              />
            </div>
            <div className="text-left">
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">Email Address</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-50/50 border border-slate-200/80 rounded-xl px-4 py-2.5 text-slate-900 focus:bg-white focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all duration-200 text-sm shadow-sm"
              />
            </div>
            <div className="flex items-center gap-3 bg-slate-50/50 border border-slate-100 p-4 rounded-xl text-left">
              <input
                type="checkbox"
                id="editUserIsAdminModal"
                checked={isAdmin}
                onChange={(e) => setIsAdmin(e.target.checked)}
                className="w-4 h-4 text-indigo-600 border-slate-300 rounded focus:ring-indigo-500"
              />
              <label htmlFor="editUserIsAdminModal" className="text-sm font-semibold text-slate-700 cursor-pointer select-none">
                Grant Administrator Role (is_admin)
              </label>
            </div>
          </div>

          {/* Footer */}
          <div className="px-6 py-4 border-t border-slate-100 flex justify-end gap-2 bg-slate-50/50">
            <button
              type="button"
              onClick={onClose}
              className="text-xs font-bold text-slate-500 hover:text-slate-800 bg-slate-100 hover:bg-slate-200 px-4 py-2 rounded-xl transition-all cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 px-4 py-2 rounded-xl transition-all cursor-pointer"
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
