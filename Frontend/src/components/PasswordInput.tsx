"use client";

import { useState, InputHTMLAttributes } from "react";

interface PasswordInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export default function PasswordInput({
  label = "Password",
  id = "password",
  ...props
}: PasswordInputProps) {
  const [visible, setVisible] = useState(false);

  return (
    <div>
      <label 
        htmlFor={id} 
        className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5"
      >
        {label}
      </label>
      <div className="relative">
        <input
          id={id}
          type={visible ? "text" : "password"}
          className="w-full bg-slate-50/50 border border-slate-200/80 rounded-xl px-4 py-2.5 pr-11 text-slate-900 placeholder:text-slate-400/80 focus:bg-white focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all duration-200 shadow-sm"
          {...props}
        />
        <button
          type="button"
          onClick={() => setVisible(!visible)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-indigo-600 transition-colors cursor-pointer p-1.5 rounded-lg hover:bg-slate-100/50 focus:outline-none"
          tabIndex={-1}
          aria-label={visible ? "Hide password" : "Show password"}
        >
          {visible ? (
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
              <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
              <line x1="1" y1="1" x2="23" y2="23" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
              <circle cx="12" cy="12" r="3" />
            </svg>
          )}
        </button>
      </div>
    </div>
  );
}

