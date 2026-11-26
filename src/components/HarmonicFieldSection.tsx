"use client";

import React, { useState, useMemo, useEffect, useRef } from "react";
import { ROOT_NOTE_OPTIONS } from "@/constants/chords";
import { HARMONIC_SCALES } from "@/constants/scales";
import { generateHarmonicField } from "@/utils/musicTheory";
import { HarmonicDegree, HarmonicFunction } from "@/types/music";

interface HarmonicFieldSectionProps {
  onPlayChord: (keys: number[]) => void;
  onSelectChord: (selectRoot: string, type: string) => void;
  onSaveToSlot: (degree: HarmonicDegree) => void;
}

const FUNCTION_BADGE_STYLES: Record<HarmonicFunction, string> = {
  Tônica: "bg-brand-600/20 text-brand-300 border-brand-500/30",
  Subdominante: "bg-sky-500/15 text-sky-300 border-sky-500/30",
  Dominante: "bg-amber-500/15 text-amber-300 border-amber-500/30",
};

export function HarmonicFieldSection({
  onPlayChord,
  onSelectChord,
  onSaveToSlot,
}: HarmonicFieldSectionProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [tonic, setTonic] = useState("C");
  const [scaleId, setScaleId] = useState("major");
  const [useTetrads, setUseTetrads] = useState(false);
  const [playingDegreeIndex, setPlayingDegreeIndex] = useState<number | null>(null);

  const sequenceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const currentScale = useMemo(
    () => HARMONIC_SCALES.find((s) => s.id === scaleId) || HARMONIC_SCALES[0],
    [scaleId]
  );

  const degrees = useMemo(
    () => generateHarmonicField(tonic, scaleId, useTetrads),
    [tonic, scaleId, useTetrads]
  );

  const stopSequence = () => {
    if (sequenceTimerRef.current) {
      clearTimeout(sequenceTimerRef.current);
      sequenceTimerRef.current = null;
    }
    setPlayingDegreeIndex(null);
  };

  useEffect(() => {
    return () => {
      if (sequenceTimerRef.current) {
        clearTimeout(sequenceTimerRef.current);
      }
    };
  }, []);

  // Para sequência se mudar escala, tônica ou formação
  useEffect(() => {
    stopSequence();
  }, [tonic, scaleId, useTetrads]);

  const handlePlaySequence = () => {
    if (playingDegreeIndex !== null) {
      stopSequence();
      return;
    }

    let idx = 0;
    const step = () => {
      if (idx >= degrees.length) {
        setPlayingDegreeIndex(null);
        sequenceTimerRef.current = null;
        return;
      }
      setPlayingDegreeIndex(idx);
      onPlayChord(degrees[idx].keys);
      idx += 1;
      sequenceTimerRef.current = setTimeout(step, 900);
    };

    step();
  };

  const handlePlaySingle = (deg: HarmonicDegree) => {
    stopSequence();
    setPlayingDegreeIndex(deg.degreeIndex);
    onPlayChord(deg.keys);
    sequenceTimerRef.current = setTimeout(() => {
      setPlayingDegreeIndex(null);
    }, 700);
  };

  return (
    <section className="w-full max-w-[840px] mb-6 sm:mb-8">
      {/* Botão Toggle Recolhido/Expandido */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-expanded={isOpen}
        className={`w-full flex items-center justify-between gap-3 px-4 sm:px-5 py-3.5 rounded-[14px] border transition-all duration-200 cursor-pointer ${
          isOpen
            ? "bg-dark-800 border-brand-600/60 rounded-b-none shadow-[0_6px_20px_rgba(130,87,229,0.15)]"
            : "bg-dark-800 hover:bg-dark-750 border-dark-700 hover:border-brand-600/50 shadow-[0_8px_20px_rgba(0,0,0,0.25)]"
        }`}
      >
        <div className="flex items-center gap-3 text-left">
          <span className="w-9 h-9 rounded-lg bg-brand-600/20 border border-brand-500/30 flex items-center justify-center text-lg shrink-0">
            🎼
          </span>
          <div>
            <div className="text-sm sm:text-base font-bold text-white flex items-center gap-2 flex-wrap">
              <span>Acordes do Campo Harmônico</span>
              <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-brand-600/20 text-brand-300 border border-brand-500/30">
                {degrees[0]?.root || tonic} • {currentScale.name.split(" (")[0]} •{" "}
                {useTetrads ? "Tétrades" : "Tríades"}
              </span>
            </div>
            <p className="text-xs text-dark-300 m-0 mt-0.5">
              {isOpen
                ? "Clique em ouvir, visualizar no piano ou enviar direto para os slots"
                : "Abrir tabela dinâmica de graus (Iº ao VIIº), escalas e modos"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs font-semibold text-brand-400 shrink-0">
          <span className="hidden sm:inline">{isOpen ? "Recolher" : "Explorar"}</span>
          <svg
            className={`w-5 h-5 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </button>

      {/* Painel Expansível */}
      {isOpen && (
        <div className="bg-dark-800 border border-t-0 border-brand-600/40 rounded-b-[14px] p-4 sm:p-5 md:p-6 shadow-[0_12px_28px_rgba(0,0,0,0.35)]">
          {/* Controles do Campo Harmônico */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3.5 items-end mb-4">
            {/* Tom / Tônica */}
            <div className="lg:col-span-3 flex flex-col gap-1.5">
              <label
                htmlFor="harmonic-tonic-select"
                className="text-xs font-semibold text-dark-300 uppercase tracking-wider"
              >
                Tom (Tônica)
              </label>
              <select
                id="harmonic-tonic-select"
                value={tonic}
                onChange={(e) => setTonic(e.target.value)}
                className="w-full min-h-[42px] px-3 py-2 rounded-lg border border-dark-600 bg-dark-900 text-dark-100 text-sm font-medium outline-none focus:border-brand-600 focus:ring-2 focus:ring-brand-600/25 transition-all cursor-pointer"
              >
                {ROOT_NOTE_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value} className="bg-dark-900 text-dark-100">
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Escala */}
            <div className="lg:col-span-4 flex flex-col gap-1.5">
              <label
                htmlFor="harmonic-scale-select"
                className="text-xs font-semibold text-dark-300 uppercase tracking-wider"
              >
                Escala / Modo
              </label>
              <select
                id="harmonic-scale-select"
                value={scaleId}
                onChange={(e) => setScaleId(e.target.value)}
                className="w-full min-h-[42px] px-3 py-2 rounded-lg border border-dark-600 bg-dark-900 text-dark-100 text-sm font-medium outline-none focus:border-brand-600 focus:ring-2 focus:ring-brand-600/25 transition-all cursor-pointer"
              >
                {HARMONIC_SCALES.map((scale) => (
                  <option key={scale.id} value={scale.id} className="bg-dark-900 text-dark-100">
                    {scale.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Formação: Tríades vs Tétrades */}
            <div className="lg:col-span-3 flex flex-col gap-1.5">
              <span className="text-xs font-semibold text-dark-300 uppercase tracking-wider">
                Formação
              </span>
              <div className="grid grid-cols-2 bg-dark-900 border border-dark-600 rounded-lg p-1 min-h-[42px]">
                <button
                  type="button"
                  onClick={() => setUseTetrads(false)}
                  className={`text-xs font-semibold rounded-md transition-all cursor-pointer ${
                    !useTetrads
                      ? "bg-brand-600 text-white shadow-sm"
                      : "text-dark-300 hover:text-white"
                  }`}
                >
                  Tríades
                </button>
                <button
                  type="button"
                  onClick={() => setUseTetrads(true)}
                  className={`text-xs font-semibold rounded-md transition-all cursor-pointer ${
                    useTetrads
                      ? "bg-brand-600 text-white shadow-sm"
                      : "text-dark-300 hover:text-white"
                  }`}
                >
                  Tétrades (7ª)
                </button>
              </div>
            </div>

            {/* Botão Ouvir Sequência I -> VII */}
            <div className="lg:col-span-2">
              <button
                type="button"
                onClick={handlePlaySequence}
                className={`w-full min-h-[42px] px-3 py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 border transition-all cursor-pointer ${
                  playingDegreeIndex !== null
                    ? "bg-amber-500/20 text-amber-300 border-amber-500/40 hover:bg-amber-500/30"
                    : "bg-dark-900 hover:bg-dark-700 text-dark-100 border-dark-600 hover:border-brand-500"
                }`}
              >
                <span>{playingDegreeIndex !== null ? "⏹" : "▶"}</span>
                <span>{playingDegreeIndex !== null ? "Parar" : "Ouvir I→VII"}</span>
              </button>
            </div>
          </div>

          {/* Descrição da escala */}
          <p className="text-xs text-dark-300 mb-4 m-0 px-3 py-2 rounded-lg bg-dark-900/70 border border-dark-700/80">
            <strong className="text-brand-400">{currentScale.name}:</strong>{" "}
            {currentScale.description}
          </p>

          {/* Tabela Dinâmica de Graus */}
          <div className="overflow-x-auto rounded-xl border border-dark-700 bg-dark-900/60">
            <table className="w-full text-left border-collapse min-w-[560px]">
              <thead>
                <tr className="border-b border-dark-700 bg-dark-900 text-[11px] font-bold uppercase tracking-wider text-dark-300">
                  <th className="py-2.5 px-3">Grau</th>
                  <th className="py-2.5 px-3">Função</th>
                  <th className="py-2.5 px-3">Acorde</th>
                  <th className="py-2.5 px-3">Notas</th>
                  <th className="py-2.5 px-3 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-dark-700/70 text-sm">
                {degrees.map((deg) => {
                  const isPlaying = playingDegreeIndex === deg.degreeIndex;
                  const cleanNotes = deg.notesText.replace("Notas: ", "");

                  return (
                    <tr
                      key={deg.degreeIndex}
                      className={`transition-colors duration-150 ${
                        isPlaying ? "bg-brand-600/20" : "hover:bg-dark-800/80"
                      }`}
                    >
                      {/* Grau */}
                      <td className="py-2.5 px-3 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-dark-400 w-7">
                            {deg.degreeLabel}
                          </span>
                          <span className="font-mono text-sm font-bold text-brand-300 bg-dark-800 px-2 py-0.5 rounded border border-dark-700">
                            {deg.roman}
                          </span>
                        </div>
                      </td>

                      {/* Função Harmônica */}
                      <td className="py-2.5 px-3 whitespace-nowrap">
                        <span
                          className={`inline-block text-[11px] font-semibold px-2 py-0.5 rounded-full border ${
                            FUNCTION_BADGE_STYLES[deg.harmonicFunction]
                          }`}
                        >
                          {deg.harmonicFunction}
                        </span>
                      </td>

                      {/* Cifra do Acorde */}
                      <td className="py-2.5 px-3 whitespace-nowrap">
                        <button
                          type="button"
                          onClick={() => handlePlaySingle(deg)}
                          title={`Ouvir ${deg.chordFullName}`}
                          className="text-base font-extrabold text-white hover:text-brand-400 transition-colors cursor-pointer"
                        >
                          {deg.chordSymbol}
                        </button>
                      </td>

                      {/* Notas */}
                      <td className="py-2.5 px-3 text-xs text-dark-300 whitespace-nowrap">
                        {cleanNotes}
                      </td>

                      {/* Ações */}
                      <td className="py-2.5 px-3 text-right whitespace-nowrap">
                        <div className="inline-flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => handlePlaySingle(deg)}
                            title="Ouvir acorde"
                            className="px-2.5 py-1.5 rounded-md text-xs font-semibold bg-dark-800 hover:bg-dark-700 text-dark-100 border border-dark-600 transition-colors cursor-pointer"
                          >
                            ▶
                          </button>
                          <button
                            type="button"
                            onClick={() => onSelectChord(deg.selectRoot, deg.type)}
                            title="Carregar acorde no piano e ver inversões"
                            className="px-2.5 py-1.5 rounded-md text-xs font-semibold bg-dark-800 hover:bg-dark-700 text-brand-300 border border-dark-600 hover:border-brand-500/60 transition-colors cursor-pointer"
                          >
                            🎹 Ver
                          </button>
                          <button
                            type="button"
                            onClick={() => onSaveToSlot(deg)}
                            title="Salvar acorde no slot da música"
                            className="px-2.5 py-1.5 rounded-md text-xs font-bold bg-brand-600 hover:bg-brand-500 text-white transition-colors cursor-pointer"
                          >
                            + Slot
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </section>
  );
}
