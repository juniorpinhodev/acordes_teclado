"use client";

import React from "react";
import { Piano } from "./Piano";

interface ChordInversionCardProps {
  title: string;
  notesText: string;
  keys: number[];
  useFlat: boolean;
  onSave: () => void;
  onPlayChord?: () => void;
  liveKeys?: number[];
  onKeyClick?: (pianoIndex: number) => void;
}

export function ChordInversionCard({
  title,
  notesText,
  keys,
  useFlat,
  onSave,
  onPlayChord,
  liveKeys = [],
  onKeyClick,
}: ChordInversionCardProps) {
  return (
    <div className="w-full bg-dark-800 border border-dark-700 rounded-[14px] p-4 sm:p-5 md:p-6 shadow-[0_10px_30px_rgba(0,0,0,0.4)] flex flex-col transition-all duration-300">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div className="flex flex-wrap items-center gap-2.5">
          <h2 className="text-base sm:text-lg md:text-xl font-bold text-white m-0">
            {title}
          </h2>
          <span className="bg-dark-900 border border-dark-600 px-3 py-1 rounded-full text-xs sm:text-sm font-semibold text-brand-400 tracking-wide">
            {notesText}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {onPlayChord && (
            <button
              type="button"
              onClick={onPlayChord}
              title="Ouvir este acorde com o timbre selecionado"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs sm:text-sm font-semibold bg-brand-600/15 hover:bg-brand-600/30 border border-brand-500/40 text-brand-300 hover:text-white rounded-md shadow-sm transition-all duration-200 cursor-pointer"
            >
              <span>🔊</span>
              <span>Ouvir</span>
            </button>
          )}

          <button
            type="button"
            onClick={onSave}
            title="Salvar esta inversão no slot"
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs sm:text-sm font-semibold bg-[#2a2a30] hover:bg-brand-600 border border-[#3d3d45] hover:border-brand-600 text-dark-100 hover:text-white rounded-md shadow-sm hover:shadow-[0_2px_10px_rgba(130,87,229,0.35)] transition-all duration-200 cursor-pointer"
          >
            <span>💾</span>
            <span>Salvar no Slot</span>
          </button>
        </div>
      </div>

      <div className="piano-scroll-container">
        <Piano
          activeKeys={keys}
          liveKeys={liveKeys}
          useFlat={useFlat}
          size="normal"
          onKeyClick={onKeyClick}
        />
      </div>
    </div>
  );
}
