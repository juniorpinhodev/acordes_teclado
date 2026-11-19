"use client";

import React from "react";
import { TimbreType } from "@/types/audio";
import { TIMBRE_OPTIONS } from "@/constants/audio";

interface AudioControlsProps {
  isMidiSupported: boolean;
  isMidiConnected: boolean;
  midiDeviceName: string | null;
  activeMidiNotesCount: number;
  detectedChordName: string | null;
  onSaveDetectedChord?: () => void;
  currentTimbre: TimbreType;
  onSelectTimbre: (timbre: TimbreType) => void;
  isLoadingSamples: boolean;
  volume: number;
  onVolumeChange: (vol: number) => void;
}

export function AudioControls({
  isMidiSupported,
  isMidiConnected,
  midiDeviceName,
  activeMidiNotesCount,
  detectedChordName,
  onSaveDetectedChord,
  currentTimbre,
  onSelectTimbre,
  isLoadingSamples,
  volume,
  onVolumeChange,
}: AudioControlsProps) {
  return (
    <div className="w-full max-w-[840px] bg-dark-800 border border-dark-700 rounded-[14px] p-4 sm:p-5 mb-6 sm:mb-8 shadow-[0_10px_25px_rgba(0,0,0,0.3)] flex flex-col gap-4">
      {/* Barra Superior: Status do Controlador MIDI */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-dark-700">
        <div className="flex items-center gap-2.5">
          <div className="relative flex items-center justify-center">
            <span
              className={`w-3 h-3 rounded-full ${
                isMidiConnected ? "bg-emerald-500" : "bg-dark-500"
              }`}
            />
            {isMidiConnected && (
              <span className="absolute w-3 h-3 rounded-full bg-emerald-400 animate-ping opacity-75" />
            )}
          </div>

          <div className="flex flex-col justify-center">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-dark-300">
                Controlador MIDI:
              </span>
              <span
                className={`text-xs sm:text-sm font-semibold ${
                  isMidiConnected ? "text-emerald-400" : "text-dark-400"
                }`}
              >
                {isMidiConnected
                  ? midiDeviceName || "Dispositivo Conectado"
                  : isMidiSupported
                  ? "Nenhum teclado detectado (conecte via USB)"
                  : "Navegador sem suporte a Web MIDI"}
              </span>
            </div>

            {/* Linha permanente com altura fixa para evitar variação na altura do site */}
            <div className="h-5 flex items-center text-xs">
              {isMidiConnected ? (
                activeMidiNotesCount > 0 ? (
                  <span className="text-brand-300 font-semibold flex items-center gap-1.5 animate-in fade-in duration-100">
                    <span className="inline-block w-1.5 h-1.5 rounded-full bg-brand-400 animate-pulse" />
                    <span>
                      Tocando {activeMidiNotesCount} nota{activeMidiNotesCount > 1 ? "s" : ""} simultânea{activeMidiNotesCount > 1 ? "s" : ""}
                    </span>
                  </span>
                ) : (
                  <span className="text-dark-400 font-normal">
                    Nenhuma tecla tocada
                  </span>
                )
              ) : (
                <span className="text-dark-400 font-normal">
                  Nenhum teclado conectado • Conecte via USB
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Detecção em Tempo Real do Acorde Tocado via MIDI com altura reservada */}
        <div className="min-h-[36px] flex items-center">
          {detectedChordName ? (
            <div className="flex items-center gap-2 bg-brand-600/15 border border-brand-600/40 px-3 py-1.5 rounded-lg animate-in fade-in duration-150">
              <span className="text-xs text-dark-300 font-medium">Acorde Tocado:</span>
              <span className="text-sm font-extrabold text-brand-300">{detectedChordName}</span>
              {onSaveDetectedChord && (
                <button
                  type="button"
                  onClick={onSaveDetectedChord}
                  title="Salvar este acorde detectado no próximo slot"
                  className="ml-1 text-[11px] font-bold px-2 py-0.5 rounded bg-brand-600 hover:bg-brand-500 text-white transition-colors cursor-pointer"
                >
                  Salvar no Slot
                </button>
              )}
            </div>
          ) : isMidiConnected ? (
            <div className="hidden sm:flex items-center gap-1.5 px-2 text-xs text-dark-500">
              <span>Toque 3+ teclas para detectar o acorde</span>
            </div>
          ) : null}
        </div>
      </div>

      {/* Seleção de Timbres e Volume */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        {/* Seletor de Timbres */}
        <div className="flex flex-col gap-1.5 flex-1 min-w-[280px]">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-dark-300 uppercase tracking-wider">
              Timbre de Áudio
            </label>
            {isLoadingSamples && (
              <span className="text-[11px] text-brand-400 font-medium animate-pulse">
                Carregando samples...
              </span>
            )}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {TIMBRE_OPTIONS.map((timbre) => {
              const isSelected = currentTimbre === timbre.id;
              return (
                <button
                  key={timbre.id}
                  type="button"
                  onClick={() => onSelectTimbre(timbre.id)}
                  title={timbre.description}
                  className={`px-3 py-2 rounded-lg border text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 transition-all duration-150 cursor-pointer ${
                    isSelected
                      ? "bg-brand-600 text-white border-brand-500 shadow-[0_2px_10px_rgba(130,87,229,0.35)]"
                      : "bg-dark-900 text-dark-200 border-dark-600 hover:border-dark-500 hover:text-white hover:bg-dark-750"
                  }`}
                >
                  <span className="text-base">{timbre.icon}</span>
                  <span className="truncate">{timbre.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Controle de Volume */}
        <div className="flex flex-col gap-1.5 min-w-[140px]">
          <label htmlFor="volume-slider" className="text-xs font-semibold text-dark-300 uppercase tracking-wider flex items-center gap-1.5">
            <span>🔊</span>
            <span>Volume ({Math.round(volume * 100)}%)</span>
          </label>
          <input
            id="volume-slider"
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={volume}
            onChange={(e) => onVolumeChange(parseFloat(e.target.value))}
            className="w-full accent-brand-500 cursor-pointer h-2 bg-dark-900 rounded-lg appearance-none"
          />
        </div>
      </div>
    </div>
  );
}
