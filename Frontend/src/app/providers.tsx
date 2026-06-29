"use client";

import { AuthProvider } from "@/context/AuthContext";
import { ReactNode } from "react";
import { Toaster } from "react-hot-toast";

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      {children}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: "rgba(255, 255, 255, 0.9)",
            color: "#1e293b",
            backdropFilter: "blur(8px)",
            border: "1px solid rgba(226, 232, 240, 0.8)",
            borderRadius: "16px",
            boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.05), 0 4px 6px -4px rgba(0, 0, 0, 0.05)",
            fontSize: "13px",
            fontWeight: "600",
            padding: "12px 16px",
            fontFamily: "inherit",
          },
          success: {
            iconTheme: {
              primary: "#4f46e5",
              secondary: "#ffffff",
            },
          },
          error: {
            iconTheme: {
              primary: "#ef4444",
              secondary: "#ffffff",
            },
          },
        }}
      />
    </AuthProvider>
  );
}
