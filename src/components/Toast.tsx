"use client";

import React from "react";

interface ToastProps {
  message: string | null;
}

export function Toast({ message }: ToastProps) {
  if (!message) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed bottom-4 sm:bottom-8 right-4 sm:right-8 left-4 sm:left-auto z-50 flex items-center justify-center sm:justify-start gap-2.5 bg-dark-800 border border-brand-600 text-white px-5 py-3.5 rounded-xl shadow-[0_10px_30px_rgba(0,0,0,0.6)] text-sm font-semibold pointer-events-none transition-all duration-300 animate-in fade-in slide-in-from-bottom-4"
    >
      <span>{message}</span>
    </div>
  );
}
