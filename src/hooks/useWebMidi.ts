"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { midiToPianoIndex } from "@/utils/midiHelper";

interface UseWebMidiOptions {
  onNoteOn?: (midiNumber: number, velocity: number) => void;
  onNoteOff?: (midiNumber: number) => void;
}

export function useWebMidi({ onNoteOn, onNoteOff }: UseWebMidiOptions = {}) {
  const [isSupported, setIsSupported] = useState(false);
  const [deviceName, setDeviceName] = useState<string | null>(null);
  const [activeNotes, setActiveNotes] = useState<number[]>([]);

  // Refs para manter callbacks sempre atualizados sem recriar listeners
  const onNoteOnRef = useRef(onNoteOn);
  const onNoteOffRef = useRef(onNoteOff);
  useEffect(() => {
    onNoteOnRef.current = onNoteOn;
    onNoteOffRef.current = onNoteOff;
  }, [onNoteOn, onNoteOff]);

  const handleMidiMessage = useCallback((event: any) => {
    if (!event.data || event.data.length < 2) return;
    const [status, noteNumber, velocity = 0] = event.data;
    const command = status >> 4; // 9 = Note On, 8 = Note Off

    if (command === 9 && velocity > 0) {
      // Note On
      setActiveNotes((prev) => (prev.includes(noteNumber) ? prev : [...prev, noteNumber]));
      if (onNoteOnRef.current) {
        onNoteOnRef.current(noteNumber, velocity);
      }
    } else if (command === 8 || (command === 9 && velocity === 0)) {
      // Note Off
      setActiveNotes((prev) => prev.filter((n) => n !== noteNumber));
      if (onNoteOffRef.current) {
        onNoteOffRef.current(noteNumber);
      }
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
