"use client";

import React, { useEffect, useRef } from "react";
import { ModalConfig } from "@/types/music";

interface ConfirmModalProps {
  config: ModalConfig | null;
  onClose: () => void;
}

export function ConfirmModal({ config, onClose }: ConfirmModalProps) {
  const cancelBtnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (config) {
      // Foco preventivo no botão de cancelar
      const timer = setTimeout(() => {
        cancelBtnRef.current?.focus();
      }, 50);

      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === "Escape") {
          onClose();
        }
      };

      window.addEventListener("keydown", handleKeyDown);
      return () => {
        clearTimeout(timer);
        window.removeEventListener("keydown", handleKeyDown);
      };
    }
  }, [config, onClose]);

  if (!config) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200"
    >
      <div className="w-full max-w-[440px] bg-dark-850 border border-dark-600 rounded-[14px] p-6 shadow-[0_20px_45px_rgba(0,0,0,0.7)] flex flex-col gap-3.5 transition-all">
        {/* Header com ícone de alerta */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-red-500/15 border border-red-500/25 text-red-400 flex items-center justify-center flex-shrink-0">
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M3 6h18"></path>
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"></path>
              <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
              <line x1="10" y1="11" x2="10" y2="17"></line>
              <line x1="14" y1="11" x2="14" y2="17"></line>
            </svg>
          </div>
          <h3 className="m-0 text-lg font-bold text-white leading-tight">
            {config.title || "Excluir Acorde do Slot?"}
          </h3>
        </div>

        {/* Texto descritivo */}
        <p className="m-0 text-sm text-dark-300 leading-relaxed">
          {config.message || "Tem certeza de que deseja remover este item da sua sequência?"}
        </p>

        {/* Bloco de destaque */}
        {(config.highlightTitle || config.highlightDetail) && (
          <div className="bg-dark-900 border border-dark-600 border-l-[3px] border-l-brand-600 rounded-lg px-4 py-3 flex items-center justify-between gap-2 flex-wrap">
            <span className="text-base font-bold text-white">
              {config.highlightTitle}
            </span>
            {config.highlightDetail && (
              <span className="text-xs font-semibold text-brand-300 bg-brand-600/15 px-2 py-0.5 rounded-md">
                {config.highlightDetail}
              </span>
            )}
          </div>
        )}

        {/* Ações */}
        <div className="flex flex-col-reverse sm:flex-row gap-2.5 mt-2">
          <button
            type="button"
            ref={cancelBtnRef}
            onClick={onClose}
            className="flex-1 min-h-[44px] px-3.5 py-2.5 rounded-lg border border-[#3d3d45] bg-[#2a2a30] hover:bg-[#36363d] hover:border-[#4d4d57] text-dark-100 hover:text-white text-sm font-semibold transition-all duration-150 text-center cursor-pointer"
          >
            {config.cancelText || "Cancelar"}
          </button>

          {config.onSecondaryConfirm && config.secondaryText && (
            <button
              type="button"
              onClick={config.onSecondaryConfirm}
              className="flex-1 min-h-[44px] px-3.5 py-2.5 rounded-lg border border-red-700 bg-red-900/60 hover:bg-red-800 text-red-100 hover:text-white text-sm font-bold flex items-center justify-center gap-1.5 transition-all duration-150 text-center cursor-pointer"
            >
              {config.secondaryText}
            </button>
          )}

          <button
            type="button"
            onClick={config.onConfirm}
            className="flex-1 min-h-[44px] px-3.5 py-2.5 rounded-lg border border-red-500 bg-red-600 hover:bg-red-700 text-white text-sm font-bold shadow-[0_4px_14px_rgba(220,38,38,0.4)] flex items-center justify-center gap-1.5 transition-all duration-150 text-center cursor-pointer"
          >
            {config.confirmText || "🗑️ Deletar"}
          </button>
        </div>
      </div>
    </div>
  );
}
