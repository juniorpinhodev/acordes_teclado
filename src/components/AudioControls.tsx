"use client";

import React, { useState, useRef, useEffect } from "react";
import { TimbreType } from "@/types/audio";
import { TIMBRE_OPTIONS } from "@/constants/audio";
import { InstrumentIcon } from "./InstrumentIcon";

interface AudioControlsProps {
  isMidiSupported: boolean;
  isMidiConnected: boolean;
  midiDeviceName: string | null;
  detectedChordName: string | null;
  onSaveDetectedChord?: () => void;
  currentTimbre: TimbreType;
  onSelectTimbre: (timbre: TimbreType) => void;
  isLoadingSamples: boolean;
  loadingPercent: number;
  isTimbreReady: boolean;
  loadedTimbres: Record<string, boolean>;
  onLoadCurrentTimbre?: () => void;
  volume: number;
  onVolumeChange: (vol: number) => void;
  isSustainOn: boolean;
  onToggleSustain: () => void;
}

export function AudioControls({
  isMidiSupported,
  isMidiConnected,
  midiDeviceName,
  detectedChordName,
  onSaveDetectedChord,
  currentTimbre,
  onSelectTimbre,
  isLoadingSamples,
  loadingPercent,
  isTimbreReady,
  loadedTimbres = {},
  volume,
  onVolumeChange,
  isSustainOn,
  onToggleSustain,
}: AudioControlsProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const currentOption = TIMBRE_OPTIONS.find((t) => t.id === currentTimbre);

  return (
    <div className="w-full max-w-[840px] bg-dark-800 border border-dark-700 rounded-[14px] p-4 sm:p-5 mb-6 sm:mb-8 shadow-[0_10px_25px_rgba(0,0,0,0.3)] flex flex-col gap-4">
      {/* Barra Superior: Status do Controlador MIDI */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-dark-700 min-h-[44px]">
        <div className="flex items-center gap-2.5">
          <div className="relative flex items-center justify-center">
            <span
              className={`w-3 h-3 rounded-full ${
                isMidiConnected ? "bg-brand-500" : "bg-dark-500"
              }`}
            />
            {isMidiConnected && (
              <span className="absolute w-3 h-3 rounded-full bg-brand-400 animate-ping opacity-75" />
            )}
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-dark-300">
              Controlador MIDI:
            </span>
            <span
              className={`text-xs sm:text-sm font-semibold ${
                isMidiConnected ? "text-brand-300" : "text-dark-400"
              }`}
            >
              {isMidiConnected
                ? midiDeviceName || "Dispositivo Conectado"
                : isMidiSupported
                ? "Nenhum teclado detectado (conecte via USB)"
                : "Navegador sem suporte a Web MIDI"}
            </span>
          </div>
        </div>

        {/* Detecção em Tempo Real do Acorde Tocado via MIDI */}
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

      {/* Seleção de Timbres (Lista / Dropdown), Sustain e Volume */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
        {/* Seletor de Timbres (Lista de Seleção) */}
        <div className="md:col-span-2 flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <label
              htmlFor="timbre-select"
              className="text-xs font-bold text-dark-300 uppercase tracking-wider"
            >
              Timbre de Áudio (Instrumento)
            </label>

            {/* Indicador discreto apenas enquanto carrega */}
            {isLoadingSamples && (
              <span className="text-[11px] font-bold text-amber-400 flex items-center gap-1.5 animate-pulse">
                <span className="w-2 h-2 rounded-full bg-amber-400" />
                Carregando ({loadingPercent}%)
              </span>
            )}
          </div>

          {/* Elemento de Seleção (Dropdown com Figuras Vetoriais dos Instrumentos) */}
          <div className="relative" ref={dropdownRef}>
            <button
              id="timbre-select"
              type="button"
              onClick={() => setIsDropdownOpen((prev) => !prev)}
              aria-haspopup="listbox"
              aria-expanded={isDropdownOpen}
              className="w-full bg-dark-900 border border-dark-600 hover:border-dark-500 focus:border-brand-500 text-white font-semibold text-sm rounded-lg px-3.5 py-2.5 transition-colors cursor-pointer flex items-center justify-between shadow-inner focus:outline-none focus:ring-1 focus:ring-brand-500"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <span className="text-brand-400 shrink-0">
                  <InstrumentIcon timbre={currentTimbre} className="w-4 h-4" />
                </span>
                <span className="truncate">{currentOption?.label}</span>
              </div>
              <div className="flex items-center gap-2 shrink-0 text-dark-400">
                <svg
                  className={`w-4 h-4 fill-current transition-transform duration-200 ${
                    isDropdownOpen ? "rotate-180" : ""
                  }`}
                  viewBox="0 0 20 20"
                >
                  <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                </svg>
              </div>
            </button>

            {/* Menu Suspenso de Instrumentos */}
            {isDropdownOpen && (
              <div
                className="absolute left-0 right-0 top-full mt-1.5 bg-dark-900 border border-dark-600 rounded-lg shadow-2xl z-50 py-1 overflow-hidden"
                role="listbox"
              >
                {TIMBRE_OPTIONS.map((timbre) => {
                  const isSelected = timbre.id === currentTimbre;
                  const isThisLoaded =
                    loadedTimbres[timbre.id] ||
                    (timbre.id === "grand_piano" && isTimbreReady);

                  return (
                    <button
                      key={timbre.id}
                      type="button"
                      role="option"
                      aria-selected={isSelected}
                      onClick={() => {
                        onSelectTimbre(timbre.id);
                        setIsDropdownOpen(false);
                      }}
                      className={`w-full px-3.5 py-2.5 text-left text-sm flex items-center justify-between transition-colors cursor-pointer ${
                        isSelected
                          ? "bg-brand-600/20 text-brand-300 font-bold"
                          : "text-dark-200 hover:bg-dark-800 hover:text-white font-medium"
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <span
                          className={`shrink-0 ${
                            isSelected ? "text-brand-400" : "text-dark-400"
                          }`}
                        >
                          <InstrumentIcon
                            timbre={timbre.id}
                            className="w-4 h-4"
                          />
                        </span>
                        <span className="truncate">{timbre.label}</span>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        {isThisLoaded && (
                          <span
                            className="w-1.5 h-1.5 rounded-full bg-brand-500 shrink-0"
                            title="Carregado na memória"
                          />
                        )}
                        {isSelected && (
                          <svg
                            className="w-4 h-4 text-brand-400 shrink-0"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2.5}
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Informação sobre o Timbre (Clean: sem prefixo 'Carregado') */}
          {isLoadingSamples ? (
            <div className="bg-dark-900/90 border border-amber-500/30 rounded-lg p-2.5 flex flex-col gap-1.5 animate-in fade-in duration-200">
              <div className="flex items-center justify-between text-xs">
                <span className="text-amber-300 font-semibold">
                  Carregando {currentOption?.label}...
                </span>
                <span className="font-mono font-bold text-amber-400 text-xs">
                  {loadingPercent}%
                </span>
              </div>

              <div className="w-full bg-dark-950 h-2 rounded-full overflow-hidden border border-dark-700/80">
                <div
                  className="bg-gradient-to-r from-amber-500 via-brand-600 to-brand-400 h-full transition-all duration-200 rounded-full"
                  style={{ width: `${Math.max(6, loadingPercent)}%` }}
                />
              </div>
            </div>
          ) : (
            <div className="px-3 py-2 bg-dark-900 border border-dark-700/60 rounded-lg text-xs text-dark-300 font-medium flex items-center gap-2">
              {isTimbreReady && (
                <span
                  className="w-2 h-2 rounded-full bg-brand-500 shrink-0 shadow-[0_0_6px_rgba(153,109,255,0.4)]"
                  title="Carregado"
                />
              )}
              <span>{currentOption?.description}</span>
            </div>
          )}
        </div>

        {/* Coluna de Controles de Áudio (Volume & Chave de Sustain Clean) */}
        <div className="flex flex-col gap-3 bg-dark-900/50 border border-dark-700/60 rounded-lg p-3">
          {/* Slider de Volume */}
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="volume-slider"
              className="text-xs font-bold text-dark-300 uppercase tracking-wider flex items-center justify-between"
            >
              <span>Volume</span>
              <span className="font-mono text-brand-300 font-bold">
                {Math.round(volume * 100)}%
              </span>
            </label>
            <input
              id="volume-slider"
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={volume}
              onChange={(e) => onVolumeChange(parseFloat(e.target.value))}
              className="w-full accent-brand-500 cursor-pointer h-2 bg-dark-950 rounded-lg appearance-none mt-1"
            />
          </div>

          {/* Chave de Sustain (Chave deslizante esquerda/direita: OFF / ON) */}
          <div className="pt-2.5 border-t border-dark-700/60 flex items-center justify-between">
            <span className="text-xs font-bold text-dark-300 uppercase tracking-wider">
              Sustain
            </span>

            <button
              type="button"
              role="switch"
              aria-checked={isSustainOn}
              onClick={onToggleSustain}
              title={
                isSustainOn
                  ? "Sustain ativado (ON): clique para desligar"
                  : "Sustain desativado (OFF): clique para ligar"
              }
              className="flex items-center gap-2.5 group cursor-pointer focus:outline-none"
            >
              <span
                className={`text-xs font-bold font-mono tracking-wider transition-colors ${
                  isSustainOn ? "text-brand-300" : "text-dark-400"
                }`}
              >
                {isSustainOn ? "ON" : "OFF"}
              </span>

              {/* Trilho da chave deslizante (Switch Toggle) */}
              <div
                className={`relative w-11 h-6 rounded-full transition-colors duration-200 border p-0.5 flex items-center ${
                  isSustainOn
                    ? "bg-brand-600 border-brand-500 shadow-[0_0_8px_rgba(130,87,229,0.4)]"
                    : "bg-dark-950 border-dark-600 group-hover:border-dark-500"
                }`}
              >
                {/* Botão que corre para a esquerda (OFF) e direita (ON) */}
                <div
                  className={`w-4.5 h-4.5 rounded-full bg-white shadow-md transform transition-transform duration-200 ease-in-out ${
                    isSustainOn ? "translate-x-5" : "translate-x-0"
                  }`}
                />
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}