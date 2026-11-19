"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { SavedChordSlot, ModalConfig } from "@/types/music";
import { STORAGE_KEY, INITIAL_SLOTS } from "@/constants/chords";

export function useChordSlots() {
  const [slots, setSlots] = useState<(SavedChordSlot | null)[]>(() =>
    Array(INITIAL_SLOTS).fill(null)
  );
  const [isHydrated, setIsHydrated] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [modalConfig, setModalConfig] = useState<ModalConfig | null>(null);
  const toastTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Carrega do localStorage no mount inicial (lado do cliente)
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          const loadedSlots: (SavedChordSlot | null)[] = [...parsed];
          // Garante no mínimo INITIAL_SLOTS (3)
          while (loadedSlots.length < INITIAL_SLOTS) {
            loadedSlots.push(null);
          }
          setSlots(loadedSlots);
        }
      }
    } catch (err) {
      console.error("Erro ao carregar slots:", err);
    } finally {
      setIsHydrated(true);
    }
  }, []);

  // Persiste sempre que os slots mudarem
  const persistSlots = useCallback((updatedSlots: (SavedChordSlot | null)[]) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedSlots));
    } catch (err) {
      console.error("Erro ao persistir slots:", err);
    }
  }, []);

  const showToast = useCallback((msg: string) => {
    setToastMessage(msg);
    if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
    toastTimeoutRef.current = setTimeout(() => {
      setToastMessage(null);
    }, 3200);
  }, []);

  // Adicionar um novo slot vazio
  const addSlot = useCallback(() => {
    setSlots((prev) => {
      const updated = [...prev, null];
      persistSlots(updated);
      showToast(`Slot ${updated.length} adicionado!`);
      return updated;
    });
  }, [persistSlots, showToast]);

  // Remover um slot vazio extra (mantendo pelo menos 3)
  const deleteEmptySlot = useCallback(
    (index: number) => {
      setSlots((prev) => {
        if (prev.length <= INITIAL_SLOTS) {
          showToast("O sequenciador deve manter no mínimo 3 slots.");
          return prev;
        }
        const updated = prev.filter((_, i) => i !== index);
        persistSlots(updated);
        showToast(`Slot ${index + 1} removido.`);
        return updated;
      });
    },
    [persistSlots, showToast]
  );

  const saveSlot = useCallback(
    (slotData: SavedChordSlot, targetChoice: number | "auto") => {
      let targetIndex: number;

      setSlots((prev) => {
        const updated = [...prev];

        if (targetChoice === "auto") {
          const firstNull = updated.findIndex((s) => s === null);
          if (firstNull === -1) {
            // Todos os slots existentes estão cheios: cria um novo automaticamente!
            targetIndex = updated.length;
            updated.push(slotData);
            persistSlots(updated);
            showToast(`✓ ${slotData.chordName} (${slotData.inversionShort}) salvo no novo Slot ${targetIndex + 1}!`);
            return updated;
          } else {
            targetIndex = firstNull;
          }
        } else {
          targetIndex = targetChoice;
          // Expande se o índice for maior que o tamanho atual
          while (updated.length <= targetIndex) {
            updated.push(null);
          }
        }

        updated[targetIndex] = slotData;
        persistSlots(updated);
        showToast(`✓ ${slotData.chordName} (${slotData.inversionShort}) salvo no Slot ${targetIndex + 1}!`);
        return updated;
      });
    },
    [showToast, persistSlots]
  );

  const swapSlots = useCallback(
    (fromIndex: number, toIndex: number) => {
      setSlots((prev) => {
        if (
          fromIndex === toIndex ||
          fromIndex < 0 ||
          fromIndex >= prev.length ||
          toIndex < 0 ||
          toIndex >= prev.length
        ) {
          return prev;
        }

        const slotFrom = prev[fromIndex];
        const slotTo = prev[toIndex];

        if (slotFrom?.locked) {
          showToast(`Slot ${fromIndex + 1} está fixado. Libere a trava para mover.`);
          return prev;
        }
        if (slotTo?.locked) {
          showToast(`Slot ${toIndex + 1} está fixado. Libere a trava para substituir.`);
          return prev;
        }

        const updated = [...prev];
        const temp = updated[fromIndex];
        updated[fromIndex] = updated[toIndex];
        updated[toIndex] = temp;
        persistSlots(updated);
        showToast(`Trocados: Slot ${fromIndex + 1} e Slot ${toIndex + 1}`);
        return updated;
      });
    },
    [showToast, persistSlots]
  );

  const toggleLock = useCallback(
    (index: number) => {
      setSlots((prev) => {
        const current = prev[index];
        if (!current) return prev;

        const nextState = !current.locked;
        const updated = [...prev];
        updated[index] = { ...current, locked: nextState };
        persistSlots(updated);
        showToast(nextState ? `Slot ${index + 1} fixado.` : `Slot ${index + 1} liberado.`);
        return updated;
      });
    },
    [showToast, persistSlots]
  );

  const removeSlot = useCallback(
    (index: number) => {
      const slot = slots[index];
      if (!slot) return;

      if (slot.locked) {
        showToast(`Slot ${index + 1} está fixado. Libere a trava antes de excluir.`);
        return;
      }

      const canDeleteSlotEntirely = slots.length > INITIAL_SLOTS;

      setModalConfig({
        title: `Deletar o Slot ${index + 1}?`,
        message: `Deseja limpar o acorde deste slot ou remover o slot completamente da sequência?`,
        highlightTitle: `Slot ${index + 1}: ${slot.chordName}`,
        highlightDetail: slot.inversionName,
        confirmText: "🗑️ Limpar Acorde",
        secondaryText: canDeleteSlotEntirely ? "✂️ Excluir Slot" : undefined,
        cancelText: "Cancelar",
        onConfirm: () => {
          setSlots((prev) => {
            const updated = [...prev];
            updated[index] = null;
            persistSlots(updated);
            return updated;
          });
          setModalConfig(null);
          showToast(`Acorde do Slot ${index + 1} removido.`);
        },
        onSecondaryConfirm: canDeleteSlotEntirely
          ? () => {
              setSlots((prev) => {
                const updated = prev.filter((_, i) => i !== index);
                persistSlots(updated);
                return updated;
              });
              setModalConfig(null);
              showToast(`Slot ${index + 1} excluído da sequência.`);
            }
          : undefined,
      });
    },
    [slots, showToast, persistSlots]
  );

  const clearAllSlots = useCallback(() => {
    if (slots.every((s) => s === null)) {
      showToast("Nenhum acorde salvo para limpar.");
      return;
    }

    setModalConfig({
      title: "Limpar todos os slots?",
      message:
        "Você tem certeza de que deseja limpar todos os acordes salvos da música? Os slots voltarão ao estado inicial de 3 posições vazias.",
      highlightTitle: `${slots.length} Slots na Sequência`,
      highlightDetail: "Resetar Repertório",
      confirmText: "🗑️ Limpar Todos",
      cancelText: "Cancelar",
      onConfirm: () => {
        const cleared = Array(INITIAL_SLOTS).fill(null);
        setSlots(cleared);
        persistSlots(cleared);
        setModalConfig(null);
        showToast("Todos os slots foram limpos e resetados para 3 slots.");
      },
    });
  }, [slots, showToast, persistSlots]);

  const closeModal = useCallback(() => {
    setModalConfig(null);
  }, []);

  return {
    slots,
    isHydrated,
    toastMessage,
    modalConfig,
    showToast,
    addSlot,
    deleteEmptySlot,
    saveSlot,
    swapSlots,
    toggleLock,
    removeSlot,
    clearAllSlots,
    closeModal,
  };
}
