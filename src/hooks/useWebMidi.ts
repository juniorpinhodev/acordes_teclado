"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { midiToPianoIndex } from "@/utils/midiHelper";

interface UseWebMidiOptions {
  onNoteOn?: (midiNumber: number, velocity: number) => void;
  onNoteOff?: (midiNumber: number) => void;
  onSustainPedalChange?: (isDown: boolean) => void;
}

export function useWebMidi({ onNoteOn, onNoteOff, onSustainPedalChange }: UseWebMidiOptions = {}) {
  const [isSupported, setIsSupported] = useState(false);
  const [deviceName, setDeviceName] = useState<string | null>(null);
  const [activeNotes, setActiveNotes] = useState<number[]>([]);

  // Refs para manter callbacks sempre sincronizados sem recriar listeners
  const onNoteOnRef = useRef(onNoteOn);
  const onNoteOffRef = useRef(onNoteOff);
  const onSustainPedalChangeRef = useRef(onSustainPedalChange);
  const physicallyPressedNotesRef = useRef<Set<number>>(new Set());

  useEffect(() => {
    onNoteOnRef.current = onNoteOn;
    onNoteOffRef.current = onNoteOff;
    onSustainPedalChangeRef.current = onSustainPedalChange;
  }, [onNoteOn, onNoteOff, onSustainPedalChange]);

  const handleMidiMessage = useCallback((event: any) => {
    if (!event.data || event.data.length < 2) return;
    const [status, noteNumber, velocity = 0] = event.data;
    const command = status >> 4; // 9 = Note On, 8 = Note Off, 11 (0xB) = Control Change

    // 1. Note On (tecla pressionada com velocidade > 0)
    if (command === 9 && velocity > 0) {
      physicallyPressedNotesRef.current.add(noteNumber);
      setActiveNotes(Array.from(physicallyPressedNotesRef.current));

      if (onNoteOnRef.current) {
        onNoteOnRef.current(noteNumber, velocity);
      }
    }
    // 2. Note Off (comando 8 ou comando 9 com velocidade 0 = tecla solta)
    else if (command === 8 || (command === 9 && velocity === 0)) {
      physicallyPressedNotesRef.current.delete(noteNumber);
      setActiveNotes(Array.from(physicallyPressedNotesRef.current));

      if (onNoteOffRef.current) {
        onNoteOffRef.current(noteNumber);
      }
    }
    // 3. Control Change (CC 64 = Pedal de Sustain físico)
    else if (command === 11 && noteNumber === 64) {
      if (onSustainPedalChangeRef.current) {
        onSustainPedalChangeRef.current(velocity >= 64);
      }
    }
    // 4. All Notes Off / All Sound Off (CC 120 / CC 123)
    else if (command === 11 && (noteNumber === 120 || noteNumber === 123)) {
      physicallyPressedNotesRef.current.forEach((n) => {
        onNoteOffRef.current?.(n);
      });
      physicallyPressedNotesRef.current.clear();
      setActiveNotes([]);
    }
  }, []);

  useEffect(() => {
    if (typeof window === "undefined" || !navigator.requestMIDIAccess) {
      setIsSupported(false);
      return;
    }

    setIsSupported(true);
    let midiAccessObj: any = null;

    navigator
      .requestMIDIAccess({ sysex: false })
      .then((midiAccess) => {
        midiAccessObj = midiAccess;

        const updateInputs = () => {
          const inputs = Array.from(midiAccess.inputs.values()) as any[];
          if (inputs.length > 0) {
            const firstConnected = inputs.find((i) => i.state === "connected") || inputs[0];
            setDeviceName(firstConnected.name || "Controlador MIDI");
          } else {
            setDeviceName(null);
            physicallyPressedNotesRef.current.forEach((n) => {
              onNoteOffRef.current?.(n);
            });
            physicallyPressedNotesRef.current.clear();
            setActiveNotes([]);
          }

          // Conecta listener em todas as entradas disponíveis
          inputs.forEach((input: any) => {
            input.onmidimessage = handleMidiMessage;
          });
        };

        updateInputs();
        midiAccess.onstatechange = () => {
          updateInputs();
        };
      })
      .catch((err) => {
        console.warn("Acesso ao Web MIDI API recusado ou indisponível:", err);
        setIsSupported(false);
      });

    return () => {
      if (midiAccessObj) {
        midiAccessObj.onstatechange = null;
        for (const input of midiAccessObj.inputs.values()) {
          input.onmidimessage = null;
        }
      }
    };
  }, [handleMidiMessage]);

  const activeKeyIndices = activeNotes.map((n) => midiToPianoIndex(n));

  return {
    isSupported,
    connected: !!deviceName,
    deviceName,
    activeNotes,
    activeKeyIndices,
  };
}