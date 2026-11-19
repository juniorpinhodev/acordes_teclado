"use client";

import React from "react";
import { ROOT_NOTE_OPTIONS, CHORD_TYPE_CATEGORIES } from "@/constants/chords";
import { InversionDescription, SavedChordSlot } from "@/types/music";

interface ControlsCardProps {
  rootNote: string;
  onRootChange: (val: string) => void;
  chordType: string;
  onTypeChange: (val: string) => void;
  inversionIndex: number;
  onInversionChange: (val: number) => void;
  inversionOptions: InversionDescription[];
  targetSlot: number | "auto";
  onTargetSlotChange: (val: number | "auto") => void;
  slots: (SavedChordSlot | null)[];
  onSave: () => void;
}

export function ControlsCard({
  rootNote,
  onRootChange,
  chordType,
  onTypeChange,
  inversionIndex,
  onInversionChange,
  inversionOptions,
  targetSlot,
  onTargetSlotChange,
  slots,
  onSave,
}: ControlsCardProps) {
  const nextFreeIndex = slots.findIndex((s) => s === null);

  return (
    <div className="w-full max-w-[840px] bg-dark-800 border border-dark-700 rounded-[14px] p-4 sm:p-5 md:p-6 mb-6 sm:mb-8 md:mb-10 shadow-[0_10px_25px_rgba(0,0,0,0.3)]">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
        {/* Nota Fundamental */}
        <div className="flex flex-col gap-1.5">
          <label htmlFor="root-select" className="text-xs font-semibold text-dark-300 uppercase tracking-wider">
            Nota Fundamental
          </label>
          <select
            id="root-select"
            value={rootNote}
            onChange={(e) => onRootChange(e.target.value)}
            className="w-full min-h-[46px] px-3.5 py-2.5 rounded-lg border border-dark-600 bg-dark-900 text-dark-100 text-sm font-medium outline-none focus:border-brand-600 focus:ring-2 focus:ring-brand-600/25 transition-all duration-200 cursor-pointer"
          >
            {ROOT_NOTE_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value} className="bg-dark-900 text-dark-100">
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        {/* Tipo de Acorde */}
        <div className="flex flex-col gap-1.5">
          <label htmlFor="type-select" className="text-xs font-semibold text-dark-300 uppercase tracking-wider">
            Tipo de Acorde
          </label>
          <select
            id="type-select"
            value={chordType}
            onChange={(e) => onTypeChange(e.target.value)}
            className="w-full min-h-[46px] px-3.5 py-2.5 rounded-lg border border-dark-600 bg-dark-900 text-dark-100 text-sm font-medium outline-none focus:border-brand-600 focus:ring-2 focus:ring-brand-600/25 transition-all duration-200 cursor-pointer"
          >
            {CHORD_TYPE_CATEGORIES.map((cat) => (
              <optgroup
                key={cat.category}
                label={cat.category}
                className="bg-dark-800 text-brand-400 font-bold"
              >
                {cat.options.map((opt) => (
                  <option
                    key={opt.value}
                    value={opt.value}
                    className="bg-dark-900 text-dark-100 font-normal"
                  >
                    {opt.label}
                  </option>
                ))}
              </optgroup>
            ))}
          </select>
        </div>

        {/* Montagem a Salvar */}
        <div className="flex flex-col gap-1.5">
          <label htmlFor="inversion-select" className="text-xs font-semibold text-dark-300 uppercase tracking-wider">
            Montagem a Salvar
          </label>
          <select
            id="inversion-select"
            value={inversionIndex}
            onChange={(e) => onInversionChange(parseInt(e.target.value, 10))}
            className="w-full min-h-[46px] px-3.5 py-2.5 rounded-lg border border-dark-600 bg-dark-900 text-dark-100 text-sm font-medium outline-none focus:border-brand-600 focus:ring-2 focus:ring-brand-600/25 transition-all duration-200 cursor-pointer"
          >
            {inversionOptions.map((inv, idx) => (
              <option key={idx} value={idx} className="bg-dark-900 text-dark-100">
                {inv.name} ({inv.desc})
              </option>
            ))}
          </select>
        </div>

        {/* Destino do Slot */}
        <div className="flex flex-col gap-1.5">
          <label htmlFor="target-slot-select" className="text-xs font-semibold text-dark-300 uppercase tracking-wider">
            Destino do Slot
          </label>
          <select
            id="target-slot-select"
            value={targetSlot}
            onChange={(e) =>
              onTargetSlotChange(e.target.value === "auto" ? "auto" : parseInt(e.target.value, 10))
            }
            className="w-full min-h-[46px] px-3.5 py-2.5 rounded-lg border border-dark-600 bg-dark-900 text-dark-100 text-sm font-medium outline-none focus:border-brand-600 focus:ring-2 focus:ring-brand-600/25 transition-all duration-200 cursor-pointer"
          >
            <option value="auto" className="bg-dark-900 text-dark-100">
              Automático ({nextFreeIndex !== -1 ? `Próximo: Slot ${nextFreeIndex + 1}` : "Novo Slot"})
            </option>
            {slots.map((slot, i) => {
              const info = slot ? `${slot.chordName} (${slot.inversionShort})` : "Vazio";
              return (
                <option key={i} value={i} className="bg-dark-900 text-dark-100">
                  Slot {i + 1} [{info}]
                </option>
              );
            })}
          </select>
        </div>

        {/* Botão Salvar Principal (em linha inteira se tela pequena ou ao final) */}
        <div className="sm:col-span-2 lg:col-span-4 mt-1">
          <button
            type="button"
            onClick={onSave}
            className="w-full min-h-[48px] px-4 py-3 rounded-lg font-bold text-base text-white bg-brand-600 hover:bg-brand-500 active:scale-[0.99] shadow-[0_4px_14px_rgba(130,87,229,0.4)] flex items-center justify-center gap-2 transition-all duration-200 cursor-pointer"
          >
            <span>💾</span>
            <span>Salvar Acorde</span>
          </button>
        </div>
      </div>
    </div>
  );
}
