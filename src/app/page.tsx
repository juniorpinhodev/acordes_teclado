"use client";

import React, { useState, useMemo, useCallback } from "react";
import { Header } from "@/components/Header";
import { ControlsCard } from "@/components/ControlsCard";
import { AudioControls } from "@/components/AudioControls";
import { ChordInversionCard } from "@/components/ChordInversionCard";
import { SlotsSection } from "@/components/SlotsSection";
import { ConfirmModal } from "@/components/ConfirmModal";
import { Toast } from "@/components/Toast";
import { Footer } from "@/components/Footer";
import { useChordSlots } from "@/hooks/useChordSlots";
import { useAudioEngine } from "@/hooks/useAudioEngine";
import { useWebMidi } from "@/hooks/useWebMidi";
import {
  getPitch,
  isFlatChord,
  getChordMeta,
  calculateInversions,
  getInversionDescriptions,
  formatNotesText,
  fitTo2Octaves,
} from "@/utils/musicTheory";
import { detectChordFromPitches } from "@/utils/midiHelper";
import { CHORD_INTERVALS } from "@/constants/chords";
import { SavedChordSlot } from "@/types/music";

export default function HomePage() {
  const [rootNote, setRootNote] = useState<string>("C");
  const [chordType, setChordType] = useState<string>("major");
  const [inversionIndex, setInversionIndex] = useState<number>(0);
  const [targetSlot, setTargetSlot] = useState<number | "auto">("auto");

  // Hook de Slots da Sequência
  const {
    slots,
    toastMessage,
    modalConfig,
    addSlot,
    deleteEmptySlot,
    saveSlot,
    swapSlots,
    toggleLock,
    removeSlot,
    clearAllSlots,
    closeModal,
  } = useChordSlots();

  // Hook do Motor de Áudio (smplr)
  const {
    currentTimbre,
    setTimbre,
    volume,
    setVolume,
    isLoadingSamples,
    loadingPercent,
    isTimbreReady,
    loadedTimbres,
    isSustainOn,
    setIsSustainOn,
    toggleSustain,
    loadCurrentTimbre,
    playNote,
    stopNote,
    playChord,
  } = useAudioEngine();

  // Hook do Controlador MIDI via Web MIDI API
  const {
    isSupported: isMidiSupported,
    connected: isMidiConnected,
    deviceName: midiDeviceName,
    activeNotes: activeMidiNotes,
    activeKeyIndices: liveMidiKeyIndices,
  } = useWebMidi({
    onNoteOn: (note, vel) => playNote(note, vel),
    onNoteOff: (note) => stopNote(note),
    onSustainPedalChange: (isDown) => setIsSustainOn(isDown),
  });

  // Detecção em tempo real de acordes tocados no teclado MIDI físico
  const detectedChord = useMemo(
    () => detectChordFromPitches(activeMidiNotes),
    [activeMidiNotes]
  );

  // Cálculos musicais derivados para os seletores
  const useFlat = useMemo(() => isFlatChord(rootNote, chordType), [rootNote, chordType]);
  const rootIndex = useMemo(() => getPitch(rootNote), [rootNote]);
  const intervals = useMemo(() => CHORD_INTERVALS[chordType] || [0, 4, 7], [chordType]);
  const inversions = useMemo(
    () => calculateInversions(intervals, rootIndex),
    [intervals, rootIndex]
  );
  const inversionDescriptions = useMemo(
    () => getInversionDescriptions(intervals.length),
    [intervals.length]
  );
  const { chordSymbol, chordFullName } = useMemo(
    () => getChordMeta(rootNote, chordType),
    [rootNote, chordType]
  );

  // Proteção para caso o acorde mude de 4 para 3 notas e a inversão selecionada seja 3
  const safeInversionIndex = inversionIndex < inversions.length ? inversionIndex : 0;

  // Próximo slot alvo
  const currentTargetIndex = useMemo(() => {
    if (targetSlot === "auto") {
      return slots.findIndex((s) => s === null);
    }
    return targetSlot;
  }, [targetSlot, slots]);

  // Salvar acorde atual
  const handleSaveChord = useCallback(
    (forcedInversion?: number) => {
      const chosenInv =
        forcedInversion !== undefined && forcedInversion < inversions.length
          ? forcedInversion
          : safeInversionIndex;

      const chosenKeys = inversions[chosenInv];
      const invMeta = inversionDescriptions[chosenInv] || {
        name: `Inversão ${chosenInv}`,
        short: `${chosenInv}ª Inv.`,
        desc: "",
      };

      const newSlot: SavedChordSlot = {
        root: rootNote,
        type: chordType,
        chordName: chordSymbol,
        chordFullName: chordFullName,
        inversionIdx: chosenInv,
        inversionName: invMeta.name,
        inversionShort: invMeta.short,
        keys: chosenKeys,
        notesText: formatNotesText(chosenKeys, useFlat),
        useFlat: useFlat,
        locked: false,
      };

      saveSlot(newSlot, targetSlot);
    },
    [
      inversions,
      safeInversionIndex,
      inversionDescriptions,
      rootNote,
      chordType,
      chordSymbol,
      chordFullName,
      useFlat,
      saveSlot,
      targetSlot,
    ]
  );

  // Salvar acorde detectado diretamente do teclado MIDI
  const handleSaveDetectedMidiChord = useCallback(() => {
    if (!detectedChord) return;
    const { root, type, chordSymbol: symbol } = detectedChord;
    const isFlat = isFlatChord(root, type);
    const chordIntervals = CHORD_INTERVALS[type] || [0, 4, 7];
    const rootIdx = getPitch(root);
    const calcInvs = calculateInversions(chordIntervals, rootIdx);
    const descriptions = getInversionDescriptions(chordIntervals.length);

    const newSlot: SavedChordSlot = {
      root,
      type,
      chordName: symbol,
      chordFullName: `${root} ${symbol}`,
      inversionIdx: 0,
      inversionName: descriptions[0]?.name || "Estado Fundamental",
      inversionShort: descriptions[0]?.short || "Fund.",
      keys: calcInvs[0],
      notesText: formatNotesText(calcInvs[0], isFlat),
      useFlat: isFlat,
      locked: false,
    };

    saveSlot(newSlot, targetSlot);
  }, [detectedChord, saveSlot, targetSlot]);

  // Carregar acorde de um slot salvo para os seletores
  const handleLoadSlot = useCallback(
    (index: number) => {
      const slot = slots[index];
      if (!slot) return;

      setRootNote(slot.root);
      setChordType(slot.type);
      setInversionIndex(slot.inversionIdx);

      window.scrollTo({ top: 0, behavior: "smooth" });
    },
    [slots]
  );

  // Tocar nota ao clicar em qualquer tecla do piano na tela
  const handlePianoKeyClick = useCallback(
    (pianoIndex: number) => {
      const midiNote = 48 + pianoIndex; // C3 + índice
      playNote(midiNote, 90);
      setTimeout(() => {
        stopNote(midiNote);
      }, 700);
    },
    [playNote, stopNote]
  );

  return (
    <>
      <Header />

      <main className="w-full max-w-[840px] flex flex-col items-center">
        {/* Painel de Controles de Acordes (Configurações no topo) */}
        <ControlsCard
          rootNote={rootNote}
          onRootChange={setRootNote}
          chordType={chordType}
          onTypeChange={setChordType}
          inversionIndex={safeInversionIndex}
          onInversionChange={setInversionIndex}
          inversionOptions={inversionDescriptions}
          targetSlot={targetSlot}
          onTargetSlotChange={setTargetSlot}
          slots={slots}
          onSave={() => handleSaveChord()}
        />

        {/* Painel de Áudio e Seleção de Timbres (Abaixo dos controles de acordes) */}
        <AudioControls
          isMidiSupported={isMidiSupported}
          isMidiConnected={isMidiConnected}
          midiDeviceName={midiDeviceName}
          detectedChordName={detectedChord?.chordSymbol || null}
          onSaveDetectedChord={detectedChord ? handleSaveDetectedMidiChord : undefined}
          currentTimbre={currentTimbre}
          onSelectTimbre={setTimbre}
          isLoadingSamples={isLoadingSamples}
          loadingPercent={loadingPercent}
          isTimbreReady={isTimbreReady}
          loadedTimbres={loadedTimbres}
          onLoadCurrentTimbre={loadCurrentTimbre}
          volume={volume}
          onVolumeChange={setVolume}
          isSustainOn={isSustainOn}
          onToggleSustain={toggleSustain}
        />

        {/* Grade de Inversões em Tempo Real */}
        <div className="w-full flex flex-col gap-6 sm:gap-8">
          {/* Estado Fundamental */}
          {inversions[0] && (
            <ChordInversionCard
              title={`${chordSymbol} - Estado Fundamental`}
              notesText={formatNotesText(inversions[0], useFlat)}
              keys={inversions[0]}
              liveKeys={liveMidiKeyIndices}
              useFlat={useFlat}
              onSave={() => handleSaveChord(0)}
              onPlayChord={() => playChord(inversions[0])}
              onKeyClick={handlePianoKeyClick}
            />
          )}

          {/* 1ª Inversão */}
          {inversions[1] && (
            <ChordInversionCard
              title={`${chordSymbol} - 1ª Inversão`}
              notesText={formatNotesText(inversions[1], useFlat)}
              keys={inversions[1]}
              liveKeys={liveMidiKeyIndices}
              useFlat={useFlat}
              onSave={() => handleSaveChord(1)}
              onPlayChord={() => playChord(inversions[1])}
              onKeyClick={handlePianoKeyClick}
            />
          )}

          {/* 2ª Inversão */}
          {inversions[2] && (
            <ChordInversionCard
              title={`${chordSymbol} - 2ª Inversão`}
              notesText={formatNotesText(inversions[2], useFlat)}
              keys={inversions[2]}
              liveKeys={liveMidiKeyIndices}
              useFlat={useFlat}
              onSave={() => handleSaveChord(2)}
              onPlayChord={() => playChord(inversions[2])}
              onKeyClick={handlePianoKeyClick}
            />
          )}

          {/* 3ª Inversão (Apenas para acordes com 4 notas ou mais) */}
          {inversions[3] && (
            <ChordInversionCard
              title={`${chordSymbol} - 3ª Inversão (Sétima no Baixo)`}
              notesText={formatNotesText(inversions[3], useFlat)}
              keys={inversions[3]}
              liveKeys={liveMidiKeyIndices}
              useFlat={useFlat}
              onSave={() => handleSaveChord(3)}
              onPlayChord={() => playChord(inversions[3])}
              onKeyClick={handlePianoKeyClick}
            />
          )}
        </div>

        {/* Seção de Slots da Música com Sequenciador */}
        <SlotsSection
          slots={slots}
          currentTargetIndex={currentTargetIndex}
          onSelectTarget={(index) => setTargetSlot(index)}
          onSwap={swapSlots}
          onToggleLock={toggleLock}
          onRemove={removeSlot}
          onDeleteEmptySlot={deleteEmptySlot}
          onAddSlot={addSlot}
          onClearAll={clearAllSlots}
          onLoadSlot={handleLoadSlot}
          onPlaySlot={(keys) => playChord(keys)}
        />
      </main>

      <Footer />

      {/* Modal de Confirmação */}
      <ConfirmModal config={modalConfig} onClose={closeModal} />

      {/* Notificação Toast */}
      <Toast message={toastMessage} />
    </>
  );
}
