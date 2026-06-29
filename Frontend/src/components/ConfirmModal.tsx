"use client";

import { useEffect } from "react";

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void | Promise<void>;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  type?: "danger" | "info";
}

export default function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "Yes, Delete",
  cancelText = "Cancel",
  type = "danger",
}: ConfirmModalProps) {
  // Support Escape key to close modal for accessibility
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-fade-in"
      onClick={onClose}
    >
      <div 
        className="w-full max-w-sm bg-white border border-slate-100 rounded-3xl p-6 shadow-xl relative z-10 text-center"
        onClick={(e) => e.stopPropagation()}
      >
        <span className="text-3xl mb-3 block select-none">
          {type === "danger" ? "🗑️" : "⚠️"}
        </span>
        <h3 className="text-base font-extrabold text-slate-900 mb-2">{title}</h3>
        <p className="text-xs text-slate-500 leading-relaxed mb-6">{message}</p>
        <div className="flex gap-2.5">
          <button
            onClick={async () => {
              await onConfirm();
              onClose();
            }}
            className={`flex-1 text-white px-4 py-2.5 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
              type === "danger" ? "bg-red-500 hover:bg-red-600" : "bg-indigo-600 hover:bg-indigo-700"
            }`}
          >
            {confirmText}
          </button>
          <button
            onClick={onClose}
            className="flex-1 bg-slate-100 text-slate-600 px-4 py-2.5 rounded-xl text-xs font-bold hover:bg-slate-200 transition-colors cursor-pointer"
          >
            {cancelText}
          </button>
        </div>
      </div>
    </div>
  );
}
