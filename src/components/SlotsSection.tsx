"use client";

import React, { useState, useRef } from "react";
import { SavedChordSlot } from "@/types/music";
import { Piano } from "./Piano";

interface SlotsSectionProps {
  slots: (SavedChordSlot | null)[];
  currentTargetIndex: number;
  onSelectTarget: (index: number) => void;
  onSwap: (fromIndex: number, toIndex: number) => void;
  onToggleLock: (index: number) => void;
  onRemove: (index: number) => void;
  onDeleteEmptySlot: (index: number) => void;
  onAddSlot: () => void;
  onClearAll: () => void;
  onLoadSlot: (index: number) => void;
}

export function SlotsSection({
  slots,
  currentTargetIndex,
  onSelectTarget,
  onSwap,
  onToggleLock,
  onRemove,
  onDeleteEmptySlot,
  onAddSlot,
  onClearAll,
  onLoadSlot,
}: SlotsSectionProps) {
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  // Refs para controle de toque mobile
  const touchDraggedRef = useRef<number | null>(null);

  // Desktop Drag & Drop Handlers
  const handleDragStart = (e: React.DragEvent, index: number) => {
    const slot = slots[index];
    if (slot?.locked) {
      e.preventDefault();
      return;
    }
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", index.toString());
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDragEnter = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIndex !== null && draggedIndex !== index) {
      setDragOverIndex(index);
    }
  };

  const handleDragLeave = (e: React.DragEvent, index: number) => {
    if (dragOverIndex === index) {
      setDragOverIndex(null);
    }
  };

  const handleDrop = (e: React.DragEvent, targetIndex: number) => {
    e.preventDefault();
    setDragOverIndex(null);
    if (draggedIndex !== null && draggedIndex !== targetIndex) {
      onSwap(draggedIndex, targetIndex);
    }
    setDraggedIndex(null);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  // Touch Drag & Drop para Mobile e Tablets
  const handleTouchStart = (e: React.TouchEvent, index: number) => {
    const target = e.target as HTMLElement;
    if (target.closest("button")) return;
    const slot = slots[index];
    if (slot?.locked) return;

    touchDraggedRef.current = index;
    setDraggedIndex(index);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (touchDraggedRef.current === null) return;
    const touch = e.touches[0];
    const element = document.elementFromPoint(touch.clientX, touch.clientY);
    const card = element?.closest("[data-slot-card-index]") as HTMLElement | null;

    if (card) {
      const idx = parseInt(card.dataset.slotCardIndex || "", 10);
      if (!isNaN(idx) && idx !== touchDraggedRef.current) {
        setDragOverIndex(idx);
        return;
      }
    }
    setDragOverIndex(null);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchDraggedRef.current === null) return;
    const touch = e.changedTouches[0];
    const element = document.elementFromPoint(touch.clientX, touch.clientY);
    const card = element?.closest("[data-slot-card-index]") as HTMLElement | null;

    if (card) {
      const targetIdx = parseInt(card.dataset.slotCardIndex || "", 10);
      if (!isNaN(targetIdx) && targetIdx !== touchDraggedRef.current) {
        onSwap(touchDraggedRef.current, targetIdx);
      }
    }

    touchDraggedRef.current = null;
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  const occupiedCount = slots.filter(Boolean).length;

  return (
    <section className="w-full max-w-[840px] mt-10 sm:mt-14 flex flex-col gap-5">
      {/* Header dos Slots */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-3 border-b border-dark-700">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-white flex items-center gap-2 m-0 mb-1">
            <span>🎵</span>
            <span>Acordes Salvos da Música</span>
          </h2>
          <p className="text-xs sm:text-sm text-dark-300 m-0">
            Arraste e solte para reordenar • {occupiedCount} de {slots.length} slots preenchidos
          </p>
        </div>

        <button
          type="button"
          onClick={onClearAll}
          title="Limpar todos os slots"
          className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs sm:text-sm font-semibold text-dark-100 hover:text-[#ff8566] bg-transparent hover:bg-red-500/10 border border-dark-600 hover:border-red-500 rounded-lg transition-all duration-200 cursor-pointer"
        >
          <span>🗑️</span>
          <span>Limpar Todos</span>
        </button>
      </div>

      {/* Grid Dinâmica de Slots com Botão de Adição ao lado do último */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {slots.map((slot, i) => {
          const isTarget = i === currentTargetIndex;
          const isDragging = draggedIndex === i;
          const isDragOver = dragOverIndex === i;

          if (!slot) {
            // Slot Vazio
            return (
              <div
                key={i}
                data-slot-card-index={i}
                onClick={() => onSelectTarget(i)}
                onDragOver={handleDragOver}
                onDragEnter={(e) => handleDragEnter(e, i)}
                onDragLeave={(e) => handleDragLeave(e, i)}
                onDrop={(e) => handleDrop(e, i)}
                className={`relative min-h-[130px] rounded-xl border-2 border-dashed p-6 flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-200 group ${
                  isDragOver
                    ? "border-brand-600 bg-brand-600/20 shadow-[0_0_0_3px_rgba(130,87,229,0.45)] -translate-y-0.5"
                    : isTarget
                    ? "border-brand-600 bg-brand-600/10 shadow-[0_0_0_2px_rgba(130,87,229,0.35)]"
                    : "border-dark-600 bg-dark-800/40 hover:border-brand-600 hover:bg-brand-600/5"
                }`}
              >
                {/* Botão para deletar slot vazio extra se houver mais de 3 */}
                {slots.length > 3 && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteEmptySlot(i);
                    }}
                    title="Remover este slot extra"
                    className="absolute top-2.5 right-2.5 w-6 h-6 rounded-md text-dark-400 hover:text-red-400 hover:bg-red-500/15 flex items-center justify-center text-xs font-bold transition-all duration-150 cursor-pointer"
                  >
                    ✕
                  </button>
                )}

                <span className="text-xs font-bold text-dark-400 uppercase tracking-wider mb-1">
                  Slot {i + 1}
                </span>
                <span className="text-xs sm:text-sm text-dark-300 font-medium">
                  {isTarget
                    ? "🎯 Próximo a salvar (Clique para manter)"
                    : "+ Slot Vazio (Arraste um acorde aqui)"}
                </span>
              </div>
            );
          }

          // Slot Ocupado
          const isLocked = !!slot.locked;

          return (
            <div
              key={i}
              data-slot-card-index={i}
              draggable={!isLocked}
              onDragStart={(e) => handleDragStart(e, i)}
              onDragEnd={handleDragEnd}
              onDragOver={handleDragOver}
              onDragEnter={(e) => handleDragEnter(e, i)}
              onDragLeave={(e) => handleDragLeave(e, i)}
              onDrop={(e) => handleDrop(e, i)}
              onTouchStart={(e) => handleTouchStart(e, i)}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
              className={`relative bg-dark-800 border rounded-xl p-4 sm:p-4.5 flex flex-col gap-3 transition-all duration-200 ${
                isLocked ? "border-brand-600/30" : "border-dark-700 hover:border-dark-600"
              } ${isDragging ? "opacity-40 border-2 border-dashed border-brand-600 scale-[0.98]" : ""} ${
                isDragOver
                  ? "border-brand-600 bg-brand-600/15 shadow-[0_0_0_3px_rgba(130,87,229,0.45)] -translate-y-0.5"
                  : ""
              } ${!isLocked ? "cursor-grab active:cursor-grabbing" : ""}`}
            >
              {/* Header do Card */}
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-1.5">
                  <span
                    className={`text-base select-none px-1 transition-colors ${
                      isLocked
                        ? "text-dark-500 opacity-25 cursor-not-allowed"
                        : "text-dark-400 hover:text-brand-400 cursor-grab"
                    }`}
                    title={isLocked ? "Slot fixado" : "Arraste para reposicionar"}
                  >
                    ⠿
                  </span>

                  <span
                    className={`text-[11px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider border ${
                      isTarget
                        ? "border-brand-600 text-brand-300 bg-brand-600/15"
                        : "border-dark-600 text-dark-300 bg-dark-900"
                    }`}
                  >
                    Slot {i + 1} {isTarget ? "• Alvo" : ""}
                  </span>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleLock(i);
                    }}
                    title={
                      isLocked
                        ? "Slot fixado. Clique para liberar"
                        : "Fixar slot contra movimentação"
                    }
                    className={`w-7 h-7 rounded-md border flex items-center justify-center transition-all cursor-pointer ${
                      isLocked
                        ? "text-brand-400 bg-brand-600/15 border-brand-600/35 hover:bg-brand-600/25 hover:text-white"
                        : "text-dark-400 border-transparent hover:bg-dark-700 hover:text-dark-100 hover:border-dark-600"
                    }`}
                  >
                    {isLocked ? (
                      <svg
                        width="13"
                        height="13"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                        <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                      </svg>
                    ) : (
                      <svg
                        width="13"
                        height="13"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                        <path d="M7 11V7a5 5 0 0 1 9.9-1"></path>
                      </svg>
                    )}
                  </button>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => onLoadSlot(i)}
                    title="Carregar este acorde nos seletores"
                    className="px-2.5 py-1 text-xs font-semibold bg-[#2a2a30] hover:bg-brand-600 border border-[#3d3d45] hover:border-brand-600 text-dark-100 hover:text-white rounded-md transition-all duration-150 cursor-pointer"
                  >
                    Visualizar
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onRemove(i);
                    }}
                    title={isLocked ? "Libere a trava antes de excluir" : "Excluir este slot"}
                    className="w-7 h-7 flex items-center justify-center text-dark-400 hover:text-red-400 hover:bg-red-500/10 rounded-md transition-all duration-150 cursor-pointer text-sm font-bold"
                  >
                    ✕
                  </button>
                </div>
              </div>

              {/* Informações do Acorde */}
              <div className="flex items-baseline justify-between flex-wrap gap-2">
                <h3 className="text-lg sm:text-xl font-extrabold text-white m-0 flex items-baseline gap-1.5">
                  {slot.chordName}
                  <span className="text-xs font-normal text-dark-300">
                    • {slot.inversionName}
                  </span>
                </h3>
                <span className="bg-dark-900 border border-dark-600 text-brand-400 text-xs font-semibold px-2.5 py-0.5 rounded-full">
                  {slot.notesText}
                </span>
              </div>

              {/* Mini Piano do Slot */}
              <div className="piano-scroll-container flex justify-center mt-1">
                <Piano
                  activeKeys={slot.keys}
                  useFlat={slot.useFlat}
                  size="mini"
                />
              </div>
            </div>
          );
        })}

        {/* Botão "+" para Adicionar Mais Slots */}
        <button
          type="button"
          onClick={onAddSlot}
          title="Adicionar mais um slot à sequência"
          className="min-h-[130px] rounded-xl border-2 border-dashed border-dark-600 hover:border-brand-500 bg-dark-800/30 hover:bg-brand-600/10 p-6 flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-200 group shadow-sm hover:shadow-[0_4px_16px_rgba(130,87,229,0.2)]"
        >
          <div className="w-10 h-10 rounded-full bg-dark-700 group-hover:bg-brand-600/20 border border-dark-600 group-hover:border-brand-500 text-dark-300 group-hover:text-brand-300 flex items-center justify-center transition-all duration-200 mb-2">
            <span className="text-2xl font-light leading-none">+</span>
          </div>
          <span className="text-xs sm:text-sm font-bold text-dark-200 group-hover:text-white transition-colors">
            Adicionar Novo Slot
          </span>
          <span className="text-[11px] text-dark-400 group-hover:text-brand-300 transition-colors mt-0.5">
            (Slot {slots.length + 1})
          </span>
        </button>
      </div>
    </section>
  );
}
