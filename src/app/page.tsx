"use client";

import React, { useState, useMemo, useCallback } from "react";
import { Header } from "@/components/Header";
import { ControlsCard } from "@/components/ControlsCard";
import { ChordInversionCard } from "@/components/ChordInversionCard";
import { SlotsSection } from "@/components/SlotsSection";
import { ConfirmModal } from "@/components/ConfirmModal";
import { Toast } from "@/components/Toast";
import { Footer } from "@/components/Footer";
import { useChordSlots } from "@/hooks/useChordSlots";
import {
  getPitch,
  isFlatChord,
  getChordMeta,
  calculateInversions,
  getInversionDescriptions,
  formatNotesText,
} from "@/utils/musicTheory";
import { CHORD_INTERVALS } from "@/constants/chords";
import { SavedChordSlot } from "@/types/music";

export default function HomePage() {
  const [rootNote, setRootNote] = useState<string>("C");
  const [chordType, setChordType] = useState<string>("major");
  const [inversionIndex, setInversionIndex] = useState<number>(0);
  const [targetSlot, setTargetSlot] = useState<number | "auto">("auto");

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

  // Cálculos musicais derivados
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

  return (
    <>
      <Header />

      <main className="w-full max-w-[840px] flex flex-col items-center">
        {/* Painel de Controles */}
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

        {/* Grade de Inversões em Tempo Real */}
        <div className="w-full flex flex-col gap-6 sm:gap-8">
          {/* Estado Fundamental */}
          {inversions[0] && (
            <ChordInversionCard
              title={`${chordSymbol} - Estado Fundamental`}
              notesText={formatNotesText(inversions[0], useFlat)}
              keys={inversions[0]}
              useFlat={useFlat}
              onSave={() => handleSaveChord(0)}
            />
          )}

          {/* 1ª Inversão */}
          {inversions[1] && (
            <ChordInversionCard
              title={`${chordSymbol} - 1ª Inversão`}
              notesText={formatNotesText(inversions[1], useFlat)}
              keys={inversions[1]}
              useFlat={useFlat}
              onSave={() => handleSaveChord(1)}
            />
          )}

          {/* 2ª Inversão */}
          {inversions[2] && (
            <ChordInversionCard
              title={`${chordSymbol} - 2ª Inversão`}
              notesText={formatNotesText(inversions[2], useFlat)}
              keys={inversions[2]}
              useFlat={useFlat}
              onSave={() => handleSaveChord(2)}
            />
          )}

          {/* 3ª Inversão (Apenas para acordes com 4 notas ou mais) */}
          {inversions[3] && (
            <ChordInversionCard
              title={`${chordSymbol} - 3ª Inversão (Sétima no Baixo)`}
              notesText={formatNotesText(inversions[3], useFlat)}
              keys={inversions[3]}
              useFlat={useFlat}
              onSave={() => handleSaveChord(3)}
            />
          )}
        </div>

        {/* Seção de Slots da Música */}
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
