"use client";

import React, { useState, useMemo, useRef, useEffect } from "react";
import { CHROMATIC_FLATS, CHROMATIC_SHARPS, ROOT_NOTE_OPTIONS } from "@/constants/chords";
import { MUSICAL_SCALES_LIBRARY, SCALE_CATEGORIES } from "@/constants/scalesLibrary";
import { getPitch } from "@/utils/musicTheory";
import { ScaleCategory } from "@/types/music";
import { Piano } from "./Piano";

interface ScalesExplorerSectionProps {
  onPlayKey: (pianoIndex: number, detune?: number) => void;
}

const CATEGORY_BADGE_STYLES: Record<ScaleCategory, string> = {
  "Maiores & Modos": "bg-brand-600/20 text-brand-300 border-brand-500/30",
  "Menores & Modos": "bg-sky-500/15 text-sky-300 border-sky-500/30",
  "Pentatônicas & Blues": "bg-amber-500/15 text-amber-300 border-amber-500/30",
  "Exóticas & Orientais": "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
};

export function ScalesExplorerSection({ onPlayKey }: ScalesExplorerSectionProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [tonic, setTonic] = useState("C");
  const [selectedCategory, setSelectedCategory] = useState<ScaleCategory | "Todas">("Todas");
  const [scaleId, setScaleId] = useState(MUSICAL_SCALES_LIBRARY[0].id);
  const [playingStep, setPlayingStep] = useState<number | null>(null);

  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const filteredScales = useMemo(() => {
    if (selectedCategory === "Todas") return MUSICAL_SCALES_LIBRARY;
    return MUSICAL_SCALES_LIBRARY.filter((s) => s.category === selectedCategory);
  }, [selectedCategory]);

  const currentScale = useMemo(() => {
    return (
      filteredScales.find((s) => s.id === scaleId) ||
      filteredScales[0] ||
      MUSICAL_SCALES_LIBRARY[0]
    );
  }, [filteredScales, scaleId]);

  const tonicPitch = useMemo(() => getPitch(tonic), [tonic]);

  const useFlat = useMemo(() => {
    return ["F", "D#", "G#", "A#"].includes(tonic) && currentScale.category !== "Exóticas & Orientais";
  }, [tonic, currentScale.category]);

  // Teclas da escala dentro das 2 oitavas (0..23), incluindo a oitava superior quando couber
  const scaleKeyItems = useMemo(() => {
    const items = currentScale.intervals
      .map((iv, idx) => ({
        key: tonicPitch + iv,
        detune: currentScale.detuneCents?.[idx] ?? 0,
      }))
      .filter((item) => item.key >= 0 && item.key < 24);

    // Adiciona a oitava (tônica + 12) para completar a audição/visualização da escala
    const octaveKey = tonicPitch + 12;
    if (octaveKey < 24 && !items.some((i) => i.key === octaveKey)) {
      items.push({ key: octaveKey, detune: 0 });
    }

    return items;
  }, [currentScale.intervals, currentScale.detuneCents, tonicPitch]);

  const scaleKeys = useMemo(() => scaleKeyItems.map((i) => i.key), [scaleKeyItems]);

  const hasMicrotones = Boolean(currentScale.detuneCents?.some((c) => c !== 0));

  // Nomes das notas da escala (sem repetir a oitava nos chips)
  const scaleNotes = useMemo(() => {
    const noteList = useFlat ? CHROMATIC_FLATS : CHROMATIC_SHARPS;
    return currentScale.intervals.map((iv, idx) => {
      const key = tonicPitch + iv;
      const detune = currentScale.detuneCents?.[idx] ?? 0;
      const baseLabel = noteList[((key % 12) + 12) % 12];
      return {
        label: detune === -50 ? `${baseLabel}d` : baseLabel,
        pianoIndex: key < 24 ? key : key - 12,
        detune,
      };
    });
  }, [currentScale.intervals, currentScale.detuneCents, tonicPitch, useFlat]);

  const stopPlayback = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    setPlayingStep(null);
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  useEffect(() => {
    stopPlayback();
  }, [tonic, currentScale.id]);

  const handleCategoryChange = (cat: ScaleCategory | "Todas") => {
    setSelectedCategory(cat);
    const list =
      cat === "Todas"
        ? MUSICAL_SCALES_LIBRARY
        : MUSICAL_SCALES_LIBRARY.filter((s) => s.category === cat);
    if (list.length > 0 && !list.some((s) => s.id === scaleId)) {
      setScaleId(list[0].id);
    }
  };

  const handlePlayScale = () => {
    if (playingStep !== null) {
      stopPlayback();
      return;
    }

    let idx = 0;
    const step = () => {
      if (idx >= scaleKeyItems.length) {
        setPlayingStep(null);
        timerRef.current = null;
        return;
      }
      setPlayingStep(idx);
      onPlayKey(scaleKeyItems[idx].key, scaleKeyItems[idx].detune);
      idx += 1;
      timerRef.current = setTimeout(step, 340);
    };

    step();
  };

  const handlePlaySingleNote = (pianoIndex: number, idx: number, detune: number = 0) => {
    stopPlayback();
    setPlayingStep(idx);
    onPlayKey(pianoIndex, detune);
    timerRef.current = setTimeout(() => {
      setPlayingStep(null);
    }, 450);
  };

  const handlePianoKeyPress = (pianoIndex: number) => {
    const matched = scaleKeyItems.find((item) => item.key === pianoIndex);
    onPlayKey(pianoIndex, matched?.detune ?? 0);
  };

  const liveKeys = useMemo(() => {
    if (playingStep === null || scaleKeys[playingStep] === undefined) return [];
    return [scaleKeys[playingStep]];
  }, [playingStep, scaleKeys]);

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
            🧭
          </span>
          <div>
            <div className="text-sm sm:text-base font-bold text-white flex items-center gap-2 flex-wrap">
              <span>Escalas Musicais</span>
              <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-brand-600/20 text-brand-300 border border-brand-500/30">
                {scaleNotes[0]?.label || tonic} • {currentScale.name.split(" (")[0]} •{" "}
                {currentScale.intervals.length} notas
              </span>
            </div>
            <p className="text-xs text-dark-300 m-0 mt-0.5">
              {isOpen
                ? "Visualize as notas no teclado e ouça a escala subindo"
                : "Maiores, Menores, Blues, Pentatônicas, Árabe, Oriental e Exóticas"}
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
          {/* Filtro por Categoria */}
          <div className="flex flex-wrap gap-1.5 mb-4">
            <button
              type="button"
              onClick={() => handleCategoryChange("Todas")}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all cursor-pointer ${
                selectedCategory === "Todas"
                  ? "bg-brand-600 text-white border-brand-500 shadow-sm"
                  : "bg-dark-900 text-dark-300 border-dark-700 hover:border-dark-500 hover:text-white"
              }`}
            >
              Todas ({MUSICAL_SCALES_LIBRARY.length})
            </button>
            {SCALE_CATEGORIES.map((cat) => {
              const count = MUSICAL_SCALES_LIBRARY.filter((s) => s.category === cat).length;
              const isSelected = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => handleCategoryChange(cat)}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all cursor-pointer ${
                    isSelected
                      ? "bg-brand-600 text-white border-brand-500 shadow-sm"
                      : "bg-dark-900 text-dark-300 border-dark-700 hover:border-dark-500 hover:text-white"
                  }`}
                >
                  {cat} ({count})
                </button>
              );
            })}
          </div>

          {/* Controles: Tom, Escala, Ouvir */}
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-3.5 items-end mb-4">
            <div className="sm:col-span-3 flex flex-col gap-1.5">
              <label
                htmlFor="scales-tonic-select"
                className="text-xs font-semibold text-dark-300 uppercase tracking-wider"
              >
                Tom (Tônica)
              </label>
              <select
                id="scales-tonic-select"
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

            <div className="sm:col-span-6 flex flex-col gap-1.5">
              <label
                htmlFor="scales-library-select"
                className="text-xs font-semibold text-dark-300 uppercase tracking-wider"
              >
                Escala
              </label>
              <select
                id="scales-library-select"
                value={currentScale.id}
                onChange={(e) => setScaleId(e.target.value)}
                className="w-full min-h-[42px] px-3 py-2 rounded-lg border border-dark-600 bg-dark-900 text-dark-100 text-sm font-medium outline-none focus:border-brand-600 focus:ring-2 focus:ring-brand-600/25 transition-all cursor-pointer"
              >
                {filteredScales.map((scale) => (
                  <option key={scale.id} value={scale.id} className="bg-dark-900 text-dark-100">
                    {scale.name}{scale.isGreekMode ? " [Modo Grego]" : ""}
                  </option>
                ))}
              </select>
            </div>

            <div className="sm:col-span-3">
              <button
                type="button"
                onClick={handlePlayScale}
                className={`w-full min-h-[42px] px-3 py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 border transition-all cursor-pointer ${
                  playingStep !== null
                    ? "bg-amber-500/20 text-amber-300 border-amber-500/40 hover:bg-amber-500/30"
                    : "bg-brand-600 hover:bg-brand-500 text-white border-brand-500 shadow-[0_4px_12px_rgba(130,87,229,0.3)]"
                }`}
              >
                <span>{playingStep !== null ? "⏹" : "▶"}</span>
                <span>{playingStep !== null ? "Parar" : "Ouvir Escala"}</span>
              </button>
            </div>
          </div>

          {/* Card de Informações + Notas Clicáveis + Piano */}
          <div className="rounded-xl border border-dark-700 bg-dark-900/70 p-4 flex flex-col gap-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-base font-extrabold text-white m-0">
                  {scaleNotes[0]?.label || tonic} — {currentScale.name}
                </h3>
                <span
                  className={`text-[11px] font-semibold px-2 py-0.5 rounded-full border ${
                    CATEGORY_BADGE_STYLES[currentScale.category]
                  }`}
                >
                  {currentScale.category}
                </span>
                {currentScale.isGreekMode && (
                  <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full border bg-indigo-500/15 text-indigo-300 border-indigo-500/30">
                    Modo Grego
                  </span>
                )}
                {hasMicrotones && (
                  <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full border bg-purple-500/15 text-purple-300 border-purple-500/30">
                    Microtons (-50 cents)
                  </span>
                )}
              </div>
              <span className="text-xs font-mono font-semibold text-brand-300 bg-dark-800 px-2.5 py-1 rounded-md border border-dark-700">
                Fórmula: {currentScale.formula}
              </span>
            </div>

            <p className="text-xs text-dark-300 m-0">{currentScale.description}</p>

            {/* Chips das Notas da Escala */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-semibold text-dark-400 mr-1">Notas:</span>
              {scaleNotes.map((note, idx) => {
                const isActiveNote = playingStep === idx;
                return (
                  <button
                    key={`${note.label}-${idx}`}
                    type="button"
                    onClick={() => handlePlaySingleNote(note.pianoIndex, idx, note.detune)}
                    title={`Ouvir nota ${note.label}${note.detune !== 0 ? ` (${note.detune} cents)` : ""}`}
                    className={`min-w-[38px] px-2.5 py-1 rounded-md text-xs font-bold border transition-all cursor-pointer ${
                      isActiveNote
                        ? "bg-brand-600 text-white border-brand-400 scale-105 shadow-[0_0_10px_rgba(130,87,229,0.5)]"
                        : "bg-dark-800 hover:bg-dark-750 text-dark-100 border-dark-600 hover:border-brand-500"
                    }`}
                  >
                    {note.label}
                  </button>
                );
              })}
            </div>

            {/* Piano Interativo com as Notas da Escala */}
            <div className="pt-2 overflow-x-auto">
              <Piano
                activeKeys={scaleKeys}
                liveKeys={liveKeys}
                useFlat={useFlat}
                onKeyClick={handlePianoKeyPress}
              />
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
