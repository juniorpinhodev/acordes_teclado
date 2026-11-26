"use client";

import React, { useState, useMemo, useRef, useEffect } from "react";
import { ROOT_NOTE_OPTIONS } from "@/constants/chords";
import { POPULAR_PROGRESSIONS, PROGRESSION_GENRES } from "@/constants/progressions";
import { HARMONIC_SCALES } from "@/constants/scales";
import { resolveProgressionChords } from "@/utils/musicTheory";
import { ChordProgression, HarmonicDegree, ProgressionGenre } from "@/types/music";

interface PopularProgressionsSectionProps {
  onPlayChord: (keys: number[]) => void;
  onSelectChord: (selectRoot: string, type: string) => void;
  onSaveSequenceToSlots: (degrees: HarmonicDegree[], sequenceName: string) => void;
}

const GENRE_BADGE_COLORS: Record<ProgressionGenre, string> = {
  Pop: "bg-pink-500/15 text-pink-300 border-pink-500/30",
  "Gospel / Worship": "bg-brand-600/20 text-brand-300 border-brand-500/30",
  Jazz: "bg-amber-500/15 text-amber-300 border-amber-500/30",
  Blues: "bg-sky-500/15 text-sky-300 border-sky-500/30",
  "Soul / R&B": "bg-purple-500/15 text-purple-300 border-purple-500/30",
  Rock: "bg-orange-500/15 text-orange-300 border-orange-500/30",
  Metal: "bg-red-500/15 text-red-300 border-red-500/30",
};

const BPM_OPTIONS = [
  { label: "75 BPM (Lento)", ms: 1150 },
  { label: "100 BPM (Médio)", ms: 880 },
  { label: "125 BPM (Rápido)", ms: 680 },
];

export function PopularProgressionsSection({
  onPlayChord,
  onSelectChord,
  onSaveSequenceToSlots,
}: PopularProgressionsSectionProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [tonic, setTonic] = useState("C");
  const [selectedGenre, setSelectedGenre] = useState<ProgressionGenre | "Todos">("Todos");
  const [formationMode, setFormationMode] = useState<"auto" | "triads" | "tetrads">("auto");
  const [stepMs, setStepMs] = useState<number>(880);

  const [playingState, setPlayingState] = useState<{
    progressionId: string;
    stepIndex: number;
  } | null>(null);

  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const stopPlayback = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    setPlayingState(null);
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  useEffect(() => {
    stopPlayback();
  }, [tonic, selectedGenre, formationMode]);

  const filteredProgressions = useMemo(() => {
    if (selectedGenre === "Todos") return POPULAR_PROGRESSIONS;
    return POPULAR_PROGRESSIONS.filter((p) => p.genre === selectedGenre);
  }, [selectedGenre]);

  const resolvedMap = useMemo(() => {
    const map = new Map<string, HarmonicDegree[]>();
    for (const prog of filteredProgressions) {
      map.set(prog.id, resolveProgressionChords(prog, tonic, formationMode));
    }
    return map;
  }, [filteredProgressions, tonic, formationMode]);

  const handlePlayProgression = (prog: ChordProgression, degrees: HarmonicDegree[]) => {
    if (playingState?.progressionId === prog.id) {
      stopPlayback();
      return;
    }

    stopPlayback();
    let idx = 0;

    const tick = () => {
      if (idx >= degrees.length) {
        setPlayingState(null);
        timerRef.current = null;
        return;
      }
      setPlayingState({ progressionId: prog.id, stepIndex: idx });
      onPlayChord(degrees[idx].keys);
      idx += 1;
      timerRef.current = setTimeout(tick, stepMs);
    };

    tick();
  };

  const handlePlaySingleChord = (progId: string, stepIndex: number, keys: number[]) => {
    stopPlayback();
    setPlayingState({ progressionId: progId, stepIndex });
    onPlayChord(keys);
    timerRef.current = setTimeout(() => {
      setPlayingState(null);
    }, 650);
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
            🎶
          </span>
          <div>
            <div className="text-sm sm:text-base font-bold text-white flex items-center gap-2 flex-wrap">
              <span>Progressões de Acordes</span>
              <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-brand-600/20 text-brand-300 border border-brand-500/30">
                {POPULAR_PROGRESSIONS.length} progressões • {PROGRESSION_GENRES.length} estilos
              </span>
            </div>
            <p className="text-xs text-dark-300 m-0 mt-0.5">
              {isOpen
                ? "Escolha o tom e o estilo, ouça a sequência e envie direto para os slots"
                : "As progressões mais tocadas de Pop, Gospel, Jazz, Blues, Soul/R&B, Rock e Metal"}
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
          {/* Controles Superiores */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 items-end mb-4">
            {/* Tom / Tônica */}
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="prog-tonic-select"
                className="text-xs font-semibold text-dark-300 uppercase tracking-wider"
              >
                Tom (Tônica)
              </label>
              <select
                id="prog-tonic-select"
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

            {/* Formação */}
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="prog-formation-select"
                className="text-xs font-semibold text-dark-300 uppercase tracking-wider"
              >
                Formação dos Acordes
              </label>
              <select
                id="prog-formation-select"
                value={formationMode}
                onChange={(e) =>
                  setFormationMode(e.target.value as "auto" | "triads" | "tetrads")
                }
                className="w-full min-h-[42px] px-3 py-2 rounded-lg border border-dark-600 bg-dark-900 text-dark-100 text-sm font-medium outline-none focus:border-brand-600 focus:ring-2 focus:ring-brand-600/25 transition-all cursor-pointer"
              >
                <option value="auto" className="bg-dark-900 text-dark-100">
                  Original do Estilo
                </option>
                <option value="triads" className="bg-dark-900 text-dark-100">
                  Forçar Tríades (3 notas)
                </option>
                <option value="tetrads" className="bg-dark-900 text-dark-100">
                  Forçar Tétrades (7ª)
                </option>
              </select>
            </div>

            {/* Velocidade (BPM) */}
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="prog-bpm-select"
                className="text-xs font-semibold text-dark-300 uppercase tracking-wider"
              >
                Andamento da Prévia
              </label>
              <select
                id="prog-bpm-select"
                value={stepMs}
                onChange={(e) => setStepMs(Number(e.target.value))}
                className="w-full min-h-[42px] px-3 py-2 rounded-lg border border-dark-600 bg-dark-900 text-dark-100 text-sm font-medium outline-none focus:border-brand-600 focus:ring-2 focus:ring-brand-600/25 transition-all cursor-pointer"
              >
                {BPM_OPTIONS.map((opt) => (
                  <option key={opt.ms} value={opt.ms} className="bg-dark-900 text-dark-100">
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Filtro por Estilo */}
          <div className="flex flex-wrap gap-1.5 mb-5">
            <button
              type="button"
              onClick={() => setSelectedGenre("Todos")}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all cursor-pointer ${
                selectedGenre === "Todos"
                  ? "bg-brand-600 text-white border-brand-500 shadow-sm"
                  : "bg-dark-900 text-dark-300 border-dark-700 hover:border-dark-500 hover:text-white"
              }`}
            >
              Todos ({POPULAR_PROGRESSIONS.length})
            </button>
            {PROGRESSION_GENRES.map((genre) => {
              const count = POPULAR_PROGRESSIONS.filter((p) => p.genre === genre).length;
              const isSelected = selectedGenre === genre;
              return (
                <button
                  key={genre}
                  type="button"
                  onClick={() => setSelectedGenre(genre)}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all cursor-pointer ${
                    isSelected
                      ? "bg-brand-600 text-white border-brand-500 shadow-sm"
                      : "bg-dark-900 text-dark-300 border-dark-700 hover:border-dark-500 hover:text-white"
                  }`}
                >
                  {genre} ({count})
                </button>
              );
            })}
          </div>

          {/* Lista de Progressões */}
          <div className="flex flex-col gap-3.5 max-h-[540px] overflow-y-auto pr-1">
            {filteredProgressions.map((prog) => {
              const degrees = resolvedMap.get(prog.id) || [];
              const isPlayingThis = playingState?.progressionId === prog.id;
              const scaleName =
                HARMONIC_SCALES.find((s) => s.id === prog.scaleId)?.name.split(" (")[0] ||
                "Maior";

              return (
                <div
                  key={prog.id}
                  className={`rounded-xl border p-4 flex flex-col gap-3 transition-all duration-200 ${
                    isPlayingThis
                      ? "bg-dark-900 border-brand-500/70 shadow-[0_0_18px_rgba(130,87,229,0.2)]"
                      : "bg-dark-900/70 border-dark-700 hover:border-dark-600"
                  }`}
                >
                  {/* Cabeçalho do Card */}
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center justify-between gap-2 flex-wrap">
                      <h3 className="text-sm sm:text-base font-bold text-white m-0">
                        {prog.name}
                      </h3>
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span
                          className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${
                            GENRE_BADGE_COLORS[prog.genre]
                          }`}
                        >
                          {prog.genre}
                        </span>
                        <span className="text-[11px] font-medium text-dark-300 bg-dark-800 px-2.5 py-0.5 rounded-full border border-dark-700">
                          {scaleName} • {degrees.length} acordes
                        </span>
                      </div>
                    </div>
                    <p className="text-xs text-dark-300 m-0">{prog.description}</p>
                  </div>

                  {/* Chips dos Acordes da Sequência */}
                  <div className="flex flex-wrap gap-2">
                    {degrees.map((deg, idx) => {
                      const isStepActive = isPlayingThis && playingState?.stepIndex === idx;
                      return (
                        <div
                          key={`${prog.id}-${idx}`}
                          className={`flex flex-col min-w-[80px] rounded-lg border overflow-hidden transition-all ${
                            isStepActive
                              ? "bg-brand-600/30 border-brand-400 scale-[1.03] shadow-[0_0_12px_rgba(130,87,229,0.4)]"
                              : "bg-dark-800 border-dark-700 hover:border-brand-500/50"
                          }`}
                        >
                          <button
                            type="button"
                            onClick={() => handlePlaySingleChord(prog.id, idx, deg.keys)}
                            title={`Ouvir ${deg.chordFullName} (${deg.notesText.replace("Notas: ", "")})`}
                            className="flex flex-col items-center px-3 py-2 hover:bg-dark-750 transition-colors cursor-pointer"
                          >
                            <span className="text-[10px] font-semibold text-dark-400">
                              {deg.degreeLabel}{" "}
                              <span className="font-mono text-brand-400">({deg.roman})</span>
                            </span>
                            <span className="text-sm font-extrabold text-white mt-0.5">
                              {deg.chordSymbol}
                            </span>
                          </button>

                          <button
                            type="button"
                            onClick={() => onSelectChord(deg.selectRoot, deg.type)}
                            title={`Visualizar construção de ${deg.chordFullName} no teclado`}
                            className="w-full py-1 px-2 border-t border-dark-700/80 bg-dark-900/50 hover:bg-brand-600/25 text-[10px] font-semibold text-brand-300 hover:text-white transition-colors cursor-pointer"
                          >
                            🎹 Ver
                          </button>
                        </div>
                      );
                    })}
                  </div>

                  {/* Barra Inferior Padronizada de Ações */}
                  <div className="flex flex-wrap items-center justify-between gap-2 pt-2.5 border-t border-dark-800">
                    <span className="text-[11px] text-dark-400">
                      Clique no acorde para ouvir ou em 🎹 Ver para abrir no teclado
                    </span>

                    <div className="flex items-center gap-2 ml-auto">
                      <button
                        type="button"
                        onClick={() => handlePlayProgression(prog, degrees)}
                        className={`min-h-[34px] px-3.5 py-1.5 rounded-lg text-xs font-bold inline-flex items-center justify-center gap-1.5 border transition-all cursor-pointer ${
                          isPlayingThis
                            ? "bg-amber-500/20 text-amber-300 border-amber-500/40 hover:bg-amber-500/30"
                            : "bg-dark-800 hover:bg-dark-700 text-dark-100 border-dark-600 hover:border-brand-500"
                        }`}
                      >
                        <span>{isPlayingThis ? "⏹" : "▶"}</span>
                        <span>{isPlayingThis ? "Parar" : "Ouvir Sequência"}</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => onSaveSequenceToSlots(degrees, prog.name)}
                        title="Adicionar todos os acordes desta sequência aos slots"
                        className="min-h-[34px] px-3.5 py-1.5 rounded-lg text-xs font-bold inline-flex items-center justify-center gap-1.5 bg-brand-600 hover:bg-brand-500 text-white shadow-[0_2px_10px_rgba(130,87,229,0.25)] transition-all cursor-pointer"
                      >
                        <span>+ Enviar aos Slots</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </section>
  );
}
