"use client";

import { useState, useEffect, FormEvent } from "react";

interface EditProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (title: string, description: string, imageUrl: string) => Promise<void>;
  productId: number;
  initialTitle: string;
  initialDescription: string;
  initialImageUrl: string;
}

export default function EditProductModal({
  isOpen,
  onClose,
  onSave,
  productId,
  initialTitle,
  initialDescription,
  initialImageUrl,
}: EditProductModalProps) {
  const [title, setTitle] = useState(initialTitle);
  const [description, setDescription] = useState(initialDescription);
  const [imageUrl, setImageUrl] = useState(initialImageUrl);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  // Sync state if initial props change
  useEffect(() => {
    setTitle(initialTitle);
    setDescription(initialDescription);
    setImageUrl(initialImageUrl);
    setError(null);
  }, [initialTitle, initialDescription, initialImageUrl, isOpen]);

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
      await onSave(title, description, imageUrl);
      onClose();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to save product details");
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
        className="relative w-full max-w-lg bg-white border border-slate-100 rounded-3xl shadow-xl flex flex-col max-h-[90vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4.5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div>
            <h2 className="text-base font-extrabold text-slate-900">Edit Product</h2>
            <p className="text-xs text-slate-400 font-semibold mt-0.5">Product ID: #{productId}</p>
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
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">Product Title</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-slate-50/50 border border-slate-200/80 rounded-xl px-4 py-2.5 text-slate-900 focus:bg-white focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all duration-200 text-sm shadow-sm"
              />
            </div>
            <div className="text-left">
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">Description</label>
              <textarea
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full bg-slate-50/50 border border-slate-200/80 rounded-xl px-4 py-2.5 text-slate-900 focus:bg-white focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all duration-200 text-sm resize-none shadow-sm"
              />
            </div>
            <div className="text-left">
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">Image URL</label>
              <input
                type="url"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                className="w-full bg-slate-50/50 border border-slate-200/80 rounded-xl px-4 py-2.5 text-slate-900 focus:bg-white focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all duration-200 text-sm shadow-sm"
              />
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
